import { Document } from 'mongoose';

/**
 * VaultItem interface for TypeScript
 */
export interface IVaultItem extends Document {
  userId: string;
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  encryptedNotes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * VaultItem response (sent to client)
 */
export interface VaultItemResponse {
  _id: string;
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  encryptedNotes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Create VaultItem request body
 */
export interface CreateVaultItemInput {
  title: string;
  username: string;
  encryptedPassword: string;
  url?: string;
  encryptedNotes?: string;
  tags?: string[];
}

/**
 * Update VaultItem request body
 */
export interface UpdateVaultItemInput {
  title?: string;
  username?: string;
  encryptedPassword?: string;
  url?: string;
  encryptedNotes?: string;
  tags?: string[];
}

/**
 * Search query parameters
 */
export interface VaultSearchParams {
  q?: string;
  tags?: string;
  limit?: number;
  offset?: number;
}