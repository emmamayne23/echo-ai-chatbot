"use server"

import { createSupabaseClient } from "../supabase";

export const getChatSession = async (userId: string) => {
    const supabase = createSupabaseClient()

    if(!userId) {
        return null
    }

    const { data: sessionData, error: sessionError } = await supabase
      .from("session")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      
      
    if(sessionError) throw new Error("Failed to fetch session")

    // Return null if no sessions exist for the user
    if(!sessionData || sessionData.length === 0) {
        return null
    }

    return sessionData[0]
}

export const getAllChatSessions = async (userId: string) => {
    const supabase = createSupabaseClient()

    if(!userId) {
        return []
    }

    const { data: sessionData, error: sessionError } = await supabase
      .from("session")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      
    if(sessionError) throw new Error("Failed to fetch sessions")

    return sessionData || []
}

export const getChatMessages = async (sessionId: string) => {
    const supabase = createSupabaseClient()

    const { data: messagesData, error: messagesError } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if(messagesError || !messagesData) throw new Error("Failed to fetch messages")

    return messagesData
}