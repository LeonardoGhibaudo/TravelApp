"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import { Users, Mail, Check, AlertCircle, Trash2 } from "lucide-react";

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { token, isAuthenticated } = useAuthStore();
  
  const [trip, setTrip] = useState<any>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchTrip = async () => {
      try {
        const res = await fetch(`http://localhost:3001/trips/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTrip(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTrip();
  }, [id, isAuthenticated, token, router]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteStatus("loading");
    setErrorMsg("");
    setInviteToken("");

    try {
      const res = await fetch(`http://localhost:3001/trips/${id}/invite`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ email: inviteEmail, role: "VIEWER" })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invite");

      setInviteStatus("success");
      setInviteToken(data.token); // The backend returns the token
      setInviteEmail("");
    } catch (err: any) {
      setInviteStatus("error");
      setErrorMsg(err.message);
    }
  const handleDeleteTrip = async () => {
    if (!confirm("Are you sure you want to delete this itinerary? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:3001/trips/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete trip");
      router.push("/trips");
    } catch (err) {
      alert("Error deleting trip. Please try again.");
      setIsDeleting(false);
    }
  };

  if (!trip) return <div className="min-h-screen pt-40 px-6 max-w-6xl mx-auto animate-pulse text-white/50 text-sm tracking-widest uppercase">Loading itinerary...</div>;

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto">
      <button onClick={() => router.push('/trips')} className="text-white/50 hover:text-white uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
        ← Back to Dashboard
      </button>

      <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">Destination: {trip.destination}</p>
          <h1 className="text-5xl font-serif">{trip.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 flex flex-col gap-8">
          <h2 className="text-2xl font-serif">Itinerary</h2>
          {trip.stops && trip.stops.length > 0 ? (
            <div className="flex flex-col gap-4">
              {trip.stops.map((stop: any) => (
                <div key={stop.id} className="aero-glass p-6">
                  <h4 className="font-bold">{stop.name}</h4>
                  <p className="text-sm text-white/50 mt-1">{stop.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/40 font-light italic">No stops planned yet. The canvas is blank.</p>
          )}

          <h2 className="text-2xl font-serif mt-8">Selected Flights</h2>
          {trip.flights && trip.flights.length > 0 ? (
            <div className="flex flex-col gap-4">
               {trip.flights.map((flight: any) => (
                <div key={flight.id} className="aero-glass p-6">
                  <h4 className="font-bold">{flight.airline} {flight.flightNumber}</h4>
                  <p className="text-sm text-white/50 mt-1">{flight.departureAirport} → {flight.arrivalAirport}</p>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-white/40 font-light italic">No flights attached to this trip.</p>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <div className="aero-glass flex flex-col gap-6">
            <h3 className="font-serif text-xl flex items-center gap-2"><Users className="w-5 h-5 text-cyan-400"/> Participants</h3>
            <div className="flex flex-col gap-3">
              {trip.tripParticipants?.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                  <span className="font-medium text-white/80">{p.user?.name || "User"}</span>
                  <span className="text-xs tracking-widest uppercase text-white/40">{p.role}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="text-sm uppercase tracking-widest font-bold mb-4">Invite Companion</h4>
              <form onSubmit={handleInvite} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="companion@email.com" 
                  required 
                  className="aero-input w-full"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button type="submit" className="aero-button-ghost py-3 flex justify-center items-center gap-2" disabled={inviteStatus === 'loading'}>
                  {inviteStatus === 'loading' ? 'Creating...' : <><Mail className="w-4 h-4"/> Generate Invite</>}
                </button>
              </form>

              {inviteStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 text-xs">
                  <p className="text-green-400 font-bold mb-2 flex items-center gap-1"><Check className="w-3 h-3"/> Invite Created!</p>
                  <p className="text-white/60 mb-2">Share this token with them:</p>
                  <code className="block bg-black p-2 text-cyan-400 break-all">{inviteToken}</code>
                  <p className="text-white/60 mt-2">They can redeem it at <span className="text-white underline cursor-pointer" onClick={() => router.push('/invites')}>/invites</span></p>
                </div>
              )}
              {inviteStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4"/> {errorMsg}
                </div>
              )}
            </div>
          <div className="aero-glass flex flex-col gap-6 border-t-2 border-t-red-500 mt-8">
            <h3 className="font-serif text-xl flex items-center gap-2 text-red-400"><Trash2 className="w-5 h-5"/> Danger Zone</h3>
            <p className="text-xs text-white/40 font-light">Deleting this trip will permanently remove it from your dashboard and revoke access for all participants.</p>
            <button 
              onClick={handleDeleteTrip}
              disabled={isDeleting}
              className="aero-button-ghost py-3 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 flex justify-center items-center gap-2 w-full"
            >
              {isDeleting ? "Deleting..." : "Delete Trip"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
