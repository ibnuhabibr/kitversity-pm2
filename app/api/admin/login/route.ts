import { NextResponse } from 'next/server';
import pool from '@/lib/db/config';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// Pastikan JWT_SECRET ada di environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET tidak ditemukan di environment variables.');
}

const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi.' }, { status: 400 });
    }

    // 1. Cari admin di database
    const [rows]: any[] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = rows[0];

    if (!admin) {
      // Jangan beri tahu mana yang salah (username atau password) untuk keamanan
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    // 2. Bandingkan password yang diinput dengan hash di database
    const isPasswordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    // 3. Jika cocok, buat token sesi (JWT)
    const token = await new SignJWT({ adminId: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Token berlaku 1 hari
      .sign(SECRET_KEY);

    // 4. Set token di httpOnly cookie agar aman
    cookies().set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    });

    return NextResponse.json({ message: 'Login berhasil!' });

  } catch (error) {
    console.error("API Login Error:", error);
    return NextResponse.json({ error: 'Terjadi kesalahan internal di server.' }, { status: 500 });
  }
}