import React from 'react'
import { getChatMessages } from '@/lib/actions/general.actions'
import { currentUser } from '@clerk/nextjs/server'
import Chat from '@/components/Chat'

interface ChatMessagesProps {
    params: Promise<{ id: string }>
}

const page = async ({ params }: ChatMessagesProps) => {
    const { id } = await params
    const user = await currentUser()

    // Load initial messages on the server and pass to client
    let initialMessages = [] as any[]
    
    // Only load messages if user is authenticated
    if (user) {
        try {
            initialMessages = await getChatMessages(id)
            console.log("Loaded messages from database:", initialMessages)
        } catch (error) {
            console.error("Failed to load messages:", error)
            // Don't redirect, just show empty chat
            initialMessages = []
        }
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <Chat sessionId={id} initialMessages={initialMessages} />
        </div>
    )
}

export default page