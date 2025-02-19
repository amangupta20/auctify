import React from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient, User } from '@prisma/client';
import EditProfileForm from './EditProfileForm';

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ userId: string }>;
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
  return {
    title: 'Edit Profile | Auctify',
  };
}

export default async function EditProfilePage(props: PageProps) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      redirect('/login');
    }

    const user = await prisma.user.findUnique({
      where: { 
        email: decodeURIComponent((await props.params).userId)
      }
    }) as ExtendedUser | null;

    if (!user || session.user.email !== user.email) {
      redirect('/');
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Update your profile information
                </p>
              </div>
              <EditProfileForm user={user} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    redirect('/');
  }
} 