"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Plane, Star, Clock, MapPin, Check, BookmarkPlus } from "lucide-react";
import { useState, Suspense } from "react";
import { useAuthStore } from "../../../store/authStore";

function FlightDetailsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token, isAuthenticated } = useAuthStore();
  
  const [isWatching, setIsWatching] = useState(false);
  const [watchError, setWatchError] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookStatus, setBookStatus] = useState<"idle"|"loading"|"success">("idle");
  const [passengerName, setPassengerName] = useState(useAuthStore.getState().user?.name || "");

  const id = params.id as string;
  const airline = searchParams.get("airline") || "Unknown Airline";
  const route = searchParams.get("route") || "Unknown Route";
  const time = searchParams.get("time") || "Unknown Time";
  const price = searchParams.get("price") || "0";
  const code = searchParams.get("code") || "XX 000";

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

  const handleBook = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setIsBooking(true);
  };

  const confirmBooking = () => {
    setBookStatus("loading");
    setTimeout(() => {
      setBookStatus("success");
    }, 1500);
  };

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-4xl mx-auto relative">
      {isBooking && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#05050A]/80 backdrop-blur-md">
          <div className="aero-glass p-8 w-full max-w-md border-t border-cyan-400">
            {bookStatus === 'success' ? (
              <div className="text-center">
                <Check className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h2 className="text-2xl font-serif mb-2">Booking Confirmed!</h2>
                <p className="text-white/50 text-sm mb-6">Your luxury experience is reserved.</p>
                <button onClick={() => router.push('/trips')} className="aero-button-cyan w-full">Go to Dashboard</button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-serif mb-6">Confirm Reservation</h2>
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50 text-sm">Flight</span>
                    <span className="font-bold">{airline} {code}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/50 text-sm">Total</span>
                    <span className="font-bold text-cyan-400">${price}</span>
                  </div>
                  <div>
                    <label htmlFor="passengerName" className="text-[10px] uppercase text-white/50 tracking-widest font-bold">Passenger Name</label>
                    <input id="passengerName" type="text" className="aero-input w-full mt-1" value={passengerName} onChange={e => setPassengerName(e.target.value)} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsBooking(false)} className="aero-button-ghost w-full">Cancel</button>
                  <button onClick={confirmBooking} className="aero-button-cyan w-full" disabled={bookStatus === 'loading'}>
                    {bookStatus === 'loading' ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <button onClick={() => router.back()} className="text-white/50 hover:text-white uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
        ← Back to Results
      </button>

      <div className="aero-glass p-12 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex justify-between items-start mb-12">
          <div>
            <div className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">Flight Details</div>
            <h1 className="text-5xl font-serif">{airline}</h1>
            <p className="text-white/50 tracking-widest uppercase text-sm mt-2">{code} • First Class</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-serif text-cyan-400">${price}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Per Passenger</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-white/40 mt-1" />
              <div>
                <h4 className="font-serif text-xl mb-1">Route</h4>
                <p className="text-white/60 font-light leading-relaxed">{route}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-white/40 mt-1" />
              <div>
                <h4 className="font-serif text-xl mb-1">Schedule</h4>
                <p className="text-white/60 font-light leading-relaxed">{time}</p>
                <p className="text-white/40 text-sm mt-1">Flight duration approx. 12h 45m</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="w-5 h-5 text-white/40 mt-1" />
              <div>
                <h4 className="font-serif text-xl mb-1">Amenities</h4>
                <p className="text-white/60 font-light leading-relaxed">Lie-flat seats, Premium Dining, Wi-Fi included, Lounge Access.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4">
            {watchError && <div className="text-red-400 text-xs text-center">{watchError}</div>}
            <button 
              onClick={handleWatchFlight}
              className={`aero-button-ghost py-4 flex items-center justify-center gap-2 ${isWatching ? 'border-cyan-400 text-cyan-400' : ''}`}
            >
              {isWatching ? <><Check className="w-4 h-4"/> Watching Price</> : <><BookmarkPlus className="w-4 h-4"/> Track Flight</>}
            </button>
            <button onClick={handleBook} className="aero-button-cyan py-4 text-center w-full">
              Proceed to Booking
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FlightDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-32"><div className="animate-pulse">Loading flight intel...</div></div>}>
      <FlightDetailsContent />
    </Suspense>
  );
}
