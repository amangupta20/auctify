import React from 'react';
import { PrismaClient } from '@prisma/client';
import AuctionGrid from './AuctionGrid';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Browse Auctions | Auctify',
  description: 'Browse all active auctions on Auctify',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AuctionsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Auctions</h1>
          <p className="mt-2 text-sm text-gray-600">
            Discover unique items and place your bids
          </p>
        </div>

        {/* Filters Section - To be implemented */}
        <div className="mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-4">
              {/* Add filter components here */}
            </div>
          </div>
        </div>

        {/* Auctions Grid with Real-time Updates */}
        <AuctionGrid initialAuctions={auctions} />
      </div>
    </div>
  );
} 