import React from 'react';
import { PrismaClient, Auction, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import TimeLeft from './TimeLeft';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Browse Auctions | Auctify',
  description: 'Browse all active auctions on Auctify',
};

interface ExtendedAuction extends Auction {
  seller: User;
  _count: {
    bids: number;
  };
}

export default async function AuctionsPage() {
  const auctions = await prisma.auction.findMany({
    where: {
      status: 'ACTIVE',
      endDate: {
        gt: new Date(),
      },
    },
    include: {
      seller: true,
      _count: {
        select: { bids: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  }) as ExtendedAuction[];

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

        {/* Auctions Grid */}
        {auctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctions.map((auction) => (
              <Link 
                key={auction.id} 
                href={`/auction/${auction.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100">
                    {auction.imageData ? (
                      <Image
                        src={`/api/images/${auction.id}`}
                        alt={auction.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {auction.title}
                    </h3>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Current Bid
                      </span>
                      <span className="text-lg font-bold text-indigo-600">
                        ${auction.currentPrice.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{auction._count.bids} bids</span>
                      <TimeLeft endDate={auction.endDate} />
                    </div>

                    <div className="mt-2 flex items-center space-x-2">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                        {auction.category}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
                        {auction.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active auctions found
            </h3>
            <p className="text-gray-500">
              Check back later or create your own auction
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 