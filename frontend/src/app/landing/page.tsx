"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Sparkles, Headphones, Globe2 } from "lucide-react";

export default function NeuroLearnLanding() {
  return (
    <div className="min-h-svh text-white relative overflow-hidden">
      {/* Background gradient + glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#5B6BFF] via-[#6c63ff33] to-[#6EE7B7]" />
      <div className="pointer-events-none absolute -z-10 inset-0" aria-hidden>
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl opacity-30 bg-[#5B6BFF]" />
        <div className="absolute top-40 -right-20 h-72 w-72 rounded-full blur-3xl opacity-30 bg-[#6EE7B7]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-20 backdrop-blur-md/30 bg-white/5 border-b border-white/10">
        <nav className="mx-auto max-w-6xl w-full flex items-center justify-between px-6 md:px-10 py-4">
          <Link href="/" className="text-xl md:text-2xl font-semibold tracking-tight">NeuroLearn</Link>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li><a href="#home" className="opacity-90 hover:opacity-100">Home</a></li>
            <li><a href="#features" className="opacity-90 hover:opacity-100">Features</a></li>
            <li><a href="#about" className="opacity-90 hover:opacity-100">About</a></li>
            <li><Link href="/signup" className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 hover:bg-white/15 transition">Sign Up</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section id="home" className="mx-auto max-w-6xl w-full px-6 md:px-10 pt-14 md:pt-24 pb-10 md:pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="text-3xl md:text-6xl font-semibold tracking-[-0.02em] leading-tight drop-shadow-[0_0_30px_rgba(91,107,255,0.35)]">
            The Future of Learning. Powered by AI.
          </h1>
          <p className="mt-4 md:mt-6 text-sm md:text-lg opacity-90 max-w-3xl mx-auto">
            NeuroLearn is your personal AI tutor that understands how you think, learns with you,
            and guides you to mastery — not memorization.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 md:gap-4">
            <Link href="/signup" className="rounded-2xl bg-gradient-to-r from-[#5B6BFF] to-[#6EE7B7] px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-medium shadow-[0_0_25px_rgba(91,107,255,0.45)] hover:shadow-[0_0_35px_rgba(91,107,255,0.65)] transition">Get Started</Link>
            <a href="#features" className="rounded-2xl border border-white/30 bg-white/5 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base backdrop-blur hover:bg-white/10 transition">Learn More</a>
          </div>
        </motion.div>
        {/* subtle animated gradient strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="mt-10 md:mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl w-full px-6 md:px-10 py-10 md:py-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-2xl md:text-4xl font-semibold mb-6 md:mb-10">Features</motion.h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Brain, title: 'Personalized Learning Path', desc: 'Daily roadmap, mastery checks, and intelligent review.' },
            { icon: Sparkles, title: 'Adaptive AI Difficulty', desc: 'Real IRT calibration that adjusts to your ability.' },
            { icon: Headphones, title: 'Voice & Visual Tutor', desc: 'Low-latency voice + whiteboard diagrams on demand.' },
            { icon: Globe2, title: 'Multilingual Support', desc: 'Learn in English, Sinhala, Tamil, Hindi, Mandarin.' },
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1*i, duration: 0.5 }}
              className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] p-5 md:p-6 hover:shadow-[0_0_40px_rgba(110,231,183,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] transition">
              <f.icon className="h-6 w-6 md:h-7 md:w-7 text-white/90" />
              <div className="mt-3 md:mt-4 text-lg md:text-xl font-medium">{f.title}</div>
              <p className="mt-2 text-sm opacity-90 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-5xl w-full px-6 md:px-10 py-10 md:py-16">
        <motion.h3 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-2xl md:text-4xl font-semibold">Why NeuroLearn?</motion.h3>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.5 }} className="mt-4 md:mt-6 text-sm md:text-lg opacity-90">
          We’re reimagining education through cognitive intelligence — where AI adapts, remembers, and evolves with every learner.
          NeuroLearn blends neuroscience, AI, and human empathy to make learning smarter, faster, and more personal.
        </motion.p>
      </section>

      {/* CTA */}
      <footer className="mx-auto max-w-6xl w-full px-6 md:px-10 py-12 md:py-16">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur p-6 md:p-10 text-center">
          <div className="text-xl md:text-3xl font-semibold">Start your journey with NeuroLearn today.</div>
          <div className="mt-5"><Link href="/signup" className="inline-block rounded-2xl bg-gradient-to-r from-[#5B6BFF] to-[#6EE7B7] px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-medium shadow-[0_0_25px_rgba(91,107,255,0.45)] hover:shadow-[0_0_35px_rgba(91,107,255,0.65)] transition">Sign Up</Link></div>
          <div className="mt-6 text-xs opacity-70">© {new Date().getFullYear()} NeuroLearn. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
