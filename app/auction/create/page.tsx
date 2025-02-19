import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from '@/lib/prisma';
import CreateAuctionForm from './CreateAuctionForm';

export const metadata = {
  title: 'Create Auction | Auctify',
  description: 'Create a new auction listing on Auctify',
};

interface CreateAuctionResponse {
  error?: string;
  success?: boolean;
  auctionId?: string;
}

async function createAuction(formData: FormData): Promise<CreateAuctionResponse> {
  'use server';
  
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startPriceStr = formData.get('startPrice') as string;
    const category = formData.get('category') as string;
    const condition = formData.get('condition') as string;
    const endDateStr = formData.get('endDate') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate required fields
    if (!title || !description || !startPriceStr || !category || !condition || !endDateStr) {
      return { error: 'Missing required fields' };
    }

    const startPrice = parseFloat(startPriceStr);
    if (isNaN(startPrice) || startPrice <= 0) {
      return { error: 'Invalid start price' };
    }

    const endDate = new Date(endDateStr);
    if (endDate <= new Date()) {
      return { error: 'End date must be in the future' };
    }

    let imageData: Buffer | null = null;
    let imageType: string | null = null;
    
    if (imageFile && imageFile.size > 0) {
      try {
        imageData = Buffer.from(await imageFile.arrayBuffer());
        imageType = imageFile.type;
      } catch (error) {
        console.error('Failed to process image:', error);
        return { error: 'Failed to process image' };
      }
    }

    try {
      console.log('Creating auction with data:', {
        title,
        description,
        startPrice,
        category,
        condition,
        endDate,
        sellerId: user.id,
        hasImage: !!imageData
      });

      const auction = await prisma.auction.create({
        data: {
          title,
          description,
          startPrice,
          currentPrice: startPrice,
          category,
          condition,
          endDate,
          imageData: imageData || undefined,
          imageType: imageType || undefined,
          sellerId: user.id,
        },
      });

      if (!auction) {
        return { error: 'Failed to create auction record' };
      }

      return { success: true, auctionId: auction.id };
    } catch (dbError) {
      console.error('Database error details:', {
        error: dbError,
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : undefined
      });
      
      return { error: 'Database error occurred' };
    }
  } catch (error) {
    console.error('Failed to create auction:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred' };
  } finally {
    await prisma.$disconnect();
  }
}

export default async function CreateAuctionPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create New Auction</h1>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the details below to create your auction listing.
              </p>
            </div>

            <CreateAuctionForm createAuction={createAuction} />
          </div>
        </div>
      </div>
    </div>
  );
}
