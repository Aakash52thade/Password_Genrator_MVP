'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { deriveMasterKeyFromCredentials } from '@/lib/crypto/keyDerivation';
import { generateTestString, encrypt, decrypt } from '@/lib/crypto/encryption';

interface CryptoContextType {
  masterKey: string | null;
  isUnlocked: boolean;
  unlock: (email: string, password: string) => Promise<boolean>;
  lock: () => void;
  isKeyValid: () => boolean;
  testEncryption: () => boolean;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

/**
 * Provider component for managing encryption keys
 */
export function CryptoProvider({ children }: { children: React.ReactNode }) {
  const [masterKey, setMasterKey] = useState<string | null>(null);
  const [testData, setTestData] = useState<string>('');

  // Generate test data on mount
  useEffect(() => {
    setTestData(generateTestString());
  }, []);

  /**
   * Unlock vault by deriving master key from credentials
   */
  const unlock = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        // Derive master key from user credentials
        const key = deriveMasterKeyFromCredentials(email, password);

        // Test the key by encrypting and decrypting
        const testString = generateTestString();
        const encrypted = encrypt(testString, key);
        const decrypted = decrypt(encrypted, key);

        if (decrypted !== testString) {
          console.error('Key validation failed');
          return false;
        }

        // Store key in memory
        setMasterKey(key);
        console.log('✅ Vault unlocked successfully');
        return true;
      } catch (error) {
        console.error('Failed to unlock vault:', error);
        return false;
      }
    },
    []
  );

  /**
   * Lock vault by clearing master key from memory
   */
  const lock = useCallback(() => {
    setMasterKey(null);
    console.log('🔒 Vault locked');
  }, []);

  /**
   * Check if master key is set and valid
   */
  const isKeyValid = useCallback((): boolean => {
    if (!masterKey) return false;

    try {
      // Test encryption/decryption
      const testString = generateTestString();
      const encrypted = encrypt(testString, masterKey);
      const decrypted = decrypt(encrypted, masterKey);
      return decrypted === testString;
    } catch {
      return false;
    }
  }, [masterKey]);

  /**
   * Test encryption functionality
   */
  const testEncryption = useCallback((): boolean => {
    if (!masterKey) return false;

    try {
      const encrypted = encrypt(testData, masterKey);
      const decrypted = decrypt(encrypted, masterKey);
      return decrypted === testData;
    } catch {
      return false;
    }
  }, [masterKey, testData]);

  const value: CryptoContextType = {
    masterKey,
    isUnlocked: !!masterKey,
    unlock,
    lock,
    isKeyValid,
    testEncryption,
  };

  return <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>;
}

/**
 * Hook to use crypto context
 */
export function useCrypto() {
  const context = useContext(CryptoContext);

  if (context === undefined) {
    throw new Error('useCrypto must be used within CryptoProvider');
  }

  return context;
}

/**
 * Hook to require unlocked vault (throws if locked)
 */
export function useRequireUnlocked() {
  const { isUnlocked, masterKey } = useCrypto();

  if (!isUnlocked || !masterKey) {
    throw new Error('Vault is locked. Please unlock first.');
  }

  return { masterKey };
}