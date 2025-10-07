import CryptoJS from 'crypto-js';

/**
 * Encrypt data using AES-256-CBC
 * @param plaintext - Data to encrypt
 * @param masterKey - Encryption key (derived from user password)
 * @returns Encrypted string (base64)
 */
export function encrypt(plaintext: string, masterKey: string): string {
  if (!plaintext) return '';
  
  try {
    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(plaintext, masterKey);
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256-CBC
 * @param ciphertext - Encrypted data (base64)
 * @param masterKey - Decryption key
 * @returns Decrypted plaintext
 */
export function decrypt(ciphertext: string, masterKey: string): string {
  if (!ciphertext) return '';
  
  try {
    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(ciphertext, masterKey);
    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!plaintext) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
    
    return plaintext;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Encrypt password for storage
 */
export function encryptPassword(password: string, masterKey: string): string {
  return encrypt(password, masterKey);
}

/**
 * Decrypt password from storage
 */
export function decryptPassword(encryptedPassword: string, masterKey: string): string {
  return decrypt(encryptedPassword, masterKey);
}

/**
 * Encrypt notes for storage
 */
export function encryptNotes(notes: string, masterKey: string): string {
  if (!notes) return '';
  return encrypt(notes, masterKey);
}

/**
 * Decrypt notes from storage
 */
export function decryptNotes(encryptedNotes: string, masterKey: string): string {
  if (!encryptedNotes) return '';
  return decrypt(encryptedNotes, masterKey);
}

/**
 * Encrypt entire vault item (useful for bulk operations)
 */
export function encryptVaultItem(
  item: {
    password: string;
    notes?: string;
  },
  masterKey: string
): {
  encryptedPassword: string;
  encryptedNotes?: string;
} {
  return {
    encryptedPassword: encryptPassword(item.password, masterKey),
    encryptedNotes: item.notes ? encryptNotes(item.notes, masterKey) : undefined,
  };
}

/**
 * Decrypt entire vault item
 */
export function decryptVaultItem(
  item: {
    encryptedPassword: string;
    encryptedNotes?: string;
  },
  masterKey: string
): {
  password: string;
  notes?: string;
} {
  return {
    password: decryptPassword(item.encryptedPassword, masterKey),
    notes: item.encryptedNotes ? decryptNotes(item.encryptedNotes, masterKey) : undefined,
  };
}

/**
 * Test if master key is valid by attempting decryption
 */
export function validateMasterKey(
  encryptedData: string,
  masterKey: string
): boolean {
  try {
    const decrypted = decrypt(encryptedData, masterKey);
    return decrypted.length > 0;
  } catch {
    return false;
  }
}

/**
 * Generate a random test string for key validation
 */
export function generateTestString(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}