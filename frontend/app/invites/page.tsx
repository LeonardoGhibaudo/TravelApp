"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { KeyRound, Check, AlertCircle } from "lucide-react";

export default function InvitesPage() {
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  
  const [inviteToken, setInviteToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
    <main className="min-h-screen pt-40 px-6 flex items-center justify-center relative">
      <div className="aero-glass p-12 max-w-md w-full relative z-10 border-t-4 border-t-[#FFB000]">
        <h1 className="text-4xl font-serif mb-2">Redeem Invite</h1>
        <p className="text-white/50 text-sm mb-8 font-light tracking-wide">Enter the magic token provided by your host to join their itinerary.</p>
        
        {status === 'error' && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4"/> {errorMsg}
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 mb-6 text-sm flex items-center gap-2">
            <Check className="w-4 h-4"/> Welcome aboard! Redirecting...
          </div>
        )}

        <form onSubmit={handleAccept} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="uppercase tracking-widest text-[10px] text-white/50 font-bold ml-1">Invite Token</label>
            <input 
              type="text" 
              className="aero-input font-mono text-sm"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              placeholder="Paste token here..."
              required
            />
          </div>

          <button type="submit" className="aero-button-cyan mt-4 flex justify-center items-center gap-2" disabled={status === 'loading' || status === 'success'}>
            {status === 'loading' ? "Verifying..." : <><KeyRound className="w-4 h-4"/> Join Trip</>}
          </button>
        </form>
      </div>
    </main>
  );
}
