"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Plane, Star, Clock, MapPin, Check, BookmarkPlus, Plus } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useAuthStore } from "../../../store/authStore";

function FlightDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  
  const [isWatching, setIsWatching] = useState(false);
  const [watchError, setWatchError] = useState("");
  const [isAddingToTrip, setIsAddingToTrip] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [addStatus, setAddStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const id = params.id as string;
  const airline = searchParams.get("airline") || "Unknown Airline";
  const route = searchParams.get("route") || "Unknown Route";
  const time = searchParams.get("time") || "Unknown Time";
  const arrTime = searchParams.get("arrTime") || "Unknown Time";
  const price = searchParams.get("price") || "0";
  const code = searchParams.get("code") || "XX 000";

  useEffect(() => {
    if (isAuthenticated) {
      fetch("http://localhost:3001/trips", { headers: { "Authorization": `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
           if(Array.isArray(data)) setTrips(data);
        }).catch(e => console.error(e));
    }
  }, [isAuthenticated, token]);

  const handleWatchFlight = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setWatchError("");

    try {
      const res = await fetch("http://localhost:3001/watched-flights", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ flightNumber: code, date: new Date().toISOString() })
      });
      if(res.ok) {
        setIsWatching(true);
      } else {
        const data = await res.json();
        setWatchError(data.error || "Failed to watch flight");
      }
    } catch(err: any) {
      setWatchError(err.message);
    }
  };

  const handleAddToTrip = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setIsAddingToTrip(true);
  };

  const confirmAddToTrip = async () => {
    if(!selectedTripId) return;
    setAddStatus("loading");
    
    try {
      const res = await fetch("http://localhost:3001/amadeus/snapshot", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          tripId: selectedTripId,
          flightNumber: code,
          airline: airline,
          departureAirport: route.split(' → ')[0],
          arrivalAirport: route.split(' → ')[1],
          departureTime: time,
          arrivalTime: arrTime,
          price: Number(price),
          currency: "USD"
        })
      });

      if(!res.ok) {
        throw new Error("Failed to add to trip");
      }

      setAddStatus("success");
      setTimeout(() => {
        router.push(`/trips/${selectedTripId}`);
      }, 1500);

    } catch(e) {
      setAddStatus("error");
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto w-full">
      {isAddingToTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#FAF9F6]/90 backdrop-blur-md">
          <div className="editorial-card p-10 w-full max-w-md shadow-2xl">
            {addStatus === 'success' ? (
              <div className="text-center animate-stagger-1">
                <div className="w-16 h-16 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-[#15803D]" />
                </div>
                <h2 className="text-3xl font-serif mb-2 text-[#1A1A1A]">Added to Itinerary!</h2>
                <p className="text-[#666666] text-sm mb-6 leading-relaxed">Flight successfully attached to your trip.</p>
              </div>
            ) : (
              <div className="animate-stagger-1">
                <h2 className="text-3xl font-serif mb-6 text-[#1A1A1A]">Add to Trip</h2>
                <div className="flex flex-col gap-6 mb-8">
                  <div className="flex justify-between border-b border-[#E5E5E5] pb-4">
                    <span className="text-[#666666] text-sm uppercase tracking-widest font-bold text-[10px]">Flight</span>
                    <span className="font-serif text-[#1A1A1A] text-lg">{airline} {code}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="tripSelect" className="text-[10px] uppercase text-[#666666] tracking-widest font-bold">Select Itinerary</label>
                    <select 
                      id="tripSelect" 
                      className="input-editorial w-full mt-1" 
                      value={selectedTripId} 
                      onChange={e => setSelectedTripId(e.target.value)}
                    >
                      <option value="">-- Choose a Trip --</option>
                      {trips.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  {addStatus === 'error' && <p className="text-[#C53030] text-xs">Failed to add flight. Check permissions.</p>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsAddingToTrip(false)} className="btn-secondary w-full">Cancel</button>
                  <button onClick={confirmAddToTrip} className="btn-primary w-full" disabled={addStatus === 'loading' || !selectedTripId}>
                    {addStatus === 'loading' ? 'Saving...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={() => router.back()} className="text-[#666666] hover:text-[#1A1A1A] uppercase tracking-widest text-[10px] font-bold mb-10 flex items-center gap-2 transition-colors">
        ← Back to Results
      </button>

      <div className="editorial-card p-12 relative overflow-hidden bg-[#FFFFFF]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-[#E5E5E5] pb-10 gap-6">
          <div>
            <div className="text-[#8A9A86] text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Flight Dossier</div>
            <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A]">{airline}</h1>
            <p className="text-[#666666] tracking-[0.2em] uppercase text-xs mt-4 font-bold">{code} <span className="mx-2 text-[#E5E5E5]">|</span> Premium Class</p>
          </div>
          <div className="md:text-right bg-[#FAF9F6] p-6 border border-[#E5E5E5] self-stretch md:self-auto flex flex-col justify-center">
            <div className="text-4xl font-serif text-[#1A1A1A]">${price}</div>
            <div className="text-[10px] text-[#666666] uppercase tracking-[0.2em] font-bold mt-2">Per Passenger</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-10">
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-serif text-2xl mb-2 text-[#1A1A1A]">Routing</h4>
                <p className="text-[#666666] font-light leading-relaxed">{route}</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#1A1A1A]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-serif text-2xl mb-2 text-[#1A1A1A]">Schedule</h4>
                <p className="text-[#666666] font-light leading-relaxed">Departure: {new Date(time).toLocaleString()}</p>
                <p className="text-[#666666] font-light leading-relaxed">Arrival: {new Date(arrTime).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 border border-[#E5E5E5] rounded-full flex items-center justify-center shrink-0 bg-[#FAF9F6]">
                <Star className="w-4 h-4 text-[#8A9A86]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-serif text-2xl mb-2 text-[#1A1A1A]">Amenities</h4>
                <p className="text-[#666666] font-light leading-relaxed">Spacious seating, Refined Dining, Priority Boarding.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-6 bg-[#FAF9F6] p-8 border border-[#E5E5E5]">
            {watchError && <div className="text-[#C53030] text-xs text-center p-2 bg-[#FFF5F5]">{watchError}</div>}
            
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2">Actions</h3>
            
            <button 
              onClick={handleWatchFlight}
              className={`btn-secondary py-4 flex items-center justify-center gap-2 ${isWatching ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]' : ''}`}
            >
              {isWatching ? <><Check className="w-4 h-4"/> Watching</> : <><BookmarkPlus className="w-4 h-4"/> Track Price</>}
            </button>
            
            <button onClick={handleAddToTrip} className="btn-primary py-4 flex justify-center items-center gap-2 w-full">
               <Plus className="w-4 h-4" /> Add to Itinerary
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FlightDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-32"><div className="animate-pulse font-serif text-2xl text-[#1A1A1A]">Loading dossier...</div></div>}>
      <FlightDetailsContent />
    </Suspense>
  );
}
