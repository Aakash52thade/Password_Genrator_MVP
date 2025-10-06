import { NextRequest } from 'next/server';
import { verifyToken } from './jwt';
import { JWTPayload } from '@/types/auth.types';

export interface AuthenticatedRequest  extends NextRequest {
    user?: JWTPayload; // here we can catch the user request
}

// * Extract token from request headers or cookies
export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization')
    if(authHeader && authHeader.startsWith('Bearer ')){
        return authHeader.substring(7); // remove "Bearer "
    }

    //  Try cookie if header was not found
    const token = request.cookies.get('auth_token')?.value;
    if(token){
        return token;
    }
    return null;
}

// Verify authentication and attach user to request
export async function authenticateRequest (
    request: NextRequest
): Promise<{success: boolean; user?: JWTPayload; error?: string}> {
    const token = getTokenFromRequest(request);

    if(!token){
        return {
            success: false,
            error: 'Authentication token not found',
        };
    }

    //try to verify token
    const decoded = verifyToken(token);

    if(!decoded){
        return{
            success: false,
            error: 'Invalid or expired token'
        }
    }

    return {
        success: true,
        user: decoded,
    };
}



