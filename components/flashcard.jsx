/**
 * v0 by Vercel.
 * @see https://v0.dev/t/JpFdHWGgfcj
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from '@/firebase'
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SignedIn, UserButton } from "@clerk/nextjs"

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const searchParams = useSearchParams();
    const deckId = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!deckId || !user) return;
            setIsLoading(true);
            try {
                const colRef = collection(doc(collection(db, 'users'), user.id), deckId);
                const docSnap = await getDocs(colRef);
                const fetchedFlashcards = [];

                docSnap.forEach((doc) => {
                    fetchedFlashcards.push({ id: doc.id, ...doc.data() });
                });
                setFlashcards(fetchedFlashcards);
            } catch (error) {
                console.error("Error fetching flashcards:", error);
                setError("Failed to load flashcards. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }
        if (isLoaded && isSignedIn) {
            getFlashcard();
        }
    }, [user, isLoaded, isSignedIn, deckId]);

    const handleCardClick = (index) => {
        setFlipped((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between">
                <div className="text-2xl font-bold">Flashcards</div>
                <Link href="/dashboard">
                    Dashboard
                </Link>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>

            <main className="flex-grow">
                <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">Flashcard Study</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Test your knowledge with these interactive flashcards.</p>
                    </div>
                    {isLoading ? (
                        <div className="text-center mt-10">Loading flashcards...</div>
                    ) : error ? (
                        <div className="text-center mt-10 text-red-500">{error}</div>
                    ) : (
                        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {flashcards.map((card, index) => (
                                <div
                                    key={index}
                                    className="flip-card cursor-pointer"
                                    onClick={() => handleCardClick(index)}
                                >
                                    <div className={`flip-card-inner ${flipped[index] ? 'flipped' : ''}`}>
                                        <div className="flip-card-front p-4 rounded-md bg-primary text-primary-foreground flex flex-col justify-between">
                                            <div className="font-medium text-lg mb-2">Question:</div>
                                            <div className="text-sm">{card.front}</div>
                                        </div>
                                        <div className="flip-card-back p-4 rounded-md bg-secondary text-secondary-foreground flex flex-col justify-between">
                                            <div className="font-medium text-lg mb-2">Answer:</div>
                                            <div className="text-sm overflow-y-auto max-h-[150px]">{card.back}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}