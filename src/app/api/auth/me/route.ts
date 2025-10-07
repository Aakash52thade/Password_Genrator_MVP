import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongodb';
import User from '@/lib/db/models/User';

/**
 * GET /api/auth/me
 * Get current authenticated user's information
 */
export const GET = withAuth(async (request, { user }) => {
  try {
    await connectDB();

    // Find user by ID from JWT
    const dbUser = await User.findById(user.userId).select('-password');

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: dbUser._id.toString(),
          email: dbUser.email,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
});