"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, ShieldCheck, PieChart, CreditCard, Twitter, Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-4 md:py-6 flex justify-between items-center glass-panel shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/30">
            SW
          </div>
          <span className="font-bold tracking-tight text-lg text-slate-800">SMARTWEAR<span className="text-primary">POS</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide text-slate-500">
          <Link href="#" className="hover:text-primary transition-colors">FEATURES</Link>
          <Link href="#" className="hover:text-primary transition-colors">PRICING</Link>
          <Link href="#" className="hover:text-primary transition-colors">CONTACT</Link>
        </div>
        <button className="px-5 py-2 md:px-6 md:py-2.5 bg-slate-900 text-white text-xs md:text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center pt-20 md:pt-0">

        {/* Left Content */}
        <div className="w-full md:w-1/2 h-auto md:h-full flex flex-col justify-center px-4 md:px-20 z-10 py-12 md:py-0 mt-8 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold tracking-widest uppercase text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Next Gen Retail
            </div>

            <h1 className="text-4xl md:text-7xl font-black leading-[1.1] tracking-tight text-slate-900">
              Retail Management <br />
              <span className="text-gradient">reimagined.</span>
            </h1>

            <p className="text-base md:text-lg text-slate-500 max-w-lg leading-relaxed font-normal">
              Empower your clothing store with a POS designed for real people.
              Beautiful, fast, and intuitive tools for Admins and Cashiers.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="h-12 md:h-14 px-6 md:px-8 bg-primary text-white font-bold rounded-full flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 text-sm md:text-base">
                Explore System <ArrowRight size={20} />
              </button>
              <button className="h-12 md:h-14 px-6 md:px-8 bg-white border border-slate-200 text-slate-700 font-bold rounded-full flex items-center gap-2 hover:bg-slate-50 transition-all hover:-translate-y-1 text-sm md:text-base">
                Watch Demo
              </button>
            </div>

            <div className="pt-4 md:pt-8 flex items-center gap-4 text-sm text-slate-400 font-medium">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100?img=1')] bg-cover"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100?img=5')] bg-cover"></div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 bg-[url('https://i.pravatar.cc/100?img=8')] bg-cover"></div>
              </div>
              <p>Trusted by 500+ Store Owners</p>
            </div>
          </motion.div>
        </div>

        {/* Right Visual */}
        <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen bg-slate-100 overflow-hidden mt-8 md:mt-0">
          <Image
            src="/hero-real.png"
            alt="Modern Clothing Store"
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay for text readability logic if needed, but keeping it clean for 'real' look */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent md:bg-gradient-to-l md:from-white/0 md:via-white/0 md:to-white"></div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="relative py-16 md:py-24 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-slate-900">Choose Your Workspace</h2>
            <p className="text-slate-500 text-lg">Select your role to access the tailored dashboard designed for your specific needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 px-0 md:px-0">

            {/* Admin Card */}
            <motion.div
              whileHover={{ y: -8 }}
              className="group relative h-[480px] bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer flex flex-col"
            >
              <div className="h-1/2 relative bg-blue-50 overflow-hidden">
                <Image
                  src="/admin-real.png"
                  alt="Admin Dashboard"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors"></div>
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-sm uppercase tracking-wider text-blue-600">
                  Analytics & Stock
                </div>
              </div>

              <div className="h-1/2 p-8 md:p-10 flex flex-col justify-between bg-white relative">
                <div>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <PieChart size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Track sales in real-time, manage inventory, and view comprehensive staff reports.
                  </p>
                </div>
                <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all">
                  Login as Admin <ArrowRight size={18} className="ml-2" />
                </div>
              </div>
            </motion.div>

            {/* Cashier Card */}
            <Link href="/pos">
              <motion.div
                whileHover={{ y: -8 }}
                className="group relative h-[480px] bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer flex flex-col"
              >
                <div className="h-1/2 relative bg-purple-50 overflow-hidden flex items-center justify-center">
                  {/* Fallback to code visual since image gen limit hit, using a nice gradient abstract representation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
                  <div className="relative z-10 bg-white/20 backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                    <CreditCard size={64} className="text-white drop-shadow-md" />
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-yellow-400 rounded-full blur-xl opacity-70"></div>
                  </div>

                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold shadow-sm uppercase tracking-wider text-purple-600">
                    POS Terminal
                  </div>
                </div>

                <div className="h-1/2 p-8 md:p-10 flex flex-col justify-between bg-white relative">
                  <div>
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                      <ShoppingBag size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Cashier Terminal</h3>
                    <p className="text-slate-500 leading-relaxed">
                      Process billing effortlessly, handle returns, and ensure smooth customer checkout.
                    </p>
                  </div>
                  <div className="flex items-center text-purple-600 font-bold group-hover:gap-2 transition-all">
                    Launch POS <ArrowRight size={18} className="ml-2" />
                  </div>
                </div>
              </motion.div>
            </Link>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">SW</div>
                <span className="font-bold tracking-tight text-xl text-white">SMARTWEAR<span className="text-primary">POS</span></span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                The next generation of retail management. Designed for speed, beauty, and reliability.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Hardware</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div>
              <h4 className="font-bold text-white mb-6">Stay Updated</h4>
              <p className="text-slate-500 text-sm mb-4">Subscribe to our newsletter for the latest updates.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-900 border border-slate-800 text-white px-4 py-2.5 rounded-xl w-full text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button className="bg-primary text-white p-2.5 rounded-xl hover:bg-blue-600 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-slate-500">
              © 2026 SmartWear POS Systems. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
