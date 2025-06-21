import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from './db/models';

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'your-super-secret-key-that-is-at-least-32-chars-long'
);

// Interface untuk payload JWT
// export interface JWTPayload {
//   [key: string]: any;
//   userId: number;
//   email: string;
//   role: 'admin' | 'user';
// }

// Fungsi untuk membuat token JWT
export async function createToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

// Fungsi untuk verifikasi token JWT
export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as T;
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}

// Middleware untuk autentikasi
export const middleware = (handler: any) => async (request: NextRequest, params: any) => {
    const token = cookies().get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken<{ userId?: number }>(token);

    if (!payload || typeof payload.userId !== 'number') {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await UserModel.findById(payload.userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Attach user to the request for the next handler
    (request as any).user = user;

    return handler(request, params);
};

// Fungsi untuk login (NONAKTIF SEMENTARA)
/*
export async function login(credentials: { email: string; password?: string }) {
  const user = await UserModel.findByEmail(credentials.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // TODO: Implement password hashing and comparison
  // const isPasswordMatch = credentials.password === user.password;
  // if (!isPasswordMatch) {
  //   throw new Error('Invalid email or password');
  // }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user };
}
*/

// Fungsi untuk register
export async function register(userData: {
  name: string;
  email: string;
  phone?: string;
  university?: string;
  address?: string;
}) {
  const existingUser = await UserModel.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const user = await UserModel.create({
    ...userData,
    role: 'user',
  });

  if (!user) {
    throw new Error('Failed to create user');
  }

  const token = await createToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { token, user };
}

// Fungsi untuk logout
export async function logout() {
  cookies().delete('token');
} 