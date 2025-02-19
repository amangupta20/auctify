import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auction = await prisma.auction.findUnique({
    where: { id: params.id },
    select: { imageData: true, imageType: true },
  });

  if (!auction?.imageData || !auction?.imageType) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(auction.imageData, {
    headers: {
      'Content-Type': auction.imageType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
} 