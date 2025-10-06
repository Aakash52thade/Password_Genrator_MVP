
import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types/auth.types';
import { Rethink_Sans } from 'next/font/google';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'


if (!JWT_SECRET) {
    throw new Error('Please define JWT_SECRET in .env.local');
}

/**
  Generate JWT token
 */

export function generateToken(payload: {userId: string, email: string}): string {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
    return token;
}

//  Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
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