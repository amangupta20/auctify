import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
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

    return NextResponse.json(
      { auctions },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
          'Connection': 'keep-alive',
          'Keep-Alive': 'timeout=5, max=1000'
        },
      }
    );
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, must-revalidate'
        }
      }
    );
  } finally {
    await prisma.$disconnect();
  }
} 