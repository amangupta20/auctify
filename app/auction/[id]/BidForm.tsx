"use client";

import React, { useState, ChangeEvent } from "react";

interface BidFormProps {
  userBalance: number | null;
  currentPrice: number;
  auctionId: string;
  placeBidAction: (formData: FormData) => Promise<void>;
}

export default function BidForm({
  userBalance,
  currentPrice,
  auctionId,
  placeBidAction,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Handle bid amount changes and validate
  const handleBidChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBidAmount(value);
    setError(null); // Clear previous error

    // Skip validation if empty
    if (!value) return;

    const numericBid = parseFloat(value);

    // Validate bid amount
    if (isNaN(numericBid)) {
      setError("Please enter a valid number");
    } else if (numericBid <= currentPrice) {
      setError(
        `Bid must be higher than current price: $${currentPrice.toFixed(2)}`
      );
    } else if (userBalance === null) {
      setError("Please log in to place a bid");
    } else if (numericBid > userBalance) {
      setError("Insufficient balance for this bid amount");
    }
  };

  // Client-side validation before form submission
  const handleSubmit = async (formData: FormData) => {
    const amount = parseFloat(bidAmount);

    if (isNaN(amount)) {
      setError("Please enter a valid bid amount");
      return;
    }

    if (amount <= currentPrice) {
      setError(
        `Bid must be higher than current price: $${currentPrice.toFixed(2)}`
      );
      return;
    }

    if (userBalance === null) {
      setError("Please log in to place a bid");
      return;
    }

    if (amount > userBalance) {
      setError("Insufficient balance for this bid amount");
      return;
    }

    // If all validations pass, submit the form
    await placeBidAction(formData);
  };

  return (
    <form action={handleSubmit} className="mb-6">
      <input type="hidden" name="auctionId" value={auctionId} />
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="amount" className="sr-only">
            Bid Amount
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              value={bidAmount}
              onChange={handleBidChange}
              min={currentPrice + 0.01}
              step="0.01"
              required
              placeholder="0.00"
              className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-indigo-600"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!!error || !bidAmount}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
            ${
              error || !bidAmount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
        >
          Place Bid
        </button>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-600">
          Your balance: ${userBalance !== null ? userBalance.toFixed(2) : "N/A"}
          {userBalance === null && " (Please log in to bid)"}
        </p>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    </form>
  );
}
