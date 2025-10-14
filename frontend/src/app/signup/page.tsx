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
    <div className="min-h-svh relative flex items-center justify-center px-6 py-12" style={{ backgroundColor: "#0A0F1C" }}>
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full blur-3xl opacity-30" style={{ background: "#2563EB" }} />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: "#22D3EE" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur p-6 md:p-8 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
          <h1 className="text-center text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            Create Your Account
          </h1>
          <p className="mt-2 text-center text-sm text-white/70">
            Join NeuroLearn — your personal AI tutor for smarter learning.
          </p>

          <form onSubmit={submit} className="mt-6 grid gap-4">
            {/* Name */}
            <label className="block">
              <span className="sr-only">Full Name</span>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-white/25">
                <User className="h-4 w-4 text-white/70" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base placeholder-white/50 focus:outline-none"
                />
              </div>
            </label>
            {/* Email */}
            <label className="block">
              <span className="sr-only">Email Address</span>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-white/25">
                <Mail className="h-4 w-4 text-white/70" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base placeholder-white/50 focus:outline-none"
                />
              </div>
            </label>
            {/* Password */}
            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 focus-within:border-white/25">
                <Lock className="h-4 w-4 text-white/70" />
                <input
                  type={showPass? 'text':'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm md:text-base placeholder-white/50 focus:outline-none"
                />
                <button type="button" aria-label="Toggle password visibility" onClick={()=>setShowPass(s=>!s)} className="text-white/70 hover:text-white">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <label className="mt-1 flex items-start gap-2 text-xs text-white/80">
              <input type="checkbox" className="mt-0.5 accent-blue-500" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
              <span>
                I agree to the {""}
                <a href="/terms" target="_blank" rel="noreferrer" className="underline decoration-white/40 hover:decoration-white">Terms of Service</a> and {""}
                <a href="/privacy" target="_blank" rel="noreferrer" className="underline decoration-white/40 hover:decoration-white">Privacy Policy</a>.
              </span>
            </label>

            {error && (
              <div className="text-xs text-red-400">{error}</div>
            )}
            {success && (
              <div className="text-xs text-emerald-400">Account created! Redirecting…</div>
            )}

            <button
              type="submit"
              disabled={!valid || loading}
              className={`mt-1 inline-flex items-center justify-center rounded-2xl px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-medium transition shadow-[0_0_30px_rgba(34,211,238,0.15)]
                ${(!valid || loading) ? 'opacity-60 cursor-not-allowed bg-gradient-to-r from-blue-500 to-cyan-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:shadow-[0_0_45px_rgba(34,211,238,0.35)]'}`}
            >
              {loading && (
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
              )}
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-white/70">
            Already have an account? <Link href="/login" className="underline decoration-white/40 hover:decoration-white">Log in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
