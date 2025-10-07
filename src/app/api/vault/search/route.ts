import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import connectDB from '@/lib/db/mongodb';
import VaultItem from '@/lib/db/models/VaultItem';

/**
 * GET /api/vault/search?q=query&tags=tag1,tag2&limit=10&offset=0
 * Search vault items by query and/or tags
 */
export const GET = withAuth(async (request, { user }) => {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const tagsParam = searchParams.get('tags') || '';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    await connectDB();

    // Build search filter
    const filter: any = { userId: user.userId };

    // Text search on title and username
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { url: { $regex: query, $options: 'i' } },
      ];
    }

    // Tag filtering
    if (tagsParam) {
      const tags = tagsParam.split(',').map((tag) => tag.trim());
      filter.tags = { $in: tags };
    }

    // Execute search with pagination
    const [vaultItems, totalCount] = await Promise.all([
      VaultItem.find(filter)
        .sort({ updatedAt: -1 })
        .skip(offset)
        .limit(Math.min(limit, 100)) // Max 100 items per request
        .select('-__v'),
      VaultItem.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        count: vaultItems.length,
        total: totalCount,
        offset,
        limit,
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
    console.error('Search vault items error:', error);
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