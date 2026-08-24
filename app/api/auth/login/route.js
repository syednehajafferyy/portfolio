import { NextResponse } from 'next/server';
import { validateCredentials, createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!validateCredentials(username, password)) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    const token = createToken({ username, role: 'admin' });

    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
