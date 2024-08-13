/**
 * v0 by Vercel.
 * @see https://v0.dev/t/igfEYZrq3eG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
        <div className="text-2xl font-bold">Flashcards</div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input type="text" placeholder="Search decks..." className="pr-10" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <Button>
            <PlusIcon className="w-5 h-5 mr-2" />
            New Deck
          </Button>
        </div>
      </header>
      <div className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[
          {
            title: "JavaScript Fundamentals",
            description: "Learn the basics of JavaScript",
            cardCount: 25,
          },
          {
            title: "React Essentials",
            description: "Master the core concepts of React",
            cardCount: 32,
          },
          {
            title: "CSS Tricks",
            description: "Explore advanced CSS techniques",
            cardCount: 18,
          },
          {
            title: "Python for Beginners",
            description: "Get started with Python programming",
            cardCount: 22,
          },
          {
            title: "Data Structures",
            description: "Understand common data structures",
            cardCount: 28,
          },
          {
            title: "Algorithms 101",
            description: "Learn essential algorithms",
            cardCount: 30,
          },
          {
            title: "Git and GitHub",
            description: "Become a Git and GitHub pro",
            cardCount: 15,
          },
          {
            title: "SQL Mastery",
            description: "Dive into SQL and database concepts",
            cardCount: 24,
          },
        ].map((deck, index) => (
          <Link
            key={index}
            href="#"
            className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            prefetch={false}
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="text-lg font-semibold">{deck.title}</div>
                <div className="text-muted-foreground">{deck.description}</div>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="text-sm font-medium">{deck.cardCount} cards</div>
                <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}