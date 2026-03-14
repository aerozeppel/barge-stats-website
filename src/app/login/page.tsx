"use client";

import { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = login(password);

    if (success) {
      router.push("/barge");
    } else {
      setError("Incorrect password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md glass-panel rounded-2xl p-8 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center border border-white/5 shadow-inner">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Barge Stats</h1>
            <p className="text-zinc-400 text-sm">Enter the shared password to access the pub dashboard.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm font-medium pl-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-medium px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
