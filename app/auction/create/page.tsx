import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from '@prisma/client';
import CreateAuctionForm from './CreateAuctionForm';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Create Auction | Auctify',
  description: 'Create a new auction listing on Auctify',
};

async function createAuction(formData: FormData) {
  'use server';
  
  try {
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

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startPrice = parseFloat(formData.get('startPrice') as string);
    const category = formData.get('category') as string;
    const condition = formData.get('condition') as string;
    const endDate = new Date(formData.get('endDate') as string);
    const imageFile = formData.get('image') as File | null;

    let imageData: Buffer | null = null;
    let imageType: string | null = null;
    
    if (imageFile && imageFile.size > 0) {
      try {
        imageData = Buffer.from(await imageFile.arrayBuffer());
        imageType = imageFile.type;
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }

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

    if (auction) {
      redirect(`/auction/${auction.id}`);
    }
  } catch (error) {
    console.error('Failed to create auction:', error);
    throw new Error('Failed to create auction');
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
