import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/login",
        error: '/auth/error'
    },
    providers: [
        GitHub,
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.password) {
                    return null
                }

                const passwordMatch = await bcrypt.compare(credentials.password as string, user.password)

                if (!passwordMatch) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) {
                return false
            }

            // Allow credential login to pass through
            if (account?.provider === "credentials") {
                return true
            }

            // Check if user exists with this email
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
                include: { accounts: true }
            })

            // If no user exists, allow sign in
            if (!existingUser) {
                return true
            }

            // If user exists and has the same provider, allow sign in
            if (existingUser.accounts.some(acc => acc.provider === account?.provider)) {
                return true
            }

            // If user exists but with different provider, redirect to link accounts page
            if (account?.provider) {
                return `/auth/link-account?email=${encodeURIComponent(user.email)}&provider=${account.provider}`
            }

            return false
        }
    },
    session: {
        strategy: "jwt"
    }
})
