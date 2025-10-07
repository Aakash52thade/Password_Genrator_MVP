import mongoose, { Schema, Model } from 'mongoose';
import { IVaultItem } from '@/types/vault.types';

const VaultItemSchema = new Schema<IVaultItem>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true, // Index for fast queries
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      maxlength: [100, 'Username cannot exceed 100 characters'],
    },
    encryptedPassword: {
      type: String,
      required: [true, 'Password is required'],
    },
    url: {
      type: String,
      trim: true,
      maxlength: [500, 'URL cannot exceed 500 characters'],
    },
    encryptedNotes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound index for searching
VaultItemSchema.index({ userId: 1, title: 'text', username: 'text' });

// Prevent model recompilation in development
const VaultItem: Model<IVaultItem> =
  mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);

export default VaultItem;