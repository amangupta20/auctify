import React from 'react';
import Link from 'next/link';

interface PageProps {
  searchParams: { error?: string };
}

const getErrorMessage = (error: string) => {
  switch (error) {
    case 'OAuthAccountNotLinked':
      return 'This email is already associated with a different sign-in method. Please use your original sign-in method.';
    case 'CredentialsSignin':
      return 'Invalid email or password. Please try again.';
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};

export default function AuthErrorPage({ searchParams }: PageProps) {
  const errorMessage = getErrorMessage(searchParams.error || '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <Link
              href="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return to sign in
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