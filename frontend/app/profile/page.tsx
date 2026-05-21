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
    <main className="min-h-screen pt-32 pb-16 px-6 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
        <div>
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-2">Member Profile</p>
          <h1 className="text-5xl font-serif">Hello, {user?.name}</h1>
        </div>
        <button onClick={handleLogout} className="aero-button-ghost py-3 px-6 flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="aero-glass p-8 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFB000] to-transparent opacity-50"></div>
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/20 flex items-center justify-center">
              <User className="w-10 h-10 text-white/50" />
            </div>
            <div>
              <h2 className="text-xl font-serif">{user?.name}</h2>
              <p className="text-white/50 text-sm flex items-center justify-center gap-2 mt-2">
                <Mail className="w-3 h-3"/> {user?.email}
              </p>
            </div>
            <div className="w-full mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              <div className="flex justify-between text-xs tracking-widest uppercase">
                <span className="text-white/40">Status</span>
                <span className="text-cyan-400 flex items-center gap-1"><Shield className="w-3 h-3"/> Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-8">
          <h3 className="text-2xl font-serif">Account Overview</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="aero-glass flex flex-col gap-4 cursor-pointer" onClick={() => router.push('/trips')}>
              <Map className="w-8 h-8 text-cyan-400" />
              <div>
                <h4 className="font-bold text-lg">My Itineraries</h4>
                <p className="text-white/50 text-sm font-light">Manage your upcoming travels and past adventures.</p>
              </div>
            </div>

            <div className="aero-glass flex flex-col gap-4 cursor-pointer">
              <Bell className="w-8 h-8 text-cyan-400" />
              <div>
                <h4 className="font-bold text-lg">Notifications</h4>
                <p className="text-white/50 text-sm font-light">Price alerts, trip invites, and system updates.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-8 border border-white/10 bg-white/5 flex flex-col gap-4">
            <h4 className="font-serif text-xl">Preferences</h4>
            <p className="text-white/40 font-light text-sm">Profile editing, password reset, and newsletter preferences will be available in the upcoming luxury suite update.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
