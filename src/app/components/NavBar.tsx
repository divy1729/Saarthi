"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth";

export default function NavBar() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  return (
    <nav className="w-full bg-white shadow flex flex-col items-center py-4 mb-4">
      <ul className="flex gap-6 text-lg font-medium mb-2">
        <li><Link href="/">Ask AI</Link></li>
        <li><Link href="/breathing">Breathing</Link></li>
        <li><Link href="/journaling">Journaling</Link></li>
        <li><Link href="/meditation">Meditation</Link></li>
        {user && <li><Link href="/profile">Profile</Link></li>}
      </ul>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700">{user.displayName || user.email}</span>
            <button onClick={signOutUser} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Sign Out</button>
          </>
        ) : (
          <button onClick={signInWithGoogle} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Sign in with Google</button>
        )}
      </div>
    </nav>
  );
} 