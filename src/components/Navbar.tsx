import Link from "next/link";
import React from "react";
import SignInButton from "./SignInButton";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { Sparkles } from "lucide-react";

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getAuthSession();
  const isLoggedIn = !!session?.user;

  return (
    <nav className="fixed inset-x-0 top-0 bg-white dark:bg-zinc-950 z-[50] h-16 border-b-2 border-black dark:border-zinc-800 flex items-center justify-center">
      <div className="flex items-center justify-between h-full w-full max-w-7xl px-6 sm:px-8">
        
        {/* Left Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 dark:bg-yellow-500 border-2 border-black dark:border-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-150">
            <Sparkles className="w-4 h-4 text-black dark:text-black fill-black/20" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-990 dark:text-white select-none">
            Minerva<span className="text-violet-600 dark:text-violet-400">.</span>
          </span>
        </Link>

        {/* Right Nav Options */}
        <div className="flex items-center gap-4">
          
          {/* Main Links */}
          {isLoggedIn && (
            <div className="flex items-center gap-1 sm:gap-2 mr-2">
              <Link 
                href="/gallery" 
                className="px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              >
                Gallery
              </Link>
              <Link 
                href="/create" 
                className="px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              >
                Create
              </Link>
              <Link 
                href="/settings" 
                className="px-3 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors"
              >
                Settings
              </Link>
            </div>
          )}

          {/* Theme Toggle & User Account Dropdown */}
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-200 dark:border-zinc-800">
            <ThemeToggle />
            
            <div className="flex items-center">
              {isLoggedIn ? (
                <UserAccountNav user={session.user} />
              ) : (
                <div className="rounded-xl border-2 border-black dark:border-zinc-700 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white dark:bg-zinc-900 font-extrabold text-xs">
                  <SignInButton />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
