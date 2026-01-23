import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Zap, 
  Users, 
  Globe, 
  Shield, 
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Rocket,
  Target,
  Award,
  Lightbulb
} from 'lucide-react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const coreFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized education with advanced AI tutoring",
      color: "text-blue-500"
    },
    {
      icon: Zap,
      title: "Real-Time Adaptation",
      description: "Dynamic content that adapts to your learning style",
      color: "text-yellow-500"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Study with others in real-time virtual rooms",
      color: "text-green-500"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Learn in any language with AI translation",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data is protected with enterprise security",
      color: "text-red-500"
    },
    {
      icon: Star,
      title: "Gamified Experience",
      description: "Earn tokens and achievements as you learn",
      color: "text-orange-500"
    }
  ]

  const billionDollarFeatures = [
    {
      title: "Meta-Learning Core",
      description: "AI that learns to teach itself",
      icon: Lightbulb,
      color: "bg-gradient-to-r from-blue-500 to-purple-600"
    },
    {
      title: "NeuroVerse Metaverse",
      description: "3D AI learning worlds",
      icon: Globe,
      color: "bg-gradient-to-r from-green-500 to-blue-600"
    },
    {
      title: "Cognitive Digital Twin",
      description: "Personal AI learning companions",
      icon: Brain,
      color: "bg-gradient-to-r from-purple-500 to-pink-600"
    },
    {
      title: "AI Ecosystem Infrastructure",
      description: "Complete AI development platform",
      icon: Rocket,
      color: "bg-gradient-to-r from-orange-500 to-red-600"
    },
    {
      title: "Cross-Domain OmniMind",
      description: "Universal AI applications",
      icon: Target,
      color: "bg-gradient-to-r from-teal-500 to-green-600"
    },
    {
      title: "AI Tokenized Economy",
      description: "Learn-to-earn token system",
      icon: Award,
      color: "bg-gradient-to-r from-yellow-500 to-orange-600"
    },
    {
      title: "Ethical Intelligence",
      description: "Transparent and fair AI",
      icon: Shield,
      color: "bg-gradient-to-r from-indigo-500 to-purple-600"
    }
  ]

  return (
    <>
      <Head>
        <title>OmniMind AI Tutor - Complete AI Learning Platform</title>
        <meta name="description" content="The most advanced AI tutoring platform with 30+ features and 7 billion-dollar AI capabilities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                OmniMind
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Tutor
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The world's most advanced AI tutoring platform with 30+ features and 7 billion-dollar AI capabilities
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    Start Learning
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-white/10 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Features Section */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Core Learning Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                30+ powerful features designed to revolutionize how you learn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Billion Dollar Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                7 Billion-Dollar AI Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Revolutionary AI capabilities that will transform education
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {billionDollarFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className={`absolute inset-0 ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative p-8">
                    <feature.icon className="w-16 h-16 text-white mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-lg">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center text-blue-400 font-semibold">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of learners already using OmniMind AI Tutor
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300"
                  >
                    View Dashboard
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">OmniMind AI Tutor</h3>
              <p className="text-gray-400 mb-6">
                The future of AI-powered education is here
              </p>
              <div className="flex justify-center space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}