import CryptoJS from 'crypto-js';

/**
 * Generate a random salt
 */
export function generateSalt(length: number = 16): string {
  const wordArray = CryptoJS.lib.WordArray.random(length);
  return wordArray.toString(CryptoJS.enc.Hex);
}

/**
 * Generate a random IV (Initialization Vector)
 */
export function generateIV(): string {
  const wordArray = CryptoJS.lib.WordArray.random(16);
  return wordArray.toString(CryptoJS.enc.Hex);
}

/**
 * Hash data using SHA-256
 */
export function sha256(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

/**
 * Convert string to Base64
 */
export function toBase64(str: string): string {
  const words = CryptoJS.enc.Utf8.parse(str);
  return CryptoJS.enc.Base64.stringify(words);
}

/**
 * Convert Base64 to string
 */
export function fromBase64(base64: string): string {
  const words = CryptoJS.enc.Base64.parse(base64);
  return words.toString(CryptoJS.enc.Utf8);
}

/**
 * Securely compare two strings (timing-safe)
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Generate a cryptographically secure random string
 */
export function generateRandomString(length: number = 32): string {
  const wordArray = CryptoJS.lib.WordArray.random(length);
  return wordArray.toString(CryptoJS.enc.Hex).substring(0, length);
}

/**
 * Check if running in secure context (HTTPS)
 */
export function isSecureContext(): boolean {
  if (typeof window === 'undefined') {
    return true; // Server-side is considered secure
  }

  return window.isSecureContext || window.location.protocol === 'https:';
}

/**
 * Estimate encryption/decryption time
 */
export function estimateOperationTime(dataSize: number): number {
  // Very rough estimate: ~1ms per KB
  return Math.ceil(dataSize / 1024);
}

/**
 * Validate encrypted data format
 */
export function isValidEncryptedData(data: string): boolean {
  if (!data || typeof data !== 'string') {
    return false;
  }

  // Check if it looks like CryptoJS encrypted data (starts with 'U2')
  // This is a basic check - CryptoJS encrypted data is base64
  try {
    return data.length > 10 && /^[A-Za-z0-9+/=]+$/.test(data);
  } catch {
    return false;
  }
}

/**
 * Get encryption metadata
 */
export function getEncryptionMetadata() {
  return {
    algorithm: 'AES-256-CBC',
    library: 'CryptoJS',
    keyDerivation: 'PBKDF2',
    iterations: parseInt(process.env.NEXT_PUBLIC_CRYPTO_ITERATIONS || '100000', 10),
    hashAlgorithm: 'SHA-256',
  };
}