import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuctionStatus } from "@prisma/client";
import resend from "@/lib/resend";
import { InvoiceEmail } from "@/app/emails/InvoiceEmail";
import { renderAsync } from "@react-email/components";

export async function POST() {
  try {
    // Find all auctions that are ACTIVE and have ended
    const finishedAuctions = await prisma.auction.findMany({
      where: {
        status: AuctionStatus.ACTIVE,
        endDate: {
          lt: new Date(), // endDate is less than current time
        },
      },
      include: {
        bids: {
          orderBy: {
            amount: "desc", // Get highest bid first
          },
          take: 1, // Only need the highest bid
          include: {
            bidder: true, // Include bidder details
          },
        },
      },
    });

    const results = [];

    // Process each auction
    for (const auction of finishedAuctions) {
      const winningBid = auction.bids[0]; // Highest bid (if any)

      if (winningBid) {
        try {
          // Prepare auction URL for email
          const auctionUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auction/${auction.id}`;

          // Render email HTML
          const emailHtml = await renderAsync(
            InvoiceEmail({
              winnerName: winningBid.bidder.name || "Bidder",
              auctionTitle: auction.title,
              finalPrice: winningBid.amount,
              itemDescription: auction.description,
              auctionUrl,
            })
          );

          // Send invoice email
          await resend.emails.send({
            from: "Auctify <auctions@resend.dev>", // Update with your verified domain
            to: winningBid.bidder.email || "",
            subject: `🎉 You won the auction: ${auction.title}`,
            html: emailHtml,
          });

          // Update to INVOICED status after successful email send
          await prisma.auction.update({
            where: { id: auction.id },
            data: {
              status: AuctionStatus.INVOICED,
            },
          });
        } catch (emailError) {
          console.error(
            `Failed to send invoice email for auction ${auction.id}:`,
            emailError
          );
          // Still update to FINISHED status even if email fails
          await prisma.auction.update({
            where: { id: auction.id },
            data: {
              status: AuctionStatus.FINISHED,
            },
          });
        }
      } else {
        // No winner, just mark as FINISHED
        await prisma.auction.update({
          where: { id: auction.id },
          data: {
            status: AuctionStatus.FINISHED,
          },
        });
      }

      results.push({
        auctionId: auction.id,
        title: auction.title,
        winner: winningBid
          ? {
              userId: winningBid.bidder.id,
              name: winningBid.bidder.name,
              winningBid: winningBid.amount,
              emailSent: true,
            }
          : null,
      });
    }

    return NextResponse.json({
      success: true,
      processed: finishedAuctions.length,
      results,
    });
  } catch (error) {
    console.error("Error processing finished auctions:", error);
    return NextResponse.json(
      { error: "Failed to process finished auctions" },
      { status: 500 }
    );
  }
}
