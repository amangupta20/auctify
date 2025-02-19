import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

const prisma = new PrismaClient();

interface PageProps {
  params: { id: string };
}

interface ExtendedBid {
  id: string;
  amount: number;
  createdAt: Date;
  bidder: {
    name: string | null;
  };
}

async function placeBid(formData: FormData) {
  'use server';
  
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! }
  });

  if (!user) {
    redirect('/login');
  }

  const auctionId = formData.get('auctionId') as string;
  const amount = parseFloat(formData.get('amount') as string);

  const auction = await prisma.auction.findUnique({
    where: { id: auctionId }
  });

  if (!auction) {
    redirect('/auctions');
  }

  if (amount <= auction.currentPrice) {
    // Handle error - bid too low
    return;
  }

  if (auction.endDate < new Date()) {
    // Handle error - auction ended
    return;
  }

  if (auction.sellerId === user.id) {
    // Handle error - can't bid on own auction
    return;
  }

  await prisma.bid.create({
    data: {
      amount,
      auctionId,
      bidderId: user.id,
    },
  });

  await prisma.auction.update({
    where: { id: auctionId },
    data: { currentPrice: amount },
  });

  // Refresh the page to show the new bid
  redirect(`/auction/${auctionId}`);
}

export default async function AuctionPage({ params }: PageProps) {
  const session = await auth();
  const auction = await prisma.auction.findUnique({
    where: { id: params.id },
    include: {
      seller: true,
      bids: {
        include: {
          bidder: true,
        },
        orderBy: {
          amount: 'desc',
        },
        take: 5,
      },
    },
  });

  if (!auction) {
    redirect('/auctions');
  }

  const isOwner = session?.user?.email === auction.seller.email;
  const isEnded = auction.endDate < new Date();
  const timeLeft = new Date(auction.endDate).getTime() - new Date().getTime();
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                {auction.imageData ? (
                  <Image
                    src={`/api/images/${auction.id}`}
                    alt={auction.title}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{auction.title}</h1>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Listed by</span>
                    <Link 
                      href={`/user/${encodeURIComponent(auction.seller.email!)}`}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      {auction.seller.name}
                    </Link>
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="px-3 py-1 rounded-fulltext-indigo-600 text-xs font-medium bg-gray-100">
                      {auction.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-indigo-600 text-xs font-medium bg-gray-100">
                      {auction.condition}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Current Price</h2>
                  <p className="text-3xl font-bold text-indigo-600">${auction.currentPrice.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Started at ${auction.startPrice.toFixed(2)}</p>
                </div>

                {!isEnded && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Time Left</h2>
                    <p className="text-lg text-gray-700">
                      {daysLeft > 0 && `${daysLeft} days `}
                      {hoursLeft} hours
                    </p>
                  </div>
                )}

                {!isOwner && !isEnded && (
                  <form action={placeBid} className="mb-6">
                    <input type="hidden" name="auctionId" value={auction.id} />
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label htmlFor="amount" className="sr-only">Bid Amount</label>
                        <div className="relative rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="amount"
                            id="amount"
                            min={auction.currentPrice + 0.01}
                            step="0.01"
                            required
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Place Bid
                      </button>
                    </div>
                  </form>
                )}

                {isEnded && (
                  <div className="mb-6">
                    <p className="text-lg font-medium text-red-600">This auction has ended</p>
                  </div>
                )}

                {/* Recent Bids */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bids</h2>
                  {auction.bids.length > 0 ? (
                    <div className="space-y-4">
                      {auction.bids.map((bid: ExtendedBid) => (
                        <div key={bid.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{bid.bidder.name}</span>
                            <span className="text-gray-500">placed a bid</span>
                          </div>
                          <span className="font-medium text-gray-900">${bid.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bids yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{auction.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 