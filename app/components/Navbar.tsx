import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {auth, signOut} from "@/auth";

const Navbar = async() => {
    const session = await auth()
    return (
        <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image 
                            src="/logo.png" 
                            alt="Auctify" 
                            width={199} 
                            height={99}
                            className="h-16 w-auto"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            href="/auctions" 
                            className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            Browse Auctions
                        </Link>
                        <Link 
                            href="/how-it-works" 
                            className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors"
                        >
                            How It Works
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {session && session?.user ? (
                            <>
                                <Link 
                                    href="/auction/create"
                                    className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Auction
                                </Link>

                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-sm focus:outline-none">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                            {session.user.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="hidden md:inline-block font-medium text-gray-700">
                                            {session.user.name}
                                        </span>
                                    </button>
                                    <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                                        <Link 
                                            href={`/user/${session.user.email}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>
                                        <Link 
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Dashboard
                                        </Link>
                                        <form action={async()=>{
                                            "use server";
                                            await signOut({redirectTo: '/'});
                                        }}>
                                            <button 
                                                type="submit"
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link 
                                    href="/login"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link 
                                    href="/signup"
                                    className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
