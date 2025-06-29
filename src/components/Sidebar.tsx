"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Home, 
  MessageCircle, 
  Heart, 
  BookOpen, 
  Clock, 
  User,
  Menu,
  Activity
} from "lucide-react";
import { useAuth } from "../lib/auth";

const navigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "AI Guidance",
    href: "/dashboard",
    icon: MessageCircle,
  },
  {
    title: "Breathing",
    href: "/breathing",
    icon: Heart,
  },
  {
    title: "Journaling",
    href: "/journaling",
    icon: BookOpen,
  },
  {
    title: "Meditation",
    href: "/meditation",
    icon: Clock,
  },
  {
    title: "Mood Tracker",
    href: "/mood-tracker",
    icon: Activity,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user, signInWithGoogle, signOutUser } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-16 lg:w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Sidebar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-gray-200 rounded-lg p-2 shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div className="font-semibold text-lg">Saarthi</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 flex flex-col gap-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${pathname === item.href 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Auth Section - moved here */}
            <div className="pt-4 border-t border-gray-200 flex items-center gap-3">
              {user ? (
                <>
                  {user.photoURL && (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{user.displayName || "User"}</div>
                    <button
                      onClick={signOutUser}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
} 