"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plane, Search, ArrowRight, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Link from "next/link";

function FlightsContent() {
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
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#E5E5E5] pb-8 gap-6">
        <div>
          <p className="text-[#8A9A86] text-xs font-bold tracking-[0.2em] uppercase mb-4">Search Results</p>
          <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A]">
            {origin || "Any"} <span className="font-sans font-light mx-2 text-[#A0AEC0]">→</span> {dest || "Any"}
          </h1>
        </div>
        <div className="text-[#1A1A1A] font-mono text-sm uppercase tracking-widest bg-[#FAF9F6] border border-[#E5E5E5] px-6 py-3 rounded-full">
          {date || "Flexible Dates"}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
          <Search className="w-10 h-10 text-[#A0AEC0]" strokeWidth={1} />
          <p className="uppercase tracking-widest text-xs font-bold text-[#666666]">Consulting Global Networks...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center editorial-card p-12 border-t-4 border-t-[#C53030] bg-[#FAF9F6]">
           <AlertCircle className="w-10 h-10 text-[#C53030] mb-4" />
           <h3 className="font-serif text-3xl text-[#1A1A1A]">Search Failed</h3>
           <p className="text-[#666666] text-sm max-w-md leading-relaxed mb-4">{error}</p>
           <Link href="/" className="btn-secondary">Return to Search</Link>
        </div>
      ) : flights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center editorial-card p-12 bg-[#FAF9F6]">
           <Plane className="w-10 h-10 text-[#A0AEC0] mb-4" strokeWidth={1} />
           <h3 className="font-serif text-3xl text-[#1A1A1A]">No Flights Found</h3>
           <p className="text-[#666666] text-sm font-light mb-6">Try adjusting your dates or airports.</p>
           <Link href="/" className="btn-secondary">Return to Search</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {flights.map((f, i) => (
            <div key={`${f.flightNumber}-${i}`} className="editorial-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:bg-[#FAF9F6] transition-colors group cursor-pointer animate-stagger-2" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center shadow-sm">
                  <Plane className="w-5 h-5 text-[#1A1A1A] group-hover:text-[#8A9A86] transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-2xl font-serif text-[#1A1A1A]">{f.airline}</div>
                  <div className="text-[10px] text-[#666666] tracking-[0.2em] uppercase font-bold mt-1">{f.flightNumber}</div>
                </div>
              </div>
              
              <div className="text-center w-full md:w-auto flex flex-col gap-2">
                <div className="font-bold tracking-wider text-xl flex items-center gap-4 justify-center text-[#1A1A1A]">
                  <span>{f.departureAirport}</span>
                  <span className="w-12 h-[1px] bg-[#E5E5E5] relative block">
                     <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-[#A0AEC0] rotate-45"></span>
                  </span>
                  <span>{f.arrivalAirport}</span>
                </div>
                <div className="text-sm text-[#666666] font-mono">
                  {new Date(f.departureTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(f.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="text-[10px] text-[#8A9A86] font-bold uppercase tracking-widest mt-1 bg-[#FAF9F6] border border-[#E5E5E5] rounded-full px-3 py-1 inline-block mx-auto">
                  {f.duration.replace('PT', '').toLowerCase()}
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-4xl font-serif text-[#1A1A1A]">${f.price}</div>
                <a 
                  href={`/flights/${f.flightNumber}?airline=${encodeURIComponent(f.airline)}&route=${encodeURIComponent(f.departureAirport + ' → ' + f.arrivalAirport)}&time=${encodeURIComponent(f.departureTime)}&arrTime=${encodeURIComponent(f.arrivalTime)}&price=${f.price}&code=${f.flightNumber}`}
                  className="btn-secondary px-6"
                >
                  Select <ArrowRight className="w-4 h-4 ml-2"/>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-32"><div className="animate-pulse font-serif text-2xl text-[#1A1A1A]">Loading network...</div></div>}>
      <FlightsContent />
    </Suspense>
  );
}
