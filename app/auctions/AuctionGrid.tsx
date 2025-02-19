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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const router = useRouter();

  const fetchAuctions = async (retryAttempt = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('/api/auctions', {
        cache: 'no-store',
        next: { revalidate: 0 },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Failed to fetch auctions');
      
      const data = await response.json();
      if (!data.auctions) throw new Error('Invalid response format');
      
      setAuctions(data.auctions);
      setRetryCount(0); // Reset retry count on success
      
    } catch (error) {
      console.error('Error fetching auctions:', error);
      
      if (retryAttempt < 3) { // Retry up to 3 times
        setRetryCount(retryAttempt + 1);
        setTimeout(() => fetchAuctions(retryAttempt + 1), 1000 * (retryAttempt + 1)); // Exponential backoff
      } else {
        setError('Unable to load auctions. Please refresh the page.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let lastUpdate = Date.now();
    let timeoutId: NodeJS.Timeout;

    const updateAuctions = async () => {
      if (Date.now() - lastUpdate < 15000) return;
      
      if (isMounted) {
        await fetchAuctions();
        lastUpdate = Date.now();
      }
    };

    // Initial update after 15 seconds
    timeoutId = setTimeout(updateAuctions, 15000);

    // Set up polling interval (every 15 seconds)
    const interval = setInterval(updateAuctions, 15000);

    // Cleanup
    return () => {
      isMounted = false;
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(0);
    fetchAuctions();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

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
    <div className="relative">
      {isLoading && (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="inline-flex items-center px-4 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-full">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Updating...'}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {auctions.map((auction) => (
          <Link 
            key={auction.id} 
            href={`/auction/${auction.id}`}
            className="group"
            prefetch={false}
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
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
    </div>
  );
} 