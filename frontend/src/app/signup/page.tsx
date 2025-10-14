"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const valid = name.trim().length > 0 && email.trim().length > 0 && password.trim().length > 0 && agree;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) { setError("Please fill in all fields and accept the terms."); return; }
    setError(null);
    setLoading(true);
    // Simulate signup API
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Redirect to dashboard substitute after brief delay
      setTimeout(() => { router.push("/progress"); }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-svh relative flex items-center justify-center px-6 py-12 overflow-hidden" style={{ backgroundColor: "#0A0F1C" }}>
      {/* Layered neon particles / waves */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: "#2563EB" }} />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: "#22D3EE", animationDelay: '0.5s' }} />
        <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute -inset-40 bg-[radial-gradient(ellipse_at_center,_rgba(34,211,238,0.12),transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="relative rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.4),_0_0_50px_rgba(37,99,235,0.25)]">
          {/* holographic edge highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-400/20 blur-xl" />
          <h1 className="relative text-center text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 tracking-tight">
            Create Your Account
          </h1>
          <p className="mt-2 text-center text-sm md:text-base text-white/70">
            Join NeuroLearn — your personal AI tutor for smarter learning.
          </p>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            {/* Name */}
            <label className="block">
              <span className="sr-only">Full Name</span>
              <div className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-cyan-400/50 transition">
                <User className="h-4 w-4 text-white/70 group-focus-within:text-cyan-300 transition" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base placeholder-white/50 focus:outline-none focus:placeholder-white/30"
                />
              </div>
            </label>
            {/* Email */}
            <label className="block">
              <span className="sr-only">Email Address</span>
              <div className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-cyan-400/50 transition">
                <Mail className="h-4 w-4 text-white/70 group-focus-within:text-cyan-300 transition" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base placeholder-white/50 focus:outline-none focus:placeholder-white/30"
                />
              </div>
            </label>
            {/* Password */}
            <label className="block">
              <span className="sr-only">Password</span>
              <div className="group flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-cyan-400/50 transition">
                <Lock className="h-4 w-4 text-white/70 group-focus-within:text-cyan-300 transition" />
                <input
                  type={showPass? 'text':'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base placeholder-white/50 focus:outline-none focus:placeholder-white/30"
                />
                <button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPass(s=>!s)} className="text-white/70 hover:text-white transition">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="mt-1 flex items-start gap-2 text-xs text-white/80">
              <input type="checkbox" className="mt-0.5 appearance-none h-4 w-4 rounded-sm border border-white/30 bg-white/5 checked:bg-cyan-400 checked:border-cyan-400 transition shadow-[0_0_12px_rgba(34,211,238,0.35)]" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
              <span>
                I agree to the {""}
                <a href="/terms" target="_blank" rel="noreferrer" className="underline decoration-white/40 hover:decoration-white">Terms of Service</a> and {""}
                <a href="/privacy" target="_blank" rel="noreferrer" className="underline decoration-white/40 hover:decoration-white">Privacy Policy</a>.
              </span>
            </label>

            {error && (
              <div className="text-xs text-red-400 drop-shadow-[0_0_12px_rgba(248,113,113,0.35)]">{error}</div>
            )}
            {success && (
              <div className="text-xs text-emerald-400">Account created! Redirecting…</div>
            )}

            <motion.button
              type="submit"
              disabled={!valid || loading}
              className={`mt-1 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-semibold tracking-wide transition shadow-[0_0_30px_rgba(34,211,238,0.25)]
                ${(!valid || loading) ? 'opacity-60 cursor-not-allowed bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-[0_0_60px_rgba(34,211,238,0.55)]'}`}
              whileHover={!loading && valid ? { scale: 1.02 } : undefined}
              whileTap={!loading && valid ? { scale: 0.98 } : undefined}
            >
              {loading && (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
              )}
              Sign Up
            </motion.button>
          </form>

          <div className="mt-4 text-center text-xs text-white/70">
            Already have an account? <Link href="/login" className="underline decoration-white/40 hover:decoration-white hover:shadow-[0_0_12px_rgba(34,211,238,0.35)]">Log in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
