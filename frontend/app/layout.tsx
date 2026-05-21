"use client";

import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import { Compass, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for auth state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Travel.io - Luxury Experiences</title>
      </head>
      <body className="antialiased relative bg-[#05050A]">
        {/* Background Neon Orbs */}
        <div className="bg-orb-cyan w-[600px] h-[600px] -top-[300px] -left-[200px] animate-float"></div>
        <div className="bg-orb-purple w-[500px] h-[500px] top-[20%] -right-[200px] animate-float-delayed"></div>

        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/[0.05] bg-[#05050A]/40 backdrop-blur-3xl">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2 relative group">
              <span className="text-white relative z-10 font-serif">AERO</span>
              <span className="text-cyan-400 relative z-10 font-serif">TICKET</span>
            </Link>

            <div className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest font-bold">
              <Link href="/" className="text-white/60 hover:text-cyan-400 transition-colors">Discover</Link>
              <Link href="/trips" className="text-white/60 hover:text-cyan-400 transition-colors">Dashboard</Link>
              <Link href="/flights" className="text-white/60 hover:text-cyan-400 transition-colors">Flights</Link>
              {mounted && isAuthenticated && (
                <Link href="/invites" className="text-white/60 hover:text-cyan-400 transition-colors">Redeem Invite</Link>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {mounted && isAuthenticated ? (
                <Link href="/profile" className="w-10 h-10 rounded-full aero-glass flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group">
                  <User className="w-4 h-4 text-white/70 group-hover:text-cyan-400 transition-colors" />
                </Link>
              ) : (
                mounted && (
                  <Link href="/auth/login" className="aero-button-cyan text-sm">
                    Member Login
                  </Link>
                )
              )}
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
