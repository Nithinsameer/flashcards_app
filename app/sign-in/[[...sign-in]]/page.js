import Link from "next/link";
import { SignIn } from "@clerk/nextjs";


export default function SignInPage () {
    return (
        <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Flashcards App</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Pricing
          </Link>
          <Link href="/sign-in" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Link href="/sign-up" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Sign Up
          </Link>
        </nav>
      </header>
        <section id="login" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container mx-auto px-4 md:px-6">
                <div className="mx-auto max-w-md space-y-4 flex flex-col items-center">
                    <div className="space-y-2 text-center">
                         <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Login to your account</h2>
                            <p className="text-muted-foreground md:text-xl">Access your flashcards and start learning.</p>
                    </div>
                    <Link href="/login" passHref>
                        <SignIn />
                    </Link>
                </div>
            </div>
        </section>
    </div>
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