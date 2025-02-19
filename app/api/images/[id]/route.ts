import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: RouteParams) {
  const params = await props.params;
  try {
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
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse(null, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 