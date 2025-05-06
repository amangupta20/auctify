# Auctify

Auctify is a modern online auction platform built with Next.js, allowing users to create, bid on, and manage auctions.

## Features

- User Authentication (Sign up, Log in)
- Create and manage auctions
- View active auctions
- Place bids on auctions
- User profiles
- Email notifications (e.g., for invoices)
- Automated processing of finished auctions

## Technologies Used

- Next.js
- React
- TypeScript
- Prisma (for database interaction)
- NextAuth.js (for authentication)
- Tailwind CSS (for styling)
- Resend (for emails)

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn or pnpm or bun
- A database (e.g., PostgreSQL, MySQL) compatible with Prisma
- Environment variables configured (database URL, NextAuth secret, Resend API key, etc.)

### Installation

1. Clone the repository:

```bash
git clone [repository_url]
cd auctify
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up your database and apply migrations:

```bash
npx prisma migrate dev --name initial_migration # Or the name of your first migration
```

4. Generate Prisma client:

```bash
npx prisma generate
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
