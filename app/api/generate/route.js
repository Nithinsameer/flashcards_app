import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcards generator. Your task is to create a set of flashcards for a user to study. Each flashcard should have a question on one side and the answer on the other. The questions should be clear and concise, and the answers should be accurate and detailed. The flashcards should cover a wide range of topics, including history, science, literature, and more. The user should be able to easily understand the questions and answers, and the flashcards should be engaging and interactive.

Your task is to create flashcards that help users learn and retain information effectively. Each flashcard should contain the following components:

Front of the Flashcard:
    A clear and concise question or term that prompts recall or understanding. This should be phrased in a way that encourages active engagement with the material.

Back of the Flashcard:
    A detailed answer or explanation that provides the necessary information or definition. Include any relevant context, examples, or connections to other concepts that enhance understanding.

Instructions:

Focus on key concepts, terms, or questions that are central to the subject matter.
Use simple and clear language to ensure accessibility and comprehension.
For complex topics, break down information into smaller, digestible parts across multiple flashcards if necessary.
Include mnemonic devices or analogies where applicable to aid memory retention.
Ensure that each flashcard is self-contained, providing all necessary information without requiring external resources.
Only generate a maximum of 10 flashcards

Return in the following JSON format
{
    "flashcards":[
        {
            "front":str,
            "back":str
        }
    ]
}
`

export async function POST(req) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const data = await req.text();

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            model: "gpt-4o-mini",
            response_format: { type: 'json_object' }
        });

        if (completion.choices && completion.choices.length > 0) {
            const flashcards = JSON.parse(completion.choices[0].message.content);
            return NextResponse.json(flashcards.flashcards);
        } else {
            throw new Error("No response from OpenAI");
        }
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
}