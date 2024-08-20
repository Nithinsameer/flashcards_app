/**
 * v0 by Vercel.
 * @see https://v0.dev/t/WXJIe05XtpO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser
} from "@clerk/nextjs";
import getStripe from '../utils/get-stripe';
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from 'next/navigation';

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      setMessage('Payment successful! Your pro subscription is now active.');
    }
  }, [searchParams]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!isLoaded || !isSignedIn) {
      router.push('/sign-in?redirect=payment');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { sessionId } = await response.json();
      
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user just signed in and was redirected here for payment
    if (isSignedIn && searchParams.get('redirect') === 'payment') {
      handleSubmit(new Event('submit'));
    }
  }, [isSignedIn, searchParams]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Flashcards App</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          {/* <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link> */}
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Login
            </Link>
            <Link href="/sign-up" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              Sign Up
            </Link>
          </SignedOut>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Effortless Learning with Flashcards
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Boost your knowledge and ace your exams with our powerful flashcards app. Streamline your study
                    process and maximize your learning potential.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/sign-up"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#pricing"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Pricing
                  </Link>
                </div>
              </div>
              <img
                src="/logo.png"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        {/* <section id="login" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-md space-y-4 flex flex-col items-center">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Login to your account</h2>
                <p className="text-muted-foreground md:text-xl">Access your flashcards and start learning.</p>
              </div>
              <Card>
                <CardContent className="space-y-4">
                  <form className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" />
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="signup" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-md space-y-4">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Create a new account</h2>
                <p className="text-muted-foreground md:text-xl">Get started with our flashcards app today.</p>
              </div>
              <Card>
                <CardContent className="space-y-4">
                  <form className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" type="text" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" />
                    </div>
                    <Button type="submit" className="w-full">
                      Sign Up
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Pricing</h2>
                <p className="text-muted-foreground md:text-xl">Choose the plan that fits your needs.</p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                <Card className="flex flex-col items-center">
                  <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>Get started with our free plan.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <div className="text-4xl font-bold">$0</div>
                    <ul className="space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        100 flashcards
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        Basic study tools
                      </li>
                      <li className="flex items-center gap-2">
                        <XIcon className="h-4 w-4 text-red-500" />
                        No premium features
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="flex flex-col items-center">
                  <CardHeader>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>Unlock advanced features for serious learners.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <div className="text-4xl font-bold">$10/mo</div>
                    <ul className="space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        Unlimited flashcards
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        Advanced study tools
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500" />
                        Detailed analytics
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Get Pro'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Flashcards App. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}


function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}