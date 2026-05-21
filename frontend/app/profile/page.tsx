"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { User, Mail, Map, Bell, Shield, LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/user/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, router, token]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-[#E5E5E5] pb-8 gap-6">
        <div>
          <p className="text-[#8A9A86] text-xs font-bold tracking-[0.2em] uppercase mb-4">Member Profile</p>
          <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A]">Hello, {user?.name}</h1>
        </div>
        <button onClick={handleLogout} className="btn-secondary py-3 px-6 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="editorial-card p-10 flex flex-col items-center text-center gap-6 relative bg-[#FAF9F6] border-t-4 border-t-[#8A9A86]">
            <div className="w-24 h-24 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center shadow-sm">
              <User className="w-10 h-10 text-[#A0AEC0]" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-[#1A1A1A]">{user?.name}</h2>
              <p className="text-[#666666] text-sm flex items-center justify-center gap-2 mt-2 font-light">
                <Mail className="w-3 h-3 text-[#A0AEC0]"/> {user?.email}
              </p>
            </div>
            <div className="w-full mt-4 pt-6 border-t border-[#E5E5E5] flex flex-col gap-2">
              <div className="flex justify-between text-[10px] tracking-widest uppercase font-bold text-[#1A1A1A]">
                <span className="text-[#666666]">Status</span>
                <span className="text-[#8A9A86] flex items-center gap-1"><Shield className="w-3 h-3"/> Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-8">
          <h3 className="text-2xl font-serif text-[#1A1A1A]">Account Overview</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="editorial-card p-8 flex flex-col gap-6 cursor-pointer group" onClick={() => router.push('/trips')}>
              <Map className="w-8 h-8 text-[#1A1A1A] group-hover:text-[#8A9A86] transition-colors" strokeWidth={1.5} />
              <div>
                <h4 className="font-serif text-2xl mb-2 text-[#1A1A1A]">My Itineraries</h4>
                <p className="text-[#666666] text-sm font-light leading-relaxed">Manage your upcoming travels and past adventures.</p>
              </div>
            </div>

            <div className="editorial-card p-8 flex flex-col gap-6 cursor-pointer group">
              <Bell className="w-8 h-8 text-[#1A1A1A] group-hover:text-[#8A9A86] transition-colors" strokeWidth={1.5} />
              <div>
                <h4 className="font-serif text-2xl mb-2 text-[#1A1A1A]">Notifications</h4>
                <p className="text-[#666666] text-sm font-light leading-relaxed">Price alerts, trip invites, and system updates.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-8 editorial-card flex flex-col gap-4 border-l-4 border-l-[#1A1A1A]">
            <h4 className="font-serif text-xl text-[#1A1A1A]">Preferences</h4>
            <p className="text-[#666666] font-light text-sm leading-relaxed">Profile editing, password reset, and newsletter preferences will be available in the upcoming luxury suite update.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
