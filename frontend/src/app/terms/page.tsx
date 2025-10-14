"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="space-y-3"
    >
      {children}
    </motion.section>
  );

  return (
    <div className="min-h-svh relative px-6 md:px-10 py-6 md:py-10 overflow-x-hidden" style={{ backgroundColor: "#0A0F1C" }}>
      {/* Ambient background depth */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20 bg-[#2563EB]" />
        <div className="absolute bottom-[-4rem] right-[-4rem] h-96 w-96 rounded-full blur-3xl opacity-20 bg-[#22D3EE]" />
        <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>

      {/* Sticky Title */}
      <div className="sticky top-0 z-20 -mx-6 md:-mx-10 px-6 md:px-10 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/5 border-b border-white/10">
        <h1 className="text-base md:text-lg font-semibold text-white/90 tracking-[-0.01em]">
          NeuroLearn Terms of Service
        </h1>
      </div>

      {/* Content card */}
      <div className="mx-auto max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mt-6 md:mt-10 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 md:p-8 shadow-[0_10px_60px_rgba(0,0,0,0.35),_0_0_40px_rgba(37,99,235,0.20)]"
        >
          {/* holographic edge highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/15 via-transparent to-cyan-400/15 blur-xl" />

          <div className="space-y-6 md:space-y-7 text-white/90">
            <div className="text-sm md:text-base">
              <div className="text-xs md:text-sm text-white/60">Effective Date: 14/10/2025</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">NeuroLearn Terms of Service</h2>
              <p className="mt-3 text-white/80">Welcome to NeuroLearn. By creating an account, accessing, or using our services, you agree to be bound by these Terms of Service (the “Terms”). Please read them carefully before using NeuroLearn.</p>
            </div>

            <hr className="border-white/10" />

            <Section>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">1. Acceptance of Terms</h3>
              <p className="text-white/80">By accessing or using the NeuroLearn platform, website, applications, or services (“Services”), you confirm that you have read, understood, and agree to these Terms. If you do not agree, you may not access or use the Services.</p>
            </Section>

            <Section delay={0.05}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">2. Eligibility</h3>
              <p className="text-white/80">You must be at least 8 years old to use the Services. By creating an account, you represent and warrant that you meet the minimum age requirement and have the legal capacity to enter into these Terms.</p>
            </Section>

            <Section delay={0.1}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">3. User Accounts</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
                <li>You agree to notify NeuroLearn immediately of any unauthorized use of your account.</li>
                <li>NeuroLearn reserves the right to suspend or terminate accounts that violate these Terms or are engaged in fraudulent activity.</li>
              </ul>
            </Section>

            <Section delay={0.15}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">4. Payment and Subscriptions</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Certain Services may require payment. All payments are processed securely through our payment provider.</li>
                <li>Payments are <span className="font-semibold">non-refundable</span> unless otherwise stated.</li>
                <li>By subscribing or making a purchase, you authorize NeuroLearn to charge the applicable fees to your payment method.</li>
              </ul>
            </Section>

            <Section delay={0.2}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">5. No Warranty / Limitation of Liability</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>NeuroLearn is provided on an <span className="italic">“as-is” and “as-available”</span> basis.</li>
                <li>NeuroLearn does not guarantee uninterrupted, error-free, or secure access to the platform.</li>
                <li>You acknowledge that using the Services may involve risks, including but not limited to data loss, software crashes, device issues, or learning interruptions.</li>
                <li><span className="font-semibold">NeuroLearn shall not be responsible for any direct, indirect, incidental, consequential, or special damages</span>, including losses of data, profits, or personal injury, arising from or related to your use of the Services.</li>
                <li>You agree that any money paid to NeuroLearn, including subscriptions or one-time fees, <span className="font-semibold">will not be refunded</span> due to dissatisfaction, technical issues, or losses incurred during use.</li>
              </ul>
            </Section>

            <Section delay={0.25}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">6. Intellectual Property</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>All content, logos, designs, text, images, code, and materials provided by NeuroLearn are the <span className="font-semibold">exclusive property of NeuroLearn</span> or its licensors.</li>
                <li>Users may not copy, reproduce, modify, distribute, or create derivative works without explicit permission.</li>
              </ul>
            </Section>

            <Section delay={0.3}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">7. User Conduct</h3>
              <p className="text-white/80">You agree not to:</p>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Violate any applicable laws or regulations.</li>
                <li>Attempt to disrupt, hack, or gain unauthorized access to the Services.</li>
                <li>Share or distribute content that is unlawful, harmful, offensive, or infringes on third-party rights.</li>
              </ul>
            </Section>

            <Section delay={0.35}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">8. Termination</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>NeuroLearn may suspend or terminate accounts or access at any time for violations of these Terms, or for other reasons at its discretion.</li>
                <li>Upon termination, your access to all Services will cease immediately.</li>
              </ul>
            </Section>

            <Section delay={0.4}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">9. Modifications to Terms</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>NeuroLearn reserves the right to modify or update these Terms at any time.</li>
                <li>Users will be notified of material changes, and continued use of the Services constitutes acceptance of the updated Terms.</li>
              </ul>
            </Section>

            <Section delay={0.45}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">10. Governing Law</h3>
              <p className="text-white/80">These Terms are governed by and construed in accordance with the laws of <span className="font-semibold">Sri Lanka</span>. Any disputes arising under or related to these Terms shall be resolved in the courts of Sri Lanka.</p>
            </Section>

            <Section delay={0.5}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">11. Acknowledgment</h3>
              <ol className="list-decimal pl-6 text-white/80 space-y-1">
                <li>You understand and accept all risks associated with using the platform.</li>
                <li>NeuroLearn is <span className="font-semibold">not liable for any crashes, losses, or damages</span> you may incur.</li>
                <li>Payments made to NeuroLearn are <span className="font-semibold">non-refundable</span> under any circumstances unless explicitly stated otherwise.</li>
                <li>You have read, understood, and voluntarily accepted these Terms of Service.</li>
              </ol>
            </Section>

            <Section delay={0.55}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Contact</h3>
              <p className="text-white/80">For questions or support, please contact us at: <span className="underline decoration-white/40">team.neurolearn@gmail.com</span></p>
            </Section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
