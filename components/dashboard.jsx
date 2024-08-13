/**
 * v0 by Vercel.
 * @see https://v0.dev/t/igfEYZrq3eG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            setIsLoading(true)
            try {
                const docRef = doc(collection(db, 'users'), user.id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || []
                    setFlashcards(collections)
                } else {
                    await setDoc(docRef, { flashcards: [] })
                    setFlashcards([])
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error)
                // Optionally, set an error state here
            } finally {
                setIsLoading(false)
            }
        }
        if (isLoaded && isSignedIn) {
            getFlashcards()
        }
    }, [user, isLoaded, isSignedIn])

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>
    }

    const handleCardClick = (name) => {
        router.push(`/flashcard?id=${encodeURIComponent(name)}`)
    }

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
                    <Link href="/generate">
                        <Button>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            New Deck
                        </Button>
                    </Link>
                </div>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            <div className="flex-1 p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {isLoading ? (
                    <div>Loading flashcards...</div>
                ) : flashcards.length === 0 ? (
                    <div>No flashcards found. Create a new deck to get started!</div>
                ) : (
                    flashcards.map((deck, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(deck.name)}
                            className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        >
                            <div className="flex flex-col h-full">
                                <div className="mb-4">
                                    <div className="text-lg font-semibold">{deck.name}</div>
                                    <div className="text-muted-foreground">
                                        {deck.description || "No description available"}
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="text-sm font-medium">
                                        {deck.cardCount || 0} cards
                                    </div>
                                    <ChevronRightIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    ))
                )}
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