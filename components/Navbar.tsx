"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import { FaGithubSquare } from "react-icons/fa";
import { AlignStartVertical, MessageSquare } from "lucide-react";
// import { CircleUser } from "lucide-react";
import { X } from "lucide-react";
import { SquarePen } from "lucide-react";
import { Search } from "lucide-react";
import { Images } from "lucide-react";

import { SignedOut, SignedIn, UserButton, SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

import Link from "next/link";

import { getAllChatSessions } from "@/lib/actions/general.actions";

interface ChatSession {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

const Navbar = () => {
  const { user } = useUser()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const fetchSessions = async () => {
      if (user?.id) {
        try {
          const sessionData = await getAllChatSessions(user.id);
          setSessions(sessionData);
        } catch (error) {
          console.error("Failed to fetch sessions:", error);
        }
      }
    };

    fetchSessions();
  }, [user?.id]);

  return (
    <div className="flex">
      <div className={`${isOpen ? "fixed left-0 right-0 top-0 bottom-0 inset-0 z-50 bg-black opacity-50" : "hidden"}`} onClick={toggleSidebar}></div>
      <aside
        className={`bg-gray-800 text-white shadow-lg h-[97.5%] w-64 sm:w-72 md:w-80 flex-shrink-0 z-50 flex flex-col transition-transform duration-300
            fixed top-2 left-2 rounded-2xl 
            ${isOpen ? "translate-x-0" : "-translate-x-[110%]"}`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <Image
            alt="logo"
            src={"/logo.png"}
            width={32}
            height={32}
            className="rounded"
          />

          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-gray-700"
            aria-label="Close sidebar"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-5 pl-3 py-6">
          <Link
            href="/"
            className="py-2 flex gap-3 px-3 rounded hover:bg-gray-700 transition"
          >
            <SquarePen size={20} />
            New Chat
          </Link>
          <Link
            href="/search"
            className="py-2 flex gap-3 px-3 rounded hover:bg-gray-700 transition"
          >
            <Search size={20} />
            Search
          </Link>
          <Link
            href="/library"
            className="py-2 flex gap-3 px-3 rounded hover:bg-gray-700 transition"
          >
            <Images size={20} />
            Library
          </Link>
        </nav>
        {sessions.length > 0 && (
          <div className="px-3 py-2 flex-1 overflow-y-auto flex flex-col items-center ">
            {sessions.map((session) => (
              <Link href={`/chat/${session.id}`} key={session.id} className="py-2 flex items-center gap-3 px-3 rounded w-full hover:bg-gray-700 transition">
                <MessageSquare size={20} />
                <p className="text-sm">{session.title}</p>
            </Link>
            ))}
          </div>
        )}
        <div className="px-5 mt-auto pb-6 flex items-center justify-between">
          {/* <CircleUser size={28} className="text-gray-300" /> */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonAvatarImage: "rounded-full",
                },
              }}
            /> { user?.fullName  }
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal" className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition" />
          </SignedOut>
        </div>
      </aside>

      <div className="flex-1 flex flex-col fixed top-0 left-0 right-0">
        <nav className="flex items-center justify-between px-6 py-3 bg-gray-900 text-gray-200 shadow-md border-b border-b-gray-700 sticky top-0 z-40">
          <button
            className="p-2 rounded-md hover:bg-gray-700 transition"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <AlignStartVertical size={28} className="text-gray-200" />
          </button>

          <div className="flex items-center gap-3">
            <Image
              alt="Logo"
              src={"/logo.png"}
              height={40}
              width={40}
              className="rounded"
            />
            <h1 className="text-xl font-bold text-gray-200 tracking-tight">
              echo-ai
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/emmamayne23/echo-ai-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 transition"
            >
              <FaGithubSquare size={28} className="text-gray-100" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
