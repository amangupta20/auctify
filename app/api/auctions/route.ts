import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const auctions = await prisma.auction.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gt: new Date(),
        },
      },
      include: {
        _count: {
          select: { bids: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Cache headers for client
    const headers = new Headers();
    headers.set('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');

    return NextResponse.json(auctions, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
} 