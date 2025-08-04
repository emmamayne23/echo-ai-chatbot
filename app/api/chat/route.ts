import { streamText, convertToModelMessages, UIMessage } from "ai"
// import { openai } from "@ai-sdk/openai"
// import { vercel } from "@ai-sdk/vercel"
import { google } from "@ai-sdk/google"


export const maxDuration = 30 // seconds

export async function GET() {
    return Response.json({ success: true, data: "Thank you!!!" }, { status: 200 })
}


export async function POST(request: Request) {
    const { messages } : { messages: UIMessage[] } = await request.json()
    try {
        
        const result = await streamText({
            // model: openai("gpt-3.5-turbo"),
            model: google("gemini-1.5-flash"),
            messages: convertToModelMessages(messages)
        })

        return result.toUIMessageStreamResponse()
    } catch (error) {
        console.error("Error in POST request:", error)
    }
}