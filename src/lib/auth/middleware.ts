import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';
import { JWTPayload } from '@/types/auth.types';
import { AUTH_CONFIG } from '@/config/constants';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Extract token from request headers or cookies
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7); // Remove "Bearer "
  }

  // Fallback to cookie
  const token = request.cookies.get(AUTH_CONFIG.cookieName)?.value;
  if (token) {
    return token;
  }

  return null;
}

/**
 * Verify authentication and attach user to request
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ success: boolean; user?: JWTPayload; error?: string }> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      success: false,
      error: 'Authentication token not found',
    };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      success: false,
      error: 'Invalid or expired token',
    };
  }

  return {
    success: true,
    user: decoded,
  };
}

/**
 * Middleware wrapper for protected routes
 * Usage: export const GET = withAuth(async (request, { user }) => { ... });
 */
export function withAuth(
  handler: (
    request: NextRequest,
    context: { user: JWTPayload; params?: any }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: { params?: any }) => {
    const authResult = await authenticateRequest(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.error || 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Pass user to handler
    return handler(request, { user: authResult.user, params: context?.params });
  };
}