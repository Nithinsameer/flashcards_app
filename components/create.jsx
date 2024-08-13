/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IehJgr2RBEK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Create() {
  const [flashcards, setFlashcards] = useState([
    { front: "Flashcard 1", back: "Back 1", flipped: false },
    { front: "Flashcard 2", back: "Back 2", flipped: false },
    { front: "Flashcard 3", back: "Back 3", flipped: false },
    { front: "Flashcard 4", back: "Back 4", flipped: false },
    { front: "Flashcard 5", back: "Back 5", flipped: false },
    { front: "Flashcard 6", back: "Back 6", flipped: false },
    { front: "Flashcard 7", back: "Back 7", flipped: false },
    { front: "Flashcard 8", back: "Back 8", flipped: false },
    { front: "Flashcard 9", back: "Back 9", flipped: false },
    { front: "Flashcard 10", back: "Back 10", flipped: false },
  ])
  const [newFlashcard, setNewFlashcard] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    if (newFlashcard.trim() !== "") {
      setFlashcards([...flashcards, { front: newFlashcard, back: "", flipped: false }])
      setNewFlashcard("")
    }
  }
  const handleFlipCard = (index) => {
    setFlashcards(flashcards.map((card, i) => (i === index ? { ...card, flipped: !card.flipped } : card)))
  }
  const handleSaveFlashcards = () => {
    console.log("Saving flashcards:", flashcards)
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-3xl w-full space-y-6 px-4 sm:px-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={newFlashcard}
            onChange={(e) => setNewFlashcard(e.target.value)}
            placeholder="Enter flashcard text"
            className="flex-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          />
          <Button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Add Flashcard
          </Button>
        </form>
        <div className="grid grid-cols-5 gap-6">
          {flashcards.map((card, index) => (
            <div
              key={index}
              className={`relative w-32 h-48 transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
                card.flipped ? "rotate-y-180" : ""
              }`}
              onClick={() => handleFlipCard(index)}
            >
              <div className="absolute inset-0 bg-card p-4 rounded-md shadow-md backface-hidden">
                <div className="flex items-center justify-center h-full text-card-foreground font-medium">
                  {card.front}
                </div>
              </div>
              <div className="absolute inset-0 bg-card p-4 rounded-md shadow-md backface-hidden rotate-y-180">
                <div className="flex items-center justify-center h-full text-card-foreground font-medium">
                  {card.back}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={handleSaveFlashcards}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 w-full"
        >
          Save Flashcards
        </Button>
      </div>
    </div>
  )
}