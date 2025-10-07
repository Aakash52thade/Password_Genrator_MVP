import { PasswordOptions, PasswordStrength, GeneratorResult } from '@/types/generator.types';

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Similar characters to exclude (look-alikes)
const SIMILAR_CHARS = 'il1Lo0O';

// Ambiguous characters
const AMBIGUOUS_CHARS = '{}[]()/\\\'\"~,;:.<>';

/**
 * Generate a random password based on options
 */
export function generatePassword(options: PasswordOptions): GeneratorResult {
  let charset = '';
  let guaranteedChars: string[] = [];

  // Build character set
  if (options.includeUppercase) {
    const chars = filterChars(UPPERCASE, options);
    charset += chars;
    guaranteedChars.push(getRandomChar(chars));
  }

  if (options.includeLowercase) {
    const chars = filterChars(LOWERCASE, options);
    charset += chars;
    guaranteedChars.push(getRandomChar(chars));
  }

  if (options.includeNumbers) {
    const chars = filterChars(NUMBERS, options);
    charset += chars;
    guaranteedChars.push(getRandomChar(chars));
  }

  if (options.includeSymbols) {
    const chars = filterChars(SYMBOLS, options);
    charset += chars;
    guaranteedChars.push(getRandomChar(chars));
  }

  // If no character types selected, use all
  if (charset.length === 0) {
    charset = UPPERCASE + LOWERCASE + NUMBERS + SYMBOLS;
    if (options.excludeSimilar) {
      charset = charset.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
    }
    if (options.excludeAmbiguous) {
      charset = charset.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
    }
  }

  // Generate password
  let password = '';
  const remainingLength = options.length - guaranteedChars.length;

  // Fill remaining characters randomly
  for (let i = 0; i < remainingLength; i++) {
    password += getRandomChar(charset);
  }

  // Add guaranteed characters and shuffle
  password = shuffleString(password + guaranteedChars.join(''));

  // Calculate strength
  const strength = calculateStrength(password, charset.length);
  const entropy = calculateEntropy(password.length, charset.length);

  return {
    password,
    strength,
    entropy,
  };
}

/**
 * Filter characters based on exclude options
 */
function filterChars(chars: string, options: PasswordOptions): string {
  let filtered = chars;

  if (options.excludeSimilar) {
    filtered = filtered.split('').filter(c => !SIMILAR_CHARS.includes(c)).join('');
  }

  if (options.excludeAmbiguous) {
    filtered = filtered.split('').filter(c => !AMBIGUOUS_CHARS.includes(c)).join('');
  }

  return filtered;
}

/**
 * Get random character from string (cryptographically secure)
 */
function getRandomChar(chars: string): string {
  const randomValues = new Uint32Array(1);
  crypto.getRandomValues(randomValues);
  const randomIndex = randomValues[0] % chars.length;
  return chars[randomIndex];
}

/**
 * Shuffle string using Fisher-Yates algorithm
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    const j = randomValues[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

/**
 * Calculate password strength
 */
export function calculateStrength(password: string, charsetSize: number): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    feedback.push('Password is too short (minimum 8 characters)');
  } else if (password.length >= 12) {
    score += 1;
  } else if (password.length >= 16) {
    score += 2;
  }

  // Character variety
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

  const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;

  if (varietyCount >= 3) {
    score += 1;
  }
  if (varietyCount === 4) {
    score += 1;
  }

  // Entropy check
  const entropy = calculateEntropy(password.length, charsetSize);
  if (entropy >= 60) {
    score += 1;
  }
  if (entropy >= 80) {
    score += 1;
  }

  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Contains repeated characters');
    score = Math.max(0, score - 1);
  }

  if (/^(?:abc|123|qwe|password)/i.test(password)) {
    feedback.push('Contains common patterns');
    score = Math.max(0, score - 1);
  }

  // Generate label and color
  let label: PasswordStrength['label'];
  let color: string;

  if (score <= 1) {
    label = 'Very Weak';
    color = '#ef4444'; // red-500
  } else if (score === 2) {
    label = 'Weak';
    color = '#f97316'; // orange-500
  } else if (score === 3) {
    label = 'Medium';
    color = '#eab308'; // yellow-500
  } else if (score === 4) {
    label = 'Strong';
    color = '#22c55e'; // green-500
  } else {
    label = 'Very Strong';
    color = '#10b981'; // emerald-500
  }

  // Positive feedback
  if (score >= 4) {
    feedback.push('Excellent password strength!');
  } else if (score === 3) {
    feedback.push('Good password, consider adding more characters');
  } else {
    feedback.push('Use a longer password with mixed character types');
  }

  return {
    score: Math.min(4, score),
    label,
    feedback,
    color,
  };
}

/**
 * Calculate entropy (bits)
 */
function calculateEntropy(length: number, charsetSize: number): number {
  return Math.log2(Math.pow(charsetSize, length));
}

/**
 * Check if password contains common words
 */
export function containsCommonWords(password: string): boolean {
  const commonWords = [
    'password', 'admin', 'user', 'login', '1234', 'qwerty',
    'letmein', 'welcome', 'monkey', 'dragon', 'master'
  ];

  const lowerPassword = password.toLowerCase();
  return commonWords.some(word => lowerPassword.includes(word));
}

/**
 * Get default password options
 */
export function getDefaultOptions(): PasswordOptions {
  return {
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: true,
    excludeAmbiguous: false,
  };
}

/**
 * Validate password options
 */
export function validateOptions(options: PasswordOptions): {
  isValid: boolean;
  error?: string;
} {
  if (options.length < 4) {
    return { isValid: false, error: 'Password length must be at least 4 characters' };
  }

  if (options.length > 128) {
    return { isValid: false, error: 'Password length cannot exceed 128 characters' };
  }

  if (
    !options.includeUppercase &&
    !options.includeLowercase &&
    !options.includeNumbers &&
    !options.includeSymbols
  ) {
    return { isValid: false, error: 'At least one character type must be selected' };
  }

  return { isValid: true };
}