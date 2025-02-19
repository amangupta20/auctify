import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

interface PageProps {
  searchParams: { email: string; provider: string };
}

export default async function LinkAccountPage({ searchParams }: PageProps) {
  const session = await auth();
  const { email, provider } = searchParams;

  if (!email || !provider) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Account Already Exists
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            An account with the email <span className="font-medium">{email}</span> already exists.
            Please sign in with your existing credentials first.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <Link
              href="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with existing account
            </Link>
            <Link
              href="/"
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 