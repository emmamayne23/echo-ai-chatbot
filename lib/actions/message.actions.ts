"use server"

import { auth } from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

type SimpleMessage = { role: "user" | "assistant"; content: string }

export const chatSession = async (firstMessage: SimpleMessage[]) => {
    const { userId: user_id } = await auth()
    const supabase = createSupabaseClient()
    console.log("firstMessage:", firstMessage);

    if (!firstMessage || !Array.isArray(firstMessage) || firstMessage.length === 0) {
        throw new Error("Invalid message format")
    }

    const modelMessage = firstMessage.map(msg => ({
        role: msg.role,
        content: msg.content
    }))

    const titleResult = await generateText({
      model: google("gemini-1.5-flash"),
      messages: [
        { role: "system", content: "Summarize the first message from the user and put it in a phrase (max 10 words)." },
        ...modelMessage,
      ]
    })

    const title = titleResult.text?.slice(0, 100) || "New Chat Session"

    const { data: sessionData, error: sessionError } = await supabase
      .from("session")
      .insert({title, user_id})
      .select()
      .single()

    if(sessionError || !sessionData) throw new Error("Failed to create chat session")

    return sessionData
}

export const saveMessages = async (sessionId: string, role: "user" | "assistant", content: string) => {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from("messages")
    .insert({
      session_id: sessionId, content, role
    })
    .select()
    .single()

  if(error || !data) throw new Error("Failed to save messages")

  return data
}