"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/authStore";
import { Users, Mail, Check, AlertCircle, Trash2, MapPin, Calendar, FileText, Plus, ArrowRight } from "lucide-react";

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

  // Stop Form State
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [stopTitle, setStopTitle] = useState("");
  const [stopDesc, setStopDesc] = useState("");
  const [stopLoc, setStopLoc] = useState("");
  const [stopTime, setStopTime] = useState("");
  const [isSavingStop, setIsSavingStop] = useState(false);

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
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
      setInviteToken(data.token);
      setInviteEmail("");
    } catch (err: any) {
      setInviteStatus("error");
      setErrorMsg(err.message);
    }
  };

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

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStop(true);
    try {
      const res = await fetch(`http://localhost:3001/trips/${id}/stops`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: stopTitle, 
          description: stopDesc,
          location: stopLoc,
          plannedTime: stopTime
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add stop");
      }
      
      setIsAddingStop(false);
      setStopTitle(""); setStopDesc(""); setStopLoc(""); setStopTime("");
      fetchTrip();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSavingStop(false);
    }
  };

  if (!trip) return <div className="min-h-screen pt-40 px-6 max-w-6xl mx-auto animate-pulse text-[#A0AEC0] text-sm tracking-widest uppercase text-center">Loading itinerary...</div>;

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto w-full">
      <button onClick={() => router.push('/trips')} className="text-[#666666] hover:text-[#1A1A1A] uppercase tracking-widest text-[10px] font-bold mb-10 flex items-center gap-2 transition-colors">
        ← Back to Dashboard
      </button>

      <div className="flex flex-col mb-12 border-b border-[#E5E5E5] pb-10">
        <p className="text-[#8A9A86] text-xs font-bold tracking-[0.2em] uppercase mb-4">Destination: {trip.destination}</p>
        <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A]">{trip.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 flex flex-col gap-10">
          
          {/* STOPS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif text-[#1A1A1A]">Itinerary</h2>
              <button onClick={() => setIsAddingStop(!isAddingStop)} className="text-[#1A1A1A] hover:text-[#8A9A86] transition-colors flex items-center gap-1 text-sm font-medium">
                <Plus className="w-4 h-4"/> Add Stop
              </button>
            </div>
            
            {isAddingStop && (
              <form onSubmit={handleAddStop} className="editorial-card p-6 mb-8 flex flex-col gap-4 animate-stagger-1 bg-[#FAF9F6]">
                <h4 className="font-serif text-lg mb-2">New Stop</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Title</label>
                    <input type="text" value={stopTitle} onChange={(e) => setStopTitle(e.target.value)} required className="input-editorial py-2 px-3 text-sm" placeholder="e.g. Visit Kinkaku-ji" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Location</label>
                    <input type="text" value={stopLoc} onChange={(e) => setStopLoc(e.target.value)} required className="input-editorial py-2 px-3 text-sm" placeholder="e.g. Kyoto" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Description</label>
                  <textarea value={stopDesc} onChange={(e) => setStopDesc(e.target.value)} className="input-editorial py-2 px-3 text-sm min-h-[80px]" placeholder="Optional notes..."></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Planned Time</label>
                  <input type="date" value={stopTime} onChange={(e) => setStopTime(e.target.value)} required className="input-editorial py-2 px-3 text-sm" />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button type="button" onClick={() => setIsAddingStop(false)} className="btn-secondary py-2 px-4 text-xs">Cancel</button>
                  <button type="submit" disabled={isSavingStop} className="btn-primary py-2 px-4 text-xs">{isSavingStop ? "Saving..." : "Save Stop"}</button>
                </div>
              </form>
            )}

            {trip.tripStops && trip.tripStops.length > 0 ? (
              <div className="flex flex-col gap-4 relative border-l border-[#E5E5E5] ml-4 pl-8">
                {trip.tripStops.map((stop: any, index: number) => (
                  <div key={stop.id} className="relative mb-6 last:mb-0 animate-stagger-2" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="absolute -left-[41px] top-1 w-5 h-5 bg-[#FAF9F6] border-2 border-[#1A1A1A] rounded-full"></div>
                    <div className="editorial-card p-6 border-l-4 border-l-[#8A9A86]">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif text-xl">{stop.title}</h4>
                        <span className="text-[10px] font-mono text-[#666666] bg-[#F5F4F0] px-2 py-1">{new Date(stop.plannedTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#666666] mb-4">
                        <MapPin className="w-3 h-3"/> {stop.location}
                      </div>
                      {stop.description && (
                        <p className="text-sm text-[#4A4A4A] leading-relaxed border-t border-[#E5E5E5] pt-4">{stop.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isAddingStop && <p className="text-[#666666] font-light italic bg-[#FAF9F6] p-8 border border-[#E5E5E5]">No stops planned yet. The canvas is blank.</p>
            )}
          </div>

          {/* FLIGHTS SECTION */}
          <div>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6 border-t border-[#E5E5E5] pt-10">Selected Flights</h2>
            {trip.flight && trip.flight.length > 0 ? (
              <div className="flex flex-col gap-4">
                 {trip.flight.map((flight: any) => (
                  <div key={flight.id} className="editorial-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-[#1A1A1A]">
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#8A9A86] font-bold mb-1 block">{flight.airline}</span>
                      <h4 className="font-serif text-xl">{flight.flightNumber}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#1A1A1A] font-medium bg-[#FAF9F6] py-2 px-4 border border-[#E5E5E5] rounded-full">
                      {flight.departureAirport} <ArrowRight className="w-4 h-4 text-[#A0AEC0]"/> {flight.arrivalAirport}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-[#666666] font-light italic bg-[#FAF9F6] p-8 border border-[#E5E5E5]">No flights attached to this trip yet.</p>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="flex flex-col gap-8">
          <div className="editorial-card p-8 flex flex-col gap-8">
            <h3 className="font-serif text-xl flex items-center gap-2"><Users className="w-5 h-5 text-[#1A1A1A]"/> Participants</h3>
            <div className="flex flex-col gap-4">
              {trip.participants?.map((p: any) => (
                <div key={p.id} className="flex justify-between items-center text-sm border-b border-[#E5E5E5] pb-3 last:border-0">
                  <span className="font-medium text-[#1A1A1A]">{p.user?.name || "User"}</span>
                  <span className="text-[10px] tracking-widest uppercase text-[#8A9A86] font-bold">{p.role}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-8 border-t border-[#E5E5E5]">
              <h4 className="text-xs uppercase tracking-widest font-bold mb-4 text-[#1A1A1A]">Invite Companion</h4>
              <form onSubmit={handleInvite} className="flex flex-col gap-3">
                <input 
                  type="email" 
                  placeholder="companion@email.com" 
                  required 
                  className="input-editorial w-full"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
                <button type="submit" className="btn-secondary py-3 flex justify-center items-center gap-2 w-full" disabled={inviteStatus === 'loading'}>
                  {inviteStatus === 'loading' ? 'Sending...' : <><Mail className="w-4 h-4"/> Send Email Invite</>}
                </button>
              </form>

              {inviteStatus === 'success' && (
                <div className="mt-6 p-5 bg-[#FAF9F6] border border-[#E5E5E5] text-xs">
                  <p className="text-[#8A9A86] font-bold mb-3 flex items-center gap-2 text-sm"><Check className="w-4 h-4"/> Email Sent! (Simulated)</p>
                  <p className="text-[#666666] mb-3 leading-relaxed">We've sent an invitation to their inbox with a magic link. For local testing, use this direct link:</p>
                  <code className="block bg-[#1A1A1A] p-3 text-white break-all border border-[#E5E5E5] text-xs leading-relaxed">
                    http://localhost:3000/invites?token={inviteToken}
                  </code>
                </div>
              )}
              {inviteStatus === 'error' && (
                <div className="mt-4 p-4 bg-[#FFF5F5] border border-[#FED7D7] text-xs text-[#C53030] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4"/> {errorMsg}
                </div>
              )}
            </div>
          </div>

          <div className="editorial-card p-8 flex flex-col gap-6 border-t-4 border-t-[#C53030]">
            <h3 className="font-serif text-xl flex items-center gap-2 text-[#C53030]"><Trash2 className="w-5 h-5"/> Danger Zone</h3>
            <p className="text-xs text-[#666666] font-light leading-relaxed">Deleting this trip will permanently remove it from your dashboard and revoke access for all participants.</p>
            <button 
              onClick={handleDeleteTrip}
              disabled={isDeleting}
              className="btn-danger flex justify-center items-center gap-2 w-full mt-2"
            >
              {isDeleting ? "Deleting..." : "Delete Itinerary"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
