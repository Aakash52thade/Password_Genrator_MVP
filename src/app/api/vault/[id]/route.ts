import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongodb';
import VaultItem from '@/lib/db/models/VaultItem';
import { updateVaultItemSchema } from '@/lib/utils/validators';
import mongoose from 'mongoose';

/**
 * GET /api/vault/[id]
 * Get a single vault item by ID
 */
export const GET = withAuth(async (request, { user, params }) => {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid vault item ID',
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Find item and verify ownership
    const vaultItem = await VaultItem.findOne({
      _id: id,
      userId: user.userId,
    });

    if (!vaultItem) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vault item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: vaultItem._id.toString(),
          title: vaultItem.title,
          username: vaultItem.username,
          encryptedPassword: vaultItem.encryptedPassword,
          url: vaultItem.url,
          encryptedNotes: vaultItem.encryptedNotes,
          tags: vaultItem.tags,
          createdAt: vaultItem.createdAt,
          updatedAt: vaultItem.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get vault item error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

/**
 * PATCH /api/vault/[id]
 * Update a vault item by ID
 */
export const PATCH = withAuth(async (request, { user, params }) => {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid vault item ID',
        },
        { status: 400 }
      );
    }

    // Validate input
    const validation = updateVaultItemSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Update item (only if user owns it)
    const vaultItem = await VaultItem.findOneAndUpdate(
      {
        _id: id,
        userId: user.userId,
      },
      {
        $set: validation.data,
      },
      {
        new: true, // Return updated document
        runValidators: true,
      }
    );

    if (!vaultItem) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vault item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Vault item updated successfully',
        data: {
          _id: vaultItem._id.toString(),
          title: vaultItem.title,
          username: vaultItem.username,
          encryptedPassword: vaultItem.encryptedPassword,
          url: vaultItem.url,
          encryptedNotes: vaultItem.encryptedNotes,
          tags: vaultItem.tags,
          createdAt: vaultItem.createdAt,
          updatedAt: vaultItem.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update vault item error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
});

/**
 * DELETE /api/vault/[id]
 * Delete a vault item by ID
 */
export const DELETE = withAuth(async (request, { user, params }) => {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid vault item ID',
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete item (only if user owns it)
    const vaultItem = await VaultItem.findOneAndDelete({
      _id: id,
      userId: user.userId,
    });

    if (!vaultItem) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vault item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Vault item deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete vault item error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
});