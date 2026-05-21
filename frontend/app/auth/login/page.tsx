"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import { LogIn } from "lucide-react";
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
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 mask-image-linear-to-l pointer-events-none"></div>
      
      <div className="aero-glass p-12 max-w-md w-full relative z-10 border-t-4 border-t-cyan-400">
        <h1 className="text-4xl font-serif mb-2">Welcome Back</h1>
        <p className="text-white/50 text-sm mb-8 font-light tracking-wide">Enter your credentials to access your luxury itineraries.</p>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="loginEmail" className="uppercase tracking-widest text-[10px] text-white/50 font-bold ml-1">Email</label>
            <input 
              id="loginEmail"
              type="email" 
              name="email"
              className="aero-input"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="loginPass" className="uppercase tracking-widest text-[10px] text-white/50 font-bold ml-1">Password</label>
            <input 
              id="loginPass"
              type="password" 
              name="password"
              className="aero-input"
              required
            />
          </div>

          <button type="submit" className="aero-button-cyan mt-4 flex justify-center items-center gap-2" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40 tracking-wider">
          DON'T HAVE AN ACCOUNT? <Link href="/auth/register" className="text-white hover:text-cyan-400 ml-2">REGISTER</Link>
        </p>
      </div>
    </main>
  );
}
