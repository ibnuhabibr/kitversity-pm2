import { NextResponse } from 'next/server';
import pool from '@/lib/db/config';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-change-this');

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 });
    }

    // Cari admin di database
    const [rows]: any[] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);
    const admin = rows[0];

    if (!admin) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Bandingkan password yang diinput dengan hash di database
    const isPasswordMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordMatch) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 });
    }

    // Buat token JWT
    const token = await new SignJWT({ adminId: admin.id, username: admin.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d') // Token berlaku selama 1 hari
      .sign(SECRET_KEY);

    // Set token di httpOnly cookie
    cookies().set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 hari
      path: '/',
    });

    return NextResponse.json({ message: 'Login berhasil' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Terjadi kesalahan di server' }, { status: 500 });
  }
}