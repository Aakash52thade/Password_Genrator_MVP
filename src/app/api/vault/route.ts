import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongodb';
import VaultItem from '@/lib/db/models/VaultItem';
import { createVaultItemSchema } from '@/lib/utils/validators';

/**
 * POST /api/vault
 * Create a new vault item
 */
export const POST = withAuth(async (request, { user }) => {
  try {
    const body = await request.json();

    // Validate input
    const validation = createVaultItemSchema.safeParse(body);
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

    // Create vault item
    const vaultItem = await VaultItem.create({
      userId: user.userId,
      ...validation.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Vault item created successfully',
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
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create vault item error:', error);
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
 * GET /api/vault
 * Get all vault items for the authenticated user
 */
export const GET = withAuth(async (request, { user }) => {
  try {
    await connectDB();

    // Get all items for this user
    const vaultItems = await VaultItem.find({ userId: user.userId })
      .sort({ updatedAt: -1 }) // Most recently updated first
      .select('-__v');

    return NextResponse.json(
      {
        success: true,
        count: vaultItems.length,
        data: vaultItems.map((item) => ({
          _id: item._id.toString(),
          title: item.title,
          username: item.username,
          encryptedPassword: item.encryptedPassword,
          url: item.url,
          encryptedNotes: item.encryptedNotes,
          tags: item.tags,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get vault items error:', error);
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