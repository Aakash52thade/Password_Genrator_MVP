// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { verifyPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { loginSchema } from '@/lib/utils/validators';

// Constants for auth cookie
const AUTH_CONFIG = {
  cookieName: 'auth_token',
  cookieMaxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔐 Login attempt:', { email: body.email });

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.flatten());
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Connect to database
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');

    // Find user by email
    console.log('🔍 Finding user...');
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('⚠️ User not found');
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    // Verify password
    console.log('🔐 Verifying password...');
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      console.log('⚠️ Invalid password');
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }

    console.log('✅ Password verified');

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id.toString(),
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set({
      name: AUTH_CONFIG.cookieName,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: AUTH_CONFIG.cookieMaxAge,
      path: '/',
    });

    console.log('✅ Login successful');
    return response;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}