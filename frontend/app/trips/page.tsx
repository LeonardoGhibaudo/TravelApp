"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { Map, CalendarDays, Users, Plus, Plane, BookmarkPlus, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuthStore();
  
  const [trips, setTrips] = useState<any[]>([]);
  const [watchedFlights, setWatchedFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreating, setIsCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "error">("idle");

  const fetchData = async () => {
    try {
      const [tripsRes, flightsRes] = await Promise.all([
        fetch("http://localhost:3001/trips", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("http://localhost:3001/watched-flights", { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (tripsRes.ok) setTrips(await tripsRes.json());
      if (flightsRes.ok) setWatchedFlights(await flightsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, router, token]);

  const handleCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateStatus("loading");

    const formData = new FormData(e.currentTarget);
    const nameVal = formData.get("name") as string;
    const destVal = formData.get("destination") as string;
    const startVal = formData.get("startDate") as string;
    const endVal = formData.get("endDate") as string;

    try {
      const res = await fetch("http://localhost:3001/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nameVal,
          destination: destVal,
          startDate: startVal,
          endDate: endVal,
        })
      });
      if (!res.ok) {
        let errorMsg = "Failed to create trip";
        try { const errorData = await res.json(); errorMsg = errorData.error || errorMsg; } catch (e) {}
        alert("Error: " + errorMsg);
        throw new Error(errorMsg);
      }
      
      setIsCreating(false);
      setCreateStatus("idle");
      fetchData(); 
    } catch (err) {
      setCreateStatus("error");
    }
  };

  const handleDeleteFlight = async (flightId: string) => {
    if (!confirm("Are you sure you want to stop tracking this flight?")) return;
    try {
      const res = await fetch(`http://localhost:3001/watched-flights/${flightId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setWatchedFlights(prev => prev.filter(f => f.id !== flightId));
      } else {
        alert("Failed to unwatch flight.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing tracked flight.");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative w-full">
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FAF9F6]/90 backdrop-blur-md animate-stagger-1">
          <div className="editorial-card p-10 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-serif mb-8 text-center">New Itinerary</h2>
            <form onSubmit={handleCreateTrip} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="tripName" className="text-[10px] uppercase text-[#666666] tracking-widest font-bold">Trip Name</label>
                <input id="tripName" type="text" name="name" required className="input-editorial w-full" placeholder="e.g. Summer in Kyoto" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="tripDest" className="text-[10px] uppercase text-[#666666] tracking-widest font-bold">Destination</label>
                <input id="tripDest" type="text" name="destination" required className="input-editorial w-full" placeholder="e.g. Japan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="tripStart" className="text-[10px] uppercase text-[#666666] tracking-widest font-bold">Start Date</label>
                  <input id="tripStart" type="date" name="startDate" required className="input-editorial w-full px-2" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="tripEnd" className="text-[10px] uppercase text-[#666666] tracking-widest font-bold">End Date</label>
                  <input id="tripEnd" type="date" name="endDate" required className="input-editorial w-full px-2" />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsCreating(false)} className="btn-secondary w-full">Cancel</button>
                <button type="submit" className="btn-primary w-full" disabled={createStatus === 'loading'}>
                  {createStatus === 'loading' ? 'Saving...' : 'Create'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-stagger-1 gap-6 border-b border-[#E5E5E5] pb-8">
        <div>
          <p className="text-[#8A9A86] text-xs font-bold tracking-[0.2em] uppercase mb-4">Command Center</p>
          <h1 className="text-5xl md:text-6xl font-serif">Welcome back, {user?.name?.split(' ')[0]}</h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Itinerary
        </button>
      </div>

      {isLoading ? (
        <div className="text-[#A0AEC0] animate-pulse text-sm uppercase tracking-widest text-center mt-20">Retrieving dossiers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* COLUMN 1 & 2: TRIPS */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <h2 className="text-2xl font-serif text-[#1A1A1A] animate-stagger-2">Active Journeys</h2>
            
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlight First Trip as Large Bento */}
                <Link 
                  href={`/trips/${trips[0].id}`} 
                  className="editorial-card bento-card-large group cursor-pointer animate-stagger-3 block"
                >
                  <div className="flex-1">
                    <span className="bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-6 inline-block">Next Departure</span>
                    <h3 className="text-4xl font-serif group-hover:text-[#8A9A86] transition-colors">{trips[0].name}</h3>
                    <p className="text-[#666666] flex items-center gap-2 mt-4 text-lg font-light">
                      <Map className="w-5 h-5 opacity-50"/> {trips[0].destination}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#E5E5E5] text-xs text-[#666666] uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/> {new Date(trips[0].startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4"/> {trips[0].tripParticipants?.length || 1} Guests</span>
                  </div>
                </Link>

                {/* Remaining Trips */}
                {trips.slice(1).map((trip, idx) => (
                  <Link 
                    key={trip.id} 
                    href={`/trips/${trip.id}`} 
                    className={`editorial-card bento-card-medium group cursor-pointer animate-stagger-4 block`}
                    style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}
                  >
                    <h3 className="text-2xl font-serif group-hover:text-[#8A9A86] transition-colors mb-4">{trip.name}</h3>
                    <div className="flex items-center justify-between text-xs text-[#666666] uppercase tracking-widest border-t border-[#E5E5E5] pt-4 mt-auto">
                      <span className="flex items-center gap-2">
                        <Map className="w-4 h-4"/> {trip.destination}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="editorial-card p-16 text-center flex flex-col items-center justify-center gap-4 animate-stagger-3 bg-[#FAF9F6]">
                <Map className="w-10 h-10 text-[#A0AEC0] mb-2" strokeWidth={1} />
                <h3 className="text-2xl font-serif text-[#1A1A1A]">No expeditions planned.</h3>
                <p className="text-[#666666] text-sm">Create your first itinerary to begin.</p>
              </div>
            )}
          </div>

          {/* COLUMN 3: WATCHED FLIGHTS & ACTIONS */}
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-serif text-[#1A1A1A] animate-stagger-2">Flight Radar</h2>
            
            {watchedFlights.length > 0 ? (
              <div className="flex flex-col gap-4">
                {watchedFlights.map((wf, idx) => (
                  <div key={wf.id} className="editorial-card bento-card-small animate-stagger-4 group" style={{ animationDelay: `${0.4 + (idx * 0.1)}s` }}>
                    <div className="flex justify-between items-start mb-6 border-b border-[#E5E5E5] pb-4">
                      <div className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center bg-[#FAF9F6]">
                        <Plane className="w-4 h-4 text-[#1A1A1A]" />
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-[#8A9A86] tracking-[0.2em] uppercase font-bold">Watching</span>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteFlight(wf.id); }} 
                          className="text-[#A0AEC0] hover:text-[#C53030] transition-colors"
                          title="Unwatch Flight"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-serif text-2xl">{wf.flightNumber}</h4>
                    <p className="text-[#666666] text-xs font-mono mt-2">{new Date(wf.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="editorial-card p-10 text-center animate-stagger-4 bg-[#FAF9F6]">
                <BookmarkPlus className="w-8 h-8 text-[#A0AEC0] mx-auto mb-6" strokeWidth={1} />
                <p className="text-sm text-[#666666] font-light leading-relaxed">Your radar is clear. Track flights from the search page to monitor prices.</p>
                <Link href="/flights" className="text-[#1A1A1A] text-xs uppercase tracking-widest font-bold mt-6 inline-flex items-center gap-2 hover:text-[#8A9A86] transition-colors">
                  Search Flights <ArrowRight className="w-3 h-3"/>
                </Link>
              </div>
            )}

            <div className="editorial-card p-8 animate-stagger-5 bg-[#1A1A1A] text-white">
               <h3 className="font-serif text-2xl mb-4 text-white">Got an Invite?</h3>
               <p className="text-white/70 text-sm font-light mb-8 leading-relaxed">Check your email for a magic link, or redeem your token manually.</p>
               <Link href="/invites" className="btn-secondary w-full text-white border-white/30 hover:border-white hover:bg-white hover:text-[#1A1A1A]">
                 Redeem Invite
               </Link>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
