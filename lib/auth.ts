import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from './db/models';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

// Interface untuk payload JWT
interface JWTPayload {
  userId: number;
  email: string;
  role: 'admin' | 'user';
}

// Fungsi untuk membuat token JWT
export async function createToken(payload: JWTPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  return token;
}

// Fungsi untuk verifikasi token JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Middleware untuk autentikasi
export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Tambahkan user ke request
  const user = await UserModel.findById(payload.userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

// Fungsi untuk login
export async function login(email: string, password: string) {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  // TODO: Implementasi password hashing
  // Untuk sementara, kita asumsikan password sudah di-hash
  if (user.password !== password) {
    throw new Error('Invalid password');
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role || 'user'
  });

  return { token, user };
}

// Fungsi untuk register
export async function register(userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  university?: string;
  address?: string;
}) {
  // Cek apakah email sudah terdaftar
  const existingUser = await UserModel.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // TODO: Implementasi password hashing
  // Untuk sementara, kita simpan password as-is
  const user = await UserModel.create({
    ...userData,
    role: 'user'
  });

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  return { token, user };
}

// Fungsi untuk logout
export async function logout() {
  cookies().delete('token');
} 