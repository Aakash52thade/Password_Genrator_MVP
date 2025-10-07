// src/lib/utils/validators.ts
// UPDATED: Relaxed password requirements for easier testing
import { z } from 'zod';

// ==================== AUTH SCHEMAS ====================

export const registerSchema = z
  .object({
    email: z
      .string()
      .email('Invalid email address')
      .min(1, 'Email is required'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
      // Removed strict regex requirements for easier signup

    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

// ==================== VAULT SCHEMAS ====================

export const createVaultItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),

  username: z
    .string()
    .min(1, 'Username is required')
    .max(100, 'Username cannot exceed 100 characters')
    .trim(),

  encryptedPassword: z
    .string()
    .min(1, 'Password is required'),

  url: z
    .string()
    .url('Invalid URL format')
    .max(500, 'URL cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),

  encryptedNotes: z
    .string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .optional(),

  tags: z
    .array(z.string().max(30, 'Tag cannot exceed 30 characters'))
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
});

export const updateVaultItemSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(100, 'Title cannot exceed 100 characters')
    .trim()
    .optional(),

  username: z
    .string()
    .min(1, 'Username cannot be empty')
    .max(100, 'Username cannot exceed 100 characters')
    .trim()
    .optional(),

  encryptedPassword: z
    .string()
    .min(1, 'Password cannot be empty')
    .optional(),

  url: z
    .string()
    .url('Invalid URL format')
    .max(500, 'URL cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),

  encryptedNotes: z
    .string()
    .max(2000, 'Notes cannot exceed 2000 characters')
    .optional(),

  tags: z
    .array(z.string().max(30, 'Tag cannot exceed 30 characters'))
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
});

export const vaultSearchSchema = z.object({
  q: z.string().optional(),
  tags: z.string().optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  offset: z.string().regex(/^\d+$/).optional(),
});

// ==================== TYPE EXPORTS ====================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateVaultItemInput = z.infer<typeof createVaultItemSchema>;
export type UpdateVaultItemInput = z.infer<typeof updateVaultItemSchema>;
export type VaultSearchInput = z.infer<typeof vaultSearchSchema>;