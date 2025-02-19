import React from 'react';
import { prisma } from '@/lib/prisma';
import AuctionGrid from './AuctionGrid';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Browse Auctions | Auctify',
  description: 'Browse all active auctions on Auctify',
};

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default async function AuctionsPage() {
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

    // Set response headers for better connection handling
    const headersList = headers();
    headersList.set('Cache-Control', 'no-store, must-revalidate');
    headersList.set('Connection', 'keep-alive');

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
  } catch (error) {
    console.error('Error loading auctions page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to load auctions
          </h2>
          <p className="text-gray-600 mb-8">
            Please try refreshing the page
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
} 