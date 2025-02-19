'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ErrorDisplay() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Unable to load auctions
        </h2>
        <p className="text-gray-600 mb-8">
          Please try refreshing the page
        </p>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
} 