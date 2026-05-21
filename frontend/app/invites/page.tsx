"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { KeyRound, Check, AlertCircle } from "lucide-react";
import { Suspense } from "react";

function InvitesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isAuthenticated } = useAuthStore();
  
  const [inviteToken, setInviteToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setInviteToken(t);
  }, [searchParams]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`http://localhost:3001/trips/invite/accept`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ token: inviteToken })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to accept invite");

      setStatus("success");
      setTimeout(() => {
        router.push("/trips");
      }, 2000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="editorial-card p-12 max-w-md w-full relative z-10 border-t-4 border-t-[#8A9A86] animate-stagger-1">
      <h1 className="text-4xl font-serif mb-2 text-center text-[#1A1A1A]">Redeem Invite</h1>
      <p className="text-[#666666] text-sm mb-10 text-center font-light tracking-wide leading-relaxed">Enter the magic token provided by your host to join their itinerary.</p>
      
      {status === 'error' && (
        <div className="bg-[#FFF5F5] border border-[#FED7D7] text-[#C53030] p-4 mb-6 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4"/> {errorMsg}
        </div>
      )}
      
      {status === 'success' && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D] p-4 mb-6 text-sm flex items-center gap-2">
          <Check className="w-4 h-4"/> Welcome aboard! Redirecting...
        </div>
      )}

      <form onSubmit={handleAccept} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Invite Token</label>
          <input 
            type="text" 
            className="input-editorial font-mono text-sm"
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            placeholder="Paste token here..."
            required
          />
        </div>

        <button type="submit" className="btn-primary mt-6 flex justify-center items-center gap-2 w-full" disabled={status === 'loading' || status === 'success'}>
          {status === 'loading' ? "Verifying..." : <><KeyRound className="w-4 h-4"/> Join Trip</>}
        </button>
      </form>
    </div>
  );
}

export default function InvitesPage() {
  return (
    <main className="min-h-screen pt-40 px-6 flex items-center justify-center relative bg-[#FAF9F6]">
      <Suspense fallback={<div>Loading...</div>}>
        <InvitesContent />
      </Suspense>
    </main>
  );
}
