import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

const prisma = new PrismaClient();

interface PageProps {
  params: { userId: string };
}

interface ExtendedUser extends User {
  phoneNumber?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  bio?: string | null;
}

export async function generateMetadata(props: PageProps) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent(props.params.userId) }
    });

    return {
      title: user ? `${user.name}'s Profile | Auctify` : 'Profile | Auctify',
    };
  } catch (error) {
    return {
      title: 'Profile | Auctify',
    };
  }
}

export default async function UserProfilePage(props: PageProps) {
  try {
    const session = await auth();
    
    const user = await prisma.user.findUnique({
      where: { 
        email: decodeURIComponent(props.params.userId)
      }
    }) as ExtendedUser | null;

    if (!user) {
      redirect('/');
    }

    const isOwnProfile = session?.user?.email === user.email;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-bold overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || 'Profile picture'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                  <p className="text-sm text-gray-500">Member since {new Date(user.emailVerified || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 sm:p-8">
              {/* Profile Actions */}
              {isOwnProfile && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Actions</h2>
                  <div className="flex space-x-4">
                    <Link
                      href={`/user/${encodeURIComponent(user.email!)}/edit`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </Link>
                    <Link
                      href={`/user/${encodeURIComponent(user.email!)}/change-password`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Change Password
                    </Link>
                  </div>
                </div>
              )}

              {/* User Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">{user.email || ''}</p>
                  </div>
                  {user.phoneNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.phoneNumber}</p>
                    </div>
                  )}
                  {(user.address || user.city || user.state || user.country) && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <div className="mt-1 text-sm text-gray-900">
                        {user.address && <p className="mt-1 text-sm text-gray-900">{user.address}</p>}
                        <p className="mt-1 text-sm text-gray-900">
                          {[user.city, user.state, user.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {user.bio && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{user.bio}</p>
                </div>
              )}

              {/* User's Auctions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {isOwnProfile ? 'My Auctions' : `${user.name}'s Auctions`}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Placeholder for auctions - will be implemented later */}
                  <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-500">
                    No auctions yet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect('/');
  }
} 