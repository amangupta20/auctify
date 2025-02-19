'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TimeLeft from './TimeLeft';
import { useRouter } from 'next/navigation';

interface Auction {
  id: string;
  title: string;
  currentPrice: number;
  imageData: Buffer | null;
  category: string;
  condition: string;
  endDate: Date;
  _count: {
    bids: number;
  };
}

export default function AuctionGrid({ initialAuctions }: { initialAuctions: Auction[] }) {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const router = useRouter();

  useEffect(() => {
    // Update auctions every 5 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/auctions');
        if (!response.ok) throw new Error('Failed to fetch auctions');
        const data = await response.json();
        setAuctions(data);
        router.refresh(); // Refresh the page to get latest server data
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No active auctions found
        </h3>
        <p className="text-gray-500">
          Check back later or create your own auction
        </p>
      </div>
    );
  }

  return (
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
                <TimeLeft endDate={new Date(auction.endDate)} />
              </div>

              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-indigo-600">
                  {auction.category}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-indigo-600">
                  {auction.condition}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 