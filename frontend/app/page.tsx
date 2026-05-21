"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaneTakeoff, Calendar, MapPin, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination) return;
    setIsSearching(true);
    // Simulate slight delay for luxury feel, then route
    setTimeout(() => {
      router.push(`/flights?origin=${encodeURIComponent(origin)}&dest=${encodeURIComponent(destination)}&date=${date}`);
    }, 800);
  };

  return (
    <main className="min-h-screen pt-40 pb-16 px-6 max-w-[1400px] mx-auto flex flex-col gap-24 relative">
      
      {/* Decorative large text behind */}
      <div className="absolute top-40 left-0 text-[15vw] font-serif font-black opacity-5 select-none pointer-events-none leading-none -z-10">
        JOURNEY
      </div>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row gap-16 justify-between items-center relative z-10 mt-10">
        <div className="flex-1 flex flex-col gap-8">
          <div className="uppercase tracking-[0.3em] text-cyan-400 text-xs font-bold flex items-center gap-4">
            <span className="w-12 h-[1px] bg-[#FFB000]"></span> Elevate Your Travel
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black leading-[1.1] tracking-tight">
            Curated <br />
            <span className="italic text-white/70">Experiences</span>
          </h1>
          <p className="text-lg text-white/50 max-w-md font-light leading-relaxed">
            Discover flights, manage elegant itineraries, and track price drops in a truly refined digital environment.
          </p>
        </div>

        {/* Search Widget */}
        <div className="flex-1 w-full max-w-lg">
          <form onSubmit={handleSearch} className="aero-glass p-8 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB000] to-transparent opacity-50"></div>
            
            <h3 className="font-serif text-2xl mb-2">Where to next?</h3>
            
            <div className="flex flex-col gap-1">
              <label className="uppercase tracking-widest text-[10px] text-white/50 font-bold ml-1">Origin (IATA Code)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="e.g. MXP" 
                  className="aero-input w-full pl-12 uppercase"
                  maxLength={3}
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase tracking-widest text-[10px] text-white/50 font-bold ml-1">Destination (IATA Code)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="e.g. JFK" 
                  className="aero-input w-full pl-12 uppercase"
                  maxLength={3}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="uppercase tracking-widest text-[10px] text-white/50 font-bold ml-1">Departure Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="date" 
                  className="aero-input w-full pl-12"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="aero-button-cyan mt-4 flex items-center justify-center gap-3 group">
              {isSearching ? (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  Find Flights <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Quick Links / Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div className="aero-glass flex flex-col gap-6 cursor-pointer group">
          <PlaneTakeoff className="w-8 h-8 text-white/40 group-hover:text-cyan-400 transition-colors" />
          <h3 className="font-serif text-2xl">Flight Tracking</h3>
          <p className="text-sm text-white/40 leading-relaxed font-light">Monitor prices over time. Receive alerts when your dream destination becomes affordable.</p>
        </div>
        <div className="aero-glass flex flex-col gap-6 cursor-pointer group">
          <MapPin className="w-8 h-8 text-white/40 group-hover:text-cyan-400 transition-colors" />
          <h3 className="font-serif text-2xl">Smart Itineraries</h3>
          <p className="text-sm text-white/40 leading-relaxed font-light">Organize stops, book hotels, and map your entire journey in one elegant interface.</p>
        </div>
        <div className="aero-glass flex flex-col gap-6 cursor-pointer group border border-white/5 bg-white/5">
          <div className="mt-auto">
            <h3 className="font-serif text-2xl mb-4">Ready to go?</h3>
            <button onClick={() => router.push('/auth/register')} className="aero-button-ghost w-full">Create Account</button>
          </div>
        </div>
      </section>

    </main>
  );
}
