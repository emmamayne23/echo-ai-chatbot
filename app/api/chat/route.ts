import { streamText, convertToModelMessages, UIMessage } from "ai"
import { google } from "@ai-sdk/google"


export const maxDuration = 30 // seconds

export async function GET() {
    return Response.json({ success: true, data: "Thank you!!!" }, { status: 200 })
}


export async function POST(request: Request) {
    const { messages } : { messages: UIMessage[] } = await request.json()
    console.log("API route called with messages:", messages)
    try {
        
        const result = await streamText({
            model: google("gemini-1.5-flash"),
            messages: convertToModelMessages(messages)
        })

        console.log("AI response generated successfully")
        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error("Error in POST request:", error)
        return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 })
    }
}