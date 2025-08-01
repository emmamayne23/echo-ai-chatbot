"use client";

import React, { useState } from "react";
import Image from "next/image";

import { FaGithubSquare } from "react-icons/fa";
import { AlignStartVertical } from 'lucide-react';
import { CircleUser } from 'lucide-react';
import { X } from 'lucide-react';

import Link from "next/link";



const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen((prev) => !prev);

    return (
      <div className="flex h-screen">
        {/* Sidebar: toggleable on all screen sizes */}
        <aside
          className={`bg-gray-800 text-white shadow-lg h-full w-64 flex-shrink-0 z-50 flex flex-col transition-transform duration-300
            fixed top-0 left-0
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-label="Sidebar"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
            <Image alt="logo" src={"/logo.png"} width={32} height={32} className="rounded" />
            {/* Always show close button */}
            <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700" aria-label="Close sidebar">
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-col gap-2 px-5 py-6">
            <Link href="/" className="py-2 px-3 rounded hover:bg-gray-700 transition">New Chat</Link>
            <Link href="/about" className="py-2 px-3 rounded hover:bg-gray-700 transition">Search</Link>
            <Link href="/contact" className="py-2 px-3 rounded hover:bg-gray-700 transition">Library</Link>
          </nav>
          <div className="px-5 mt-auto pb-6">
            <CircleUser size={28} className="text-gray-300" />
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md border-b sticky top-0 z-40">
            {/* Sidebar toggle button always visible */}
            <button
              className="p-2 rounded-md hover:bg-gray-100 transition"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <AlignStartVertical size={28} color="black" />
            </button>

            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <Image alt="Logo" src={"/logo.png"} height={40} width={40} className="rounded" />
              <h1 className="text-xl font-bold tracking-tight text-gray-800">echo-ai</h1>
            </div>

            {/* Right side links */}
            <div className="flex items-center gap-5">
              <Link href="https://github.com/emmamayne23/echo-ai-chatbot" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition">
                <FaGithubSquare size={28} className="text-gray-700" />
              </Link>
              <Link href="/" className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Login
              </Link>
            </div>
          </nav>
          {/* ...existing code... (main content goes here) */}
        </div>
      </div>
  );
};

export default Navbar;
