/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IehJgr2RBEK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { doc, collection, setDoc, getDoc, writeBatch } from "firebase/firestore"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import Link from "next/link"
import { db } from '@/firebase'

import { SignedIn,UserButton } from "@clerk/nextjs"

export default function Create() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [text, setText] = useState("");
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: text }),
          });
          if (!response.ok) {
            throw new Error('Failed to generate flashcards');
          }
          const data = await response.json();
          setFlashcards(data);
          setText("");
        } catch (error) {
          console.error('Error generating flashcards:', error);
          // Optionally, show an error message to the user
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleCardClick = (index) => {
        setFlipped((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));
      };
    
      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    

    const saveFlashcards = async() =>{
        if (!name){
            alert('Please enter a name')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if (docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return
            }
            else {
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else {
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection (userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/dashboard')
    }

//   const [flashcards, setFlashcards] = useState([
//     { front: "Flashcard 1", back: "Back 1", flipped: false },
//     { front: "Flashcard 2", back: "Back 2", flipped: false },
//     { front: "Flashcard 3", back: "Back 3", flipped: false },
//     { front: "Flashcard 4", back: "Back 4", flipped: false },
//     { front: "Flashcard 5", back: "Back 5", flipped: false },
//     { front: "Flashcard 6", back: "Back 6", flipped: false },
//     { front: "Flashcard 7", back: "Back 7", flipped: false },
//     { front: "Flashcard 8", back: "Back 8", flipped: false },
//     { front: "Flashcard 9", back: "Back 9", flipped: false },
//     { front: "Flashcard 10", back: "Back 10", flipped: false },
//   ])
//   const [text, setText] = useState("")
//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (newFlashcard.trim() !== "") {
//       setFlashcards([...flashcards, { front: newFlashcard, back: "", flipped: false }])
//       setNewFlashcard("")
//     }
//   }
//   const handleFlipCard = (index) => {
//     setFlashcards(flashcards.map((card, i) => (i === index ? { ...card, flipped: !card.flipped } : card)))
//   }
//   const handleSaveFlashcards = () => {
//     console.log("Saving flashcards:", flashcards)
//   }
return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="flex flex-col h-full">
            <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-10">
                <div className="text-2xl font-bold">Flashcards</div>
                <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
                    Dashboard
                </Link>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            <div className="pt-16"> {/* Add padding to prevent content from being hidden behind the fixed header */}
                {/* Your main content goes here */}
            </div>
        </div>
      <div className="max-w-6xl w-full space-y-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter flashcard text"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Add'}
          </Button>
        </form>
        
        {flashcards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        
        {flashcards.length > 0 && (
          <Button
            className="w-full"
            onClick={handleOpen}
          >
            Save Flashcards
          </Button>
        )}
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <p className="text-lg font-medium">Save Flashcard Collection</p>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={saveFlashcards}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}