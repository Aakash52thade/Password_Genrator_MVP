// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { registerSchema } from '@/lib/utils/validators';
import { AUTH_CONFIG } from '@/config/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📝 Registration attempt:', { email: body.email });

    // Validate input
    const validation = registerSchema.safeParse(body);
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

    // Check if user already exists
    console.log('🔍 Checking existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists');
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
        },
        { status: 409 }
      );
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(password);
    console.log('✅ Password hashed');

    // Create user
    console.log('👤 Creating user...');
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    console.log('✅ User created:', user._id);

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          _id: user._id.toString(),
          email: user.email,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
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

    console.log('✅ Registration successful');
    return response;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
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