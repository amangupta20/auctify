import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient, User } from "@prisma/client";
import Image from "next/image";
import ProfileActions from "./ProfileActions";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ userId: string }>;
}

type ExtendedUser = User & {
  balance: number;
};

export async function generateMetadata(props: PageProps) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: decodeURIComponent((await props.params).userId) },
    });

    return {
      title: user ? `${user.name}'s Profile | Auctify` : "Profile | Auctify",
    };
  } catch (_error) {
    return {
      title: "Profile | Auctify",
    };
  }
}

export default async function UserProfilePage(props: PageProps) {
  try {
    const session = await auth();

    const user = (await prisma.user.findUnique({
      where: {
        email: decodeURIComponent((await props.params).userId),
      },
    })) as ExtendedUser | null;

    if (!user) {
      redirect("/");
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
                      alt={user.name || "Profile picture"}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name?.[0]?.toUpperCase() || "U"
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Member since{" "}
                    {new Date(
                      user.emailVerified || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 sm:p-8">
              {/* Profile Actions */}
              {isOwnProfile && <ProfileActions userEmail={user.email!} />}

              {/* User Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.email || ""}
                    </p>
                  </div>
                  {user.phoneNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Phone Number
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {user.phoneNumber}
                      </p>
                    </div>
                  )}
                  {(user.address ||
                    user.city ||
                    user.state ||
                    user.country) && (
                    <div className="md:col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">
                        Address
                      </h3>
                      <div className="mt-1 text-sm text-gray-900">
                        {user.address && (
                          <p className="mt-1 text-sm text-gray-900">
                            {user.address}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-900">
                          {[user.city, user.state, user.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Wallet Balance */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Wallet Balance
                </h2>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-800">
                    ${user.balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">Available funds</p>
                </div>
              </div>

              {user.bio && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    About
                  </h2>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* User's Auctions */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {isOwnProfile ? "My Auctions" : `${user.name}'s Auctions`}
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
  } catch (_error) {
    redirect("/");
  }
}
