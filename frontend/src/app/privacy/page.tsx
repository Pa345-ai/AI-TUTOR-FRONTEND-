"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
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
          NeuroLearn Privacy Policy
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
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">NeuroLearn Privacy Policy</h2>
              <p className="mt-3 text-white/80">At NeuroLearn, we are committed to protecting your privacy and providing a safe, transparent, and secure learning environment. This Privacy Policy explains how we collect, use, store, and share your information when you access or use our services (“Services”).</p>
            </div>

            <hr className="border-white/10" />

            <Section>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">1. Information We Collect</h3>
              <h4 className="mt-1 font-medium text-white/90">a) Personal Information</h4>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Full Name, Email Address, Password, and other account details you provide during signup.</li>
                <li>Payment information for subscriptions or purchases (processed securely via our payment providers).</li>
              </ul>
              <h4 className="mt-3 font-medium text-white/90">b) Usage Data</h4>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Interactions with the platform, including courses completed, quizzes taken, progress tracking, and activity logs.</li>
                <li>Device and browser information, IP address, and geolocation data for analytics and security.</li>
              </ul>
              <h4 className="mt-3 font-medium text-white/90">c) AI Interaction Data</h4>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Data generated from your interactions with our AI tutors, including questions asked, answers received, and usage patterns.</li>
                <li>This data is used to improve the AI, personalize your learning experience, and enhance platform functionality.</li>
              </ul>
            </Section>

            <Section delay={0.05}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">2. How We Use Your Information</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Provide, maintain, and improve NeuroLearn services.</li>
                <li>Personalize learning pathways and adapt AI tutoring to your progress.</li>
                <li>Process payments and manage subscriptions.</li>
                <li>Communicate with you regarding updates, support, and promotional offers (where permitted).</li>
                <li>Analyze trends, monitor performance, and optimize platform functionality.</li>
                <li>Ensure platform security and detect/prevent fraud or abuse.</li>
              </ul>
            </Section>

            <Section delay={0.1}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">3. Data Sharing and Disclosure</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li><span className="font-semibold">Third-Party Services:</span> We may share data with trusted third-party providers who assist with payments, analytics, hosting, and AI improvements.</li>
                <li><span className="font-semibold">Legal Compliance:</span> We may disclose information when required by law, regulation, or legal process.</li>
                <li><span className="font-semibold">Business Transfers:</span> In case of merger, acquisition, or sale of assets, user data may be transferred under confidentiality and compliance obligations.</li>
              </ul>
              <p className="text-white/80 mt-2">We <span className="font-semibold">do not sell or rent your personal information</span> to third parties for marketing purposes.</p>
            </Section>

            <Section delay={0.15}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">4. Data Storage and Security</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Your data is stored securely with industry-standard encryption both in transit and at rest.</li>
                <li>We implement advanced security measures to protect against unauthorized access, data breaches, and misuse.</li>
                <li>Despite our efforts, no system can guarantee 100% security; you acknowledge and accept the inherent risks.</li>
              </ul>
            </Section>

            <Section delay={0.2}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">5. Data Retention</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>We retain personal data only as long as necessary to provide services, comply with legal obligations, or for legitimate business purposes.</li>
                <li>You may request deletion of your data, subject to regulatory or contractual obligations.</li>
              </ul>
            </Section>

            <Section delay={0.25}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">6. Cookies and Tracking</h3>
              <p className="text-white/80">NeuroLearn uses cookies and similar technologies to enhance user experience, track usage patterns, and support AI personalization. You may adjust browser settings to limit cookies, but some functionality may be affected.</p>
            </Section>

            <Section delay={0.3}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">7. User Rights</h3>
              <p className="text-white/80">Depending on your jurisdiction, you may have rights to:</p>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>Access, correct, or delete your personal data.</li>
                <li>Withdraw consent for data collection where applicable.</li>
                <li>Restrict or object to processing.</li>
                <li>Receive a copy of your data in a portable format.</li>
              </ul>
              <p className="text-white/80">To exercise your rights, contact us at <span className="underline decoration-white/40">team.neurolearn@gmail.com</span>.</p>
            </Section>

            <Section delay={0.35}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">8. Children’s Privacy</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>NeuroLearn is <span className="font-semibold">not intended for children under 8 years</span>.</li>
                <li>We do not knowingly collect personal information from children under 8.</li>
                <li>Parents or guardians who become aware that their child has provided us personal data should contact us immediately to request deletion.</li>
              </ul>
            </Section>

            <Section delay={0.4}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">9. International Users</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>NeuroLearn operates globally. By using our Services, you consent to the collection, transfer, and processing of your data in countries that may have different data protection laws.</li>
                <li>We implement safeguards to ensure your information is treated securely and in accordance with applicable privacy regulations.</li>
              </ul>
            </Section>

            <Section delay={0.45}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">10. No Liability for AI Decisions or Recommendations</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-1">
                <li>NeuroLearn AI tutors provide personalized guidance, suggestions, and learning content.</li>
                <li>While our AI is designed to provide accurate and helpful guidance, <span className="font-semibold">NeuroLearn is not responsible for decisions, mistakes, or outcomes based on AI recommendations</span>.</li>
                <li>Users acknowledge that learning progress and results may vary, and any decisions made are at their discretion.</li>
              </ul>
            </Section>

            <Section delay={0.5}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">11. Changes to This Privacy Policy</h3>
              <p className="text-white/80">NeuroLearn may update this Privacy Policy periodically to reflect platform updates, legal requirements, or business practices. We will notify users of material changes, and continued use of the Services constitutes acceptance of the updated policy.</p>
            </Section>

            <Section delay={0.55}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">12. Contact</h3>
              <p className="text-white/80">If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at:<br />
                <span className="underline decoration-white/40">team.neurolearn@gmail.com</span> • Address: [Insert Company Address]
              </p>
            </Section>

            <Section delay={0.6}>
              <h3 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">Acknowledgment</h3>
              <p className="text-white/80">By using NeuroLearn, you acknowledge that you have read, understood, and agree to this Privacy Policy. You accept the collection, use, and storage of your data as described herein. Jurisdiction: Sri Lanka.</p>
            </Section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
