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
    <main className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative">
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#05050A]/80 backdrop-blur-md animate-stagger-1">
          <div className="aero-glass p-8 w-full max-w-md border-t border-cyan-500">
            <h2 className="text-2xl font-serif mb-6">Initialize Itinerary</h2>
            <form onSubmit={handleCreateTrip} className="flex flex-col gap-4">
              <div>
                <label htmlFor="tripName" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">Trip Name</label>
                <input id="tripName" type="text" name="name" required className="aero-input w-full mt-1" />
              </div>
              <div>
                <label htmlFor="tripDest" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">Destination</label>
                <input id="tripDest" type="text" name="destination" required className="aero-input w-full mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tripStart" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">Start Date</label>
                  <input id="tripStart" type="date" name="startDate" required className="aero-input w-full mt-1" />
                </div>
                <div>
                  <label htmlFor="tripEnd" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">End Date</label>
                  <input id="tripEnd" type="date" name="endDate" required className="aero-input w-full mt-1" />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => setIsCreating(false)} className="aero-button-ghost w-full">Cancel</button>
                <button type="submit" className="aero-button-cyan w-full" disabled={createStatus === 'loading'}>
                  {createStatus === 'loading' ? 'Saving...' : 'Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 animate-stagger-1 gap-4">
        <div>
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">Command Center</p>
          <h1 className="text-5xl font-serif">Welcome back, {user?.name?.split(' ')[0]}</h1>
        </div>
        <button onClick={() => setIsCreating(true)} className="aero-button-cyan flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Itinerary
        </button>
      </div>

      {isLoading ? (
        <div className="text-white/50 animate-pulse text-sm uppercase tracking-widest">Syncing secure data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMN 1 & 2: TRIPS (Bento Large + Mediums) */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-serif text-white/80 animate-stagger-2">Active Journeys</h2>
            
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Highlight First Trip as Large Bento */}
                <Link 
                  href={`/trips/${trips[0].id}`} 
                  className="bento-card-large group cursor-pointer animate-stagger-3 hover:bg-cyan-900/10 block"
                >
                  <div className="flex-1">
                    <span className="bg-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-4 inline-block">Next Departure</span>
                    <h3 className="text-4xl font-serif mt-2 group-hover:text-cyan-400 transition-colors">{trips[0].name}</h3>
                    <p className="text-white/60 flex items-center gap-2 mt-4 text-lg">
                      <Map className="w-5 h-5"/> {trips[0].destination}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-sm text-white/40 font-mono">
                    <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-white/60"/> {new Date(trips[0].startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-white/60"/> {trips[0].tripParticipants?.length || 1} Explorers</span>
                  </div>
                </Link>

                {/* Remaining Trips as smaller Bentos */}
                {trips.slice(1).map((trip, idx) => (
                  <Link 
                    key={trip.id} 
                    href={`/trips/${trip.id}`} 
                    className={`bento-card-medium group cursor-pointer animate-stagger-4 hover:bg-white/5 block`}
                    style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}
                  >
                    <h3 className="text-2xl font-serif group-hover:text-cyan-400 transition-colors">{trip.name}</h3>
                    <p className="text-sm text-white/50 flex items-center gap-2 mt-2">
                      <Map className="w-4 h-4"/> {trip.destination}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="aero-glass p-12 text-center flex flex-col items-center justify-center gap-4 animate-stagger-3">
                <Map className="w-12 h-12 text-white/20 mb-2" />
                <h3 className="text-xl font-serif text-white/60">No expeditions planned.</h3>
              </div>
            )}
          </div>

          {/* COLUMN 3: WATCHED FLIGHTS & ACTIONS */}
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-serif text-white/80 animate-stagger-2">Flight Radar</h2>
            
            {watchedFlights.length > 0 ? (
              <div className="flex flex-col gap-4">
                {watchedFlights.map((wf, idx) => (
                  <div key={wf.id} className="bento-card-small animate-stagger-4 group" style={{ animationDelay: `${0.4 + (idx * 0.1)}s` }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Plane className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/40 tracking-widest uppercase">Watching</span>
                        <button 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteFlight(wf.id); }} 
                          className="text-white/20 hover:text-red-400 transition-colors p-1"
                          title="Unwatch Flight"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-serif text-xl">{wf.flightNumber}</h4>
                    <p className="text-white/50 text-xs font-mono mt-1">Date: {new Date(wf.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="aero-glass p-8 text-center animate-stagger-4">
                <BookmarkPlus className="w-8 h-8 text-white/20 mx-auto mb-4" />
                <p className="text-sm text-white/50 font-light">Your radar is clear. Track flights from the search page to monitor prices.</p>
                <Link href="/flights" className="text-cyan-400 text-xs uppercase tracking-widest font-bold mt-4 inline-flex items-center gap-1 hover:text-cyan-300">
                  Search Flights <ArrowRight className="w-3 h-3"/>
                </Link>
              </div>
            )}

            <div className="aero-glass p-6 mt-4 animate-stagger-5 bg-gradient-to-br from-cyan-900/20 to-purple-900/20">
               <h4 className="font-serif text-lg mb-2">Got an Invite?</h4>
               <p className="text-xs text-white/50 font-light mb-4">Enter your companion token to sync journeys.</p>
               <Link href="/invites" className="aero-button-ghost w-full justify-center flex text-sm py-2">
                 Redeem Token
               </Link>
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
