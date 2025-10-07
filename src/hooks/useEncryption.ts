'use client';

import { useCallback } from 'react';
import { useCrypto } from '@/contexts/CryptoContext';
import {
  encrypt,
  decrypt,
  encryptPassword,
  decryptPassword,
  encryptNotes,
  decryptNotes,
  encryptVaultItem,
  decryptVaultItem,
} from '@/lib/crypto/encryption';

export function useEncryption() {
  const { masterKey, isUnlocked } = useCrypto();

  const encryptData = useCallback(
    (data: string): string => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return encrypt(data, masterKey);
    },
    [masterKey]
  );

  const decryptData = useCallback(
    (encryptedData: string): string => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return decrypt(encryptedData, masterKey);
    },
    [masterKey]
  );

  const encryptPasswordData = useCallback(
    (password: string): string => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return encryptPassword(password, masterKey);
    },
    [masterKey]
  );

  const decryptPasswordData = useCallback(
    (encryptedPassword: string): string => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return decryptPassword(encryptedPassword, masterKey);
    },
    [masterKey]
  );

  const encryptNotesData = useCallback(
    (notes: string): string => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return encryptNotes(notes, masterKey);
    },
    [masterKey]
  );

  const decryptNotesData = useCallback(
    (encryptedNotes: string): string => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return decryptNotes(encryptedNotes, masterKey);
    },
    [masterKey]
  );

  const encryptItem = useCallback(
    (item: { password: string; notes?: string }) => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return encryptVaultItem(item, masterKey);
    },
    [masterKey]
  );

  const decryptItem = useCallback(
    (item: { encryptedPassword: string; encryptedNotes?: string }) => {
      if (!masterKey) {
        throw new Error('Vault is locked');
      }
      return decryptVaultItem(item, masterKey);
    },
    [masterKey]
  );

  return {
    isUnlocked,
    encryptData,
    decryptData,
    encryptPassword: encryptPasswordData,
    decryptPassword: decryptPasswordData,
    encryptNotes: encryptNotesData,
    decryptNotes: decryptNotesData,
    encryptItem,
    decryptItem,
  };
}