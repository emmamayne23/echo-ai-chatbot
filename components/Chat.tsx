"use client";

import React, { useState, useEffect, useRef } from 'react'
import { SendHorizontal } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

const Chat = () => {
  const [input, setInput] = useState("")
  const { messages, sendMessage } = useChat()

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // if (bottomRef.current) {
    //   bottomRef.current.scrollIntoView({ behavior: "smooth" });
    // }

    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 text-black">

      {!messages.length && (
        <div className=" h-lvh grid place-items-center bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">What&apos;s on your mind?</h1>
      </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 pt-16 pb-24 md:px-8 lg:px-16">
        { messages.map(message => (
          <div key={message.id} className="mb-2">
            <strong>{message.role === "user" ? "User: " : "AI: "}</strong>
            { message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return <div key={`${message.id}-${i}`}>{part.text}</div>
              }
            }) }
          </div>
        )) }
        <div ref={bottomRef}></div>
      </div>
      )}

      {/* Input form */}
      <form 
        className="w-full flex justify-center items-center bg-white border-t border-t-gray-300 py-4 px-2 fixed bottom-0 left-0 z-10"
        onSubmit={(e) => {
          e.preventDefault()
          if (!input.trim()) return 
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <input
          type="text"
          name="message"
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="border border-gray-300 text-black rounded-lg px-4 py-3 w-full max-w-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  )
}

export default Chat