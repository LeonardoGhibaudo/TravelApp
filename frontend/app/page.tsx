"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PlaneTakeoff, MapPin, ArrowRight, Search } from "lucide-react";

export default function Home() {
  const router = useRouter();
  
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [originIata, setOriginIata] = useState("");
  const [destIata, setDestIata] = useState("");
  const [date, setDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [originSuggestions, setOriginSuggestions] = useState<any[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);

  const fetchLocations = async (query: string) => {
    if (query.length < 2) return [];
    try {
      const res = await fetch(`http://localhost:3001/flights/locations?keyword=${encodeURIComponent(query)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return [];
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (originQuery && originQuery !== originIata) {
        const results = await fetchLocations(originQuery);
        setOriginSuggestions(results);
      } else {
        setOriginSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [originQuery, originIata]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destQuery && destQuery !== destIata) {
        const results = await fetchLocations(destQuery);
        setDestSuggestions(results);
      } else {
        setDestSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [destQuery, destIata]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originIata || !destIata || !date) return;
    setIsSearching(true);
    router.push(`/flights?origin=${encodeURIComponent(originIata)}&dest=${encodeURIComponent(destIata)}&date=${date}`);
  };

  return (
    <main className="flex-1 flex flex-col items-center w-full px-6 py-20 max-w-7xl mx-auto">
      <section className="w-full flex flex-col md:flex-row gap-16 justify-between items-center mt-10">
        <div className="flex-1 flex flex-col gap-6">
          <div className="uppercase tracking-[0.2em] text-[#8A9A86] text-xs font-bold flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#8A9A86]"></span> Curated Escapes
          </div>
          <h1 className="text-6xl md:text-8xl font-serif leading-[1.05] tracking-tight text-[#1A1A1A]">
            The Art of <br />
            <span className="italic text-[#C28F79]">Travel.</span>
          </h1>
          <p className="text-lg text-[#666666] max-w-md font-light leading-relaxed mt-4">
            A refined approach to journey mapping. Discover flights, manage elegant itineraries, and coordinate with companions.
          </p>
        </div>

        <div className="flex-1 w-full max-w-lg">
          <form onSubmit={handleSearch} className="editorial-card p-10 flex flex-col gap-6 relative">
            <h3 className="font-serif text-3xl mb-4">Where to next?</h3>
            
            <div className="flex flex-col gap-2 relative">
              <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Origin</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                <input 
                  type="text" 
                  placeholder="e.g. Milano" 
                  className="input-editorial w-full pl-12"
                  value={originQuery}
                  onChange={(e) => {
                    setOriginQuery(e.target.value);
                    if(originIata) setOriginIata("");
                  }}
                  required
                />
                {originSuggestions.length > 0 && !originIata && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-[#E5E5E5] mt-1 z-50 max-h-60 overflow-y-auto shadow-xl">
                    {originSuggestions.map((loc) => (
                      <li 
                        key={loc.iataCode} 
                        className="p-3 hover:bg-[#FAF9F6] cursor-pointer border-b border-[#F0F0F0] last:border-0"
                        onClick={() => {
                          setOriginQuery(`${loc.cityName || loc.name} (${loc.iataCode})`);
                          setOriginIata(loc.iataCode);
                          setOriginSuggestions([]);
                        }}
                      >
                        <div className="font-medium">{loc.cityName || loc.name}</div>
                        <div className="text-xs text-[#666666]">{loc.name} • {loc.iataCode}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Destination</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" />
                <input 
                  type="text" 
                  placeholder="e.g. New York" 
                  className="input-editorial w-full pl-12"
                  value={destQuery}
                  onChange={(e) => {
                    setDestQuery(e.target.value);
                    if(destIata) setDestIata("");
                  }}
                  required
                />
                {destSuggestions.length > 0 && !destIata && (
                  <ul className="absolute top-full left-0 w-full bg-white border border-[#E5E5E5] mt-1 z-50 max-h-60 overflow-y-auto shadow-xl">
                    {destSuggestions.map((loc) => (
                      <li 
                        key={loc.iataCode} 
                        className="p-3 hover:bg-[#FAF9F6] cursor-pointer border-b border-[#F0F0F0] last:border-0"
                        onClick={() => {
                          setDestQuery(`${loc.cityName || loc.name} (${loc.iataCode})`);
                          setDestIata(loc.iataCode);
                          setDestSuggestions([]);
                        }}
                      >
                        <div className="font-medium">{loc.cityName || loc.name}</div>
                        <div className="text-xs text-[#666666]">{loc.name} • {loc.iataCode}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="uppercase tracking-widest text-[10px] text-[#666666] font-semibold">Departure Date</label>
              <input 
                type="date" 
                className="input-editorial w-full"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary mt-4 w-full" disabled={!originIata || !destIata || !date || isSearching}>
              {isSearching ? "Searching..." : "Find Flights"}
            </button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
        <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-8">
          <PlaneTakeoff className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
          <h3 className="font-serif text-2xl">Flight Intelligence</h3>
          <p className="text-sm text-[#666666] leading-relaxed">Uncover optimal routing and monitor pricing trends in a distraction-free environment.</p>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-8">
          <MapPin className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.5} />
          <h3 className="font-serif text-2xl">Refined Itineraries</h3>
          <p className="text-sm text-[#666666] leading-relaxed">Map your journey stop by stop. Add rich descriptions and manage timelines seamlessly.</p>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-8 bg-[#F5F4F0] p-8 -mt-8">
          <h3 className="font-serif text-2xl mb-2">Begin your journey.</h3>
          <button onClick={() => router.push('/auth/register')} className="btn-secondary">Join Aero</button>
        </div>
      </section>
    </main>
  );
}
