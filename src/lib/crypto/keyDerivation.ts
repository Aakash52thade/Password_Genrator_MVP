import CryptoJS from 'crypto-js';

/**
 * Derive a master encryption key from user password using PBKDF2
 * 
 * IMPORTANT: This key is used for encrypting vault items
 * It's different from the authentication password hash stored in DB
 * 
 * @param password - User's password
 * @param salt - Unique salt (use user's email)
 * @param iterations - Number of iterations (default: 100,000)
 * @returns Master encryption key (hex string)
 */
export function deriveMasterKey(
  password: string,
  salt: string,
  iterations: number = 100000
): string {
  if (!password || !salt) {
    throw new Error('Password and salt are required for key derivation');
  }

  try {
    // Derive key using PBKDF2
    const key = CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32, // 256 bits = 32 bytes
      iterations: iterations,
      hasher: CryptoJS.algo.SHA256,
    });

    // Convert to hex string
    return key.toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error('Key derivation error:', error);
    throw new Error('Failed to derive encryption key');
  }
}

/**
 * Derive master key from user credentials
 * Uses email as salt for consistency
 */
export function deriveMasterKeyFromCredentials(
  email: string,
  password: string
): string {
  // Use email as salt (ensures same key for same user)
  const salt = email.toLowerCase().trim();
  const iterations = parseInt(
    process.env.NEXT_PUBLIC_CRYPTO_ITERATIONS || '100000',
    10
  );

  return deriveMasterKey(password, salt, iterations);
}

/**
 * Generate authentication hash (for server verification)
 * This is DIFFERENT from encryption key
 * 
 * The server stores this hash, not the encryption key
 */
export function deriveAuthHash(password: string): string {
  // Server handles this with bcrypt, this is just for understanding
  // Client sends plain password to server, server hashes with bcrypt
  return password; // Actual hashing happens on server
}

/**
 * Validate that a password can derive a valid key
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Clear sensitive data from memory (best effort)
 * Note: JavaScript doesn't have true memory control, but we can help GC
 */
export function clearSensitiveData(data: string): void {
  // Overwrite with random data
  let cleared = '';
  for (let i = 0; i < data.length; i++) {
    cleared += String.fromCharCode(Math.floor(Math.random() * 256));
  }
  // Help garbage collector
  cleared = '';
}

/**
 * Check if key derivation parameters are secure
 */
export function areParametersSecure(iterations: number, keySize: number): boolean {
  const MIN_ITERATIONS = 10000;
  const RECOMMENDED_ITERATIONS = 100000;
  const MIN_KEY_SIZE = 128;

  if (iterations < MIN_ITERATIONS) {
    console.warn(
      `Iterations (${iterations}) below minimum (${MIN_ITERATIONS}). Using ${RECOMMENDED_ITERATIONS}.`
    );
    return false;
  }

  if (keySize < MIN_KEY_SIZE) {
    console.warn(`Key size (${keySize}) below minimum (${MIN_KEY_SIZE}).`);
    return false;
  }

  return true;
}

/**
 * Get recommended iterations based on device performance
 * (You can implement performance testing here)
 */
export function getRecommendedIterations(): number {
  // For now, return default
  // In production, you might test performance and adjust
  return 100000;
}