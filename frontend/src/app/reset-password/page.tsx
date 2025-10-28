"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-svh relative flex items-center justify-center px-6 py-12 overflow-hidden" style={{ backgroundColor: "#0A0F1C" }}>
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-20 -left-16 h-64 w-64 rounded-full blur-3xl opacity-30" style={{ background: "#2563EB" }} />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl opacity-30" style={{ background: "#22D3EE" }} />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        <div className="relative rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.4),_0_0_50px_rgba(37,99,235,0.25)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/20 via-transparent to-cyan-400/20 blur-xl" />
          <h1 className="relative text-center text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 tracking-tight">Reset Password</h1>
          <p className="mt-2 text-center text-sm md:text-base text-white/70">Enter your email; we’ll send a reset link.</p>
          <form className="mt-6 grid gap-3" onSubmit={(e)=>{ e.preventDefault(); alert('If this were connected, a reset email would be sent.'); }}>
            <input className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm md:text-base text-white placeholder-white/50 focus:outline-none focus:border-cyan-400/50" placeholder="Email Address" type="email" required />
            <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2.5 text-sm md:text-base font-semibold hover:shadow-[0_0_60px_rgba(34,211,238,0.55)] transition">Send reset link</button>
          </form>
          <div className="mt-4 text-center text-xs text-white/70"><Link href="/login" className="underline decoration-white/40 hover:decoration-white">Back to login</Link></div>
        </div>
      </motion.div>
    </div>
  );
}
