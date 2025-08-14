"use client";

import React, { useState, useEffect, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { chatSession, saveMessages } from "@/lib/actions/message.actions";
import { getChatMessages } from "@/lib/actions/general.actions";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatProps {
  sessionId?: string;
  initialMessages?: DatabaseMessage[];
}

interface DatabaseMessage {
  id: string;
  created_at: string;
  session_id: string;
  role: string;
  content: string;
}

const Chat = ({ sessionId: initialSessionId, initialMessages = [] }: ChatProps) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const { messages, sendMessage, setMessages } = useChat({
    onFinish: async (assistantMessage: any) => {
      console.log("onFinish triggered with:", assistantMessage);
      try {
        const sid = sessionIdRef.current;
        if (!sid) {
          console.log("No session ID available");
          return;
        }
        const text = getMessageText(assistantMessage);
        console.log("Extracted text:", text);
        if (text.trim().length === 0) {
          console.log("Empty text, not saving");
          return;
        }
        console.log("Saving assistant message to database...");
        await saveMessages(sid, "assistant", text);
        console.log("Assistant message saved successfully");
      } catch (error) {
        console.error("Failed to persist assistant message:", error);
      }
    },
  });

  const [sessionId, setSessionId] = useState<string | null>(initialSessionId || null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Helper to read text from either parts or content arrays
  const getMessageText = (msg: any): string => {
    console.log("getMessageText input:", msg);
    
    // Handle the case where msg is wrapped in a message property
    const actualMsg = msg.message || msg;
    
    const segments = (actualMsg.parts || actualMsg.content || []) as Array<{ type: string; text?: string }>;
    console.log("Segments:", segments);
    
    const text = segments
      .filter((seg) => seg && typeof seg === "object" && seg.type === "text" && typeof seg.text === "string")
      .map((seg) => seg.text as string)
      .join("");
    
    console.log("Extracted text:", text);
    return text;
  };

  // Keep a current ref of the session id for async callbacks
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Seed initial messages provided from server
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      console.log("Converting database messages:", initialMessages);
      const formattedMessages = initialMessages.map((msg: DatabaseMessage) => ({
        id: msg.id,
        role: msg.role === "ai" || msg.role === "assistant" ? "assistant" : "user",
        content: [{ type: "text" as const, text: msg.content }],
        parts: [{ type: "text" as const, text: msg.content }],
        createdAt: new Date(msg.created_at)
      }));
      console.log("Formatted messages:", formattedMessages);
      setMessages(formattedMessages);
    }
  }, [initialMessages, messages.length, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Debug: Log all messages to see what's happening
  useEffect(() => {
    console.log("Current messages in useChat:", messages);
  }, [messages]);

  // We now persist assistant replies in the onFinish callback above

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsloading(true);

    let currentSessionId = sessionId

    if (!sessionId) {
      const sessionData = await chatSession([
        { role: "user", content: input }
      ]);
      currentSessionId = sessionData.id;
      setSessionId(currentSessionId);
      sessionIdRef.current = currentSessionId;
    }

    await saveMessages(currentSessionId!, "user", input)

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
    <div className="flex flex-col h-full min-h-screen bg-gray-900 text-gray-200">
      {!messages.length && (
        <div className=" grid place-items-center shadow-sm">
          <div className="relative h-[200px] w-full overflow-hidden">
          </div>
          <h1 className="text-4xl font-semibold text-gray-200">
            What&apos;s on your mind?
          </h1>
        </div>
      )}

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 pt-16 pb-24 md:px-28 lg:px-40">
          {messages.map((message) => {
            const isUser = message.role === "user";
            const text = getMessageText(message);

            return (
              <div
                key={message.id}
                className={`p-3 my-4 max-w-2xl rounded-2xl shadow-md ${
                  isUser
                    ? "bg-gray-400 px-5 text-white self-end ml-auto text-right w-fit"
                    : "bg-gray-700 px-5 text-white self-start mr-auto"
                }`}
              >
                <ReactMarkdown
                  components={{
                    code({
                      node,
                      inline,
                      className,
                      children,
                      ...props
                    }) {
                      const match = /language-(\w+)/.exec(
                        className || ""
                      );
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
                  {text}
                </ReactMarkdown>
              </div>
            );
          })}
          {isLoading && (
            <div className="italic text-gray-500 mt-2">AI is thinking...</div>
          )}

          <div ref={bottomRef}></div>
        </div>
      )}

      {/* Input form */}
      <form
        className="w-full flex justify-center items-center bg-gray-900 border-t border-t-gray-700 py-4 px-2 fixed bottom-0 left-0 z-10"
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
          className="border border-gray-500  rounded-lg px-4 py-3 w-full max-w-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading || input.length === 0}
          className={`ml-2 px-4.5 py-3.5  ${
            input.length === 0 ? "bg-blue-200" : "bg-gray-700 hover:bg-gray-500"
          } text-white rounded-lg font-medium  transition`}
        >
          <SendHorizontal size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
