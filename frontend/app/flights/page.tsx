"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plane, Search, ArrowRight, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";

export default function FlightsPage() {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "";
  const dest = searchParams.get("dest") || "";
  const date = searchParams.get("date") || "";
  const { token } = useAuthStore();

  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true);
      setError("");
      
      if (!origin || !dest || !date) {
         setError("Missing search parameters. Please provide Origin, Destination, and Date.");
         setIsLoading(false);
         return;
      }

      try {
        const queryParams = new URLSearchParams({
          originLocationCode: origin,
          destinationLocationCode: dest,
          departureDate: date,
          adults: "1"
        });

        const res = await fetch(`http://localhost:3001/flights/search?${queryParams.toString()}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to fetch flights");
        }

        const data = await res.json();
        setFlights(data.flights || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, [origin, dest, date]);

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
        <div>
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">Search Results</p>
          <h1 className="text-5xl font-serif">
            {origin || "Any"} → {dest || "Any"}
          </h1>
        </div>
        <div className="text-white/40 font-mono text-sm uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
          {date || "Flexible Dates"}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
          <Search className="w-12 h-12 text-cyan-400" />
          <p className="uppercase tracking-widest text-sm text-white/50">Consulting Global Networks...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center aero-glass p-8 border-t border-red-500">
           <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
           <h3 className="font-serif text-2xl text-white/80">Search Failed</h3>
           <p className="text-red-400 text-sm max-w-md">{error}</p>
           <Link href="/" className="aero-button-ghost mt-6">Return to Search</Link>
        </div>
      ) : flights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center aero-glass p-8">
           <Plane className="w-12 h-12 text-white/20 mb-2" />
           <h3 className="font-serif text-2xl text-white/60">No Flights Found</h3>
           <p className="text-white/40 text-sm font-light">Try adjusting your dates or airports.</p>
           <Link href="/" className="aero-button-ghost mt-6">Return to Search</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {flights.map((f, i) => (
            <div key={`${f.flightNumber}-${i}`} className="aero-glass p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors group cursor-pointer animate-stagger-2" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                  <Plane className="w-6 h-6 text-white/60 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div>
                  <div className="text-xl font-serif">{f.airline}</div>
                  <div className="text-xs text-white/50 tracking-widest uppercase">{f.flightNumber}</div>
                </div>
              </div>
              
              <div className="text-center w-full md:w-auto flex flex-col gap-1">
                <div className="font-bold tracking-wider text-lg flex items-center gap-3 justify-center">
                  <span>{f.departureAirport}</span>
                  <span className="w-10 h-[1px] bg-white/20 relative block">
                     <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-white/20 rotate-45"></span>
                  </span>
                  <span>{f.arrivalAirport}</span>
                </div>
                <div className="text-sm text-white/60 font-mono">
                  {new Date(f.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(f.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                  Duration: {f.duration.replace('PT', '').toLowerCase()}
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-3xl font-serif text-cyan-400">${f.price}</div>
                <a 
                  href={`/flights/${f.flightNumber}?airline=${encodeURIComponent(f.airline)}&route=${encodeURIComponent(f.departureAirport + ' → ' + f.arrivalAirport)}&time=${encodeURIComponent(f.departureTime)}&price=${f.price}&code=${f.flightNumber}`}
                  className="aero-button-ghost py-3 px-6 flex items-center gap-2"
                >
                  Select <ArrowRight className="w-4 h-4"/>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
