"use client";

import "./globals.css";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { User, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Aero - Curated Journeys</title>
      </head>
      <body className="antialiased relative min-h-screen flex flex-col">
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-[#E5E5E5] bg-[#FAF9F6]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 group">
              <span className="text-[#1A1A1A] font-serif">AERO</span>
            </Link>

            <div className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest font-medium text-[#666666]">
              <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Discover</Link>
              <Link href="/trips" className="hover:text-[#1A1A1A] transition-colors">Itineraries</Link>
              <Link href="/flights" className="hover:text-[#1A1A1A] transition-colors">Flights</Link>
              {mounted && isAuthenticated && (
                <Link href="/invites" className="hover:text-[#1A1A1A] transition-colors">Invites</Link>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {mounted && isAuthenticated ? (
                <Link href="/profile" className="w-10 h-10 border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F0EFEA] transition-colors cursor-pointer group">
                  <User className="w-4 h-4 text-[#1A1A1A]" />
                </Link>
              ) : (
                mounted && (
                  <Link href="/auth/login" className="btn-primary text-xs py-2 px-4">
                    Sign In
                  </Link>
                )
              )}
            </div>
          </div>
        </nav>

        <div className="flex-1 flex flex-col mt-20">
          {children}
        </div>
        
        <footer className="border-t border-[#E5E5E5] py-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#666666] uppercase tracking-widest font-medium">
            <p>© 2026 Aero Experiences.</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Contact</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
