// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Bricolage_Grotesque } from 'next/font/google'
import { Space_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import getStripe from '@/utils/get-stripe'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { ClerkProvider } from "@clerk/nextjs";

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-body',
    weight: ['400', '700'],
})

export default function Layout({ children }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body 
            className={cn(
              'antialiased',
              fontHeading.variable,
              fontBody.variable
            )}
          >
            {children}
          </body>
        </html>
      </ClerkProvider>
    );
  }