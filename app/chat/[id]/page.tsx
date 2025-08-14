import React from 'react'
import { getChatMessages } from '@/lib/actions/general.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Chat from '@/components/Chat'

interface ChatMessagesProps {
    params: Promise<{ id: string }>
}

const page = async ({ params }: ChatMessagesProps) => {
    const { id } = await params
    const user = await currentUser()

    if(!user) redirect("/")

    // Load initial messages on the server and pass to client
    let initialMessages = [] as any[]
    try {
        initialMessages = await getChatMessages(id)
        console.log("Loaded messages from database:", initialMessages)
    } catch (error) {
        console.error("Failed to load messages:", error)
        redirect("/")
    }

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen">
            <Chat sessionId={id} initialMessages={initialMessages} />
        </div>
    )
}

export default page