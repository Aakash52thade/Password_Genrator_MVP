import { NextRequest, NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/config/constants';

export async function POST(request: NextRequest) {
    try {
        const response = await NextResponse.json(
            {
               success: true,
               message: 'Logged out successfully',
            },
            {status: 200}
        );

        //clear cookie
        response.cookies.set({
            name: AUTH_CONFIG.cookieName,
            value: '',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',

        });
        return response;
    } catch (error:any) {
        console.error('Logout error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    ); 
    }
}