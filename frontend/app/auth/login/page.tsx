"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get("email") as string;
    const passwordVal = formData.get("password") as string;

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, password: passwordVal }),
      });

      if (!res.ok) {
        let errorMsg = "Login failed";
        try { const errData = await res.json(); errorMsg = errData.error || errorMsg; } catch(e) {}
        throw new Error(errorMsg);
      }
      const data = await res.json();

      login({ id: data.user.id, email: data.user.email, name: data.user.name }, data.accessToken);
      
      router.push("/trips");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-40 px-6 flex items-center justify-center relative">
      <div className="editorial-card p-12 max-w-md w-full relative z-10 animate-stagger-1">
        <h1 className="text-4xl font-serif mb-2 text-center">Sign In</h1>
        <p className="text-[#666666] text-sm mb-10 text-center font-light tracking-wide">Enter your credentials to access your itineraries.</p>
        
        {error && <div className="bg-[#FFF5F5] border border-[#FED7D7] text-[#C53030] p-4 mb-6 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="loginEmail" className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Email</label>
            <input 
              id="loginEmail"
              type="email" 
              name="email"
              className="input-editorial"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="loginPass" className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Password</label>
            <input 
              id="loginPass"
              type="password" 
              name="password"
              className="input-editorial"
              required
            />
          </div>

          <button type="submit" className="btn-primary mt-6 w-full" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#666666] tracking-wider uppercase">
          Don't have an account? <Link href="/auth/register" className="text-[#1A1A1A] hover:underline ml-1 font-semibold">Register</Link>
        </p>
      </div>
    </main>
  );
}
