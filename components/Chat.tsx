"use client";

import React, { useState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { useChat } from "@ai-sdk/react";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chat = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const { messages, sendMessage } = useChat();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsloading(true);

    try {
      sendMessage({ text: input });
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-gray-50 text-black">
      {!messages.length && (
        <div className=" h-lvh grid place-items-center bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">
            What&apos;s on your mind?
          </h1>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 pt-16 pb-24 md:px-28 lg:px-40">
          {messages.map((message) => {
            const isUser = message.role === "user"

            return (
            <div
              key={message.id}
              className={`p-3 my-4 max-w-2xl rounded-2xl shadow-md ${
                isUser
                  ? "bg-gray-600 px-5 text-white self-end ml-auto text-right w-fit"
                  : "bg-gray-200 px-5 text-black self-start mr-auto"
              }`}
            >
              {/* <strong>{message.role === "user" ? "User: " : "AI: "}</strong> */}
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <ReactMarkdown
                      key={`${message.id}-${i}`}
                      components={{
                        code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || "");
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneDark}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  );
                }
                return null;
              })}
            </div>
            )
})}
          {isLoading && (
            <div className="italic text-gray-500 mt-2">AI is thinking...</div>
          )}

          <div ref={bottomRef}></div>
        </div>
      )}

      {/* Input form */}
      <form
        className="w-full flex justify-center items-center bg-white border-t border-t-gray-300 py-4 px-2 fixed bottom-0 left-0 z-10"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="message"
          id="message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Ask me anything..."
          className="border border-gray-300 text-black rounded-lg px-4 py-3 w-full max-w-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || input.length === 0}
          className={`ml-2 px-4.5 py-3.5  ${
            input.length === 0 ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white rounded-lg font-medium  transition`}
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
