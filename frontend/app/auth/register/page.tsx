"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const emailVal = formData.get("email") as string;
    const passwordVal = formData.get("password") as string;
    const nameVal = formData.get("name") as string;

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailVal, password: passwordVal, name: nameVal }),
      });

      if (!res.ok) {
        let errorMsg = "Registration failed";
        try { const errData = await res.json(); errorMsg = errData.error || errorMsg; } catch(e) {}
        throw new Error(errorMsg);
      }
      
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-40 px-6 flex items-center justify-center relative">
      <div className="editorial-card p-12 max-w-md w-full relative z-10 animate-stagger-1">
        <h1 className="text-4xl font-serif mb-2 text-center">Join Aero</h1>
        <p className="text-[#666666] text-sm mb-10 text-center font-light tracking-wide">Create your account to curate elegant journeys.</p>
        
        {error && <div className="bg-[#FFF5F5] border border-[#FED7D7] text-[#C53030] p-4 mb-6 text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="regName" className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Full Name</label>
            <input 
              id="regName"
              type="text" 
              name="name"
              className="input-editorial"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="regEmail" className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Email</label>
            <input 
              id="regEmail"
              type="email" 
              name="email"
              className="input-editorial"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="regPass" className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Password</label>
            <input 
              id="regPass"
              type="password" 
              name="password"
              className="input-editorial"
              required
            />
          </div>

          <button type="submit" className="btn-primary mt-6 w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-[#666666] tracking-wider uppercase">
          Already have an account? <Link href="/auth/login" className="text-[#1A1A1A] hover:underline ml-1 font-semibold">Sign In</Link>
        </p>
      </div>
    </main>
  );
}
