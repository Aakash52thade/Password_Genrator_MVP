
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/auth.types';

// Read env lazily at runtime to avoid build-time crashes on Vercel
function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not set. Define it in Vercel project env vars.');
    }
    return secret;
}

function getJwtExpiresIn(): string | number {
    return process.env.JWT_EXPIRES_IN || '7d';
}

/**
  Generate JWT token
 */

export function generateToken(payload: { userId: string; email: string }): string {
    const token = jwt.sign(payload, getJwtSecret(), {
        expiresIn: getJwtExpiresIn(),
    });
    return token;
}

//  Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }

}

// * Decode JWT token without verification (for debugging)

export function decodeToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}