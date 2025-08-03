import React from 'react'
import { SendHorizontal } from 'lucide-react';

const Chat = () => {
  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-center items-center border-b py-6 bg-white shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">What&apos;s on your mind?</h1>
      </div>

      {/* Chat messages area (empty for now) */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {/* Future chat messages will go here */}
      </div>

      {/* Input bar */}
      <form className="w-full flex justify-center items-center bg-white border-t py-4 px-2 fixed bottom-0 left-0 z-10">
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Ask me anything..."
          className="border border-gray-300 rounded-lg px-4 py-3 w-full max-w-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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