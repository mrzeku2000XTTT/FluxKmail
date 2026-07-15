import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Menu, X, Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram
} from 'lucide-react';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';

const ONBOARDING_KEY = 'fluxkmail_onboarding_complete';

const NAV_LINKS = ['Domain', 'Servers', 'Cloud', 'Managed', 'Email', 'Privacy'];

const FOOTER_COLUMNS = [
  {
    title: 'SERVERS',
    links: ['Web Servers', 'VPS Servers', 'Cloud Servers', 'Managed Instances', 'Bare Metal']
  },
  {
    title: 'DOMAINS',
    links: ['Find Domain', 'Move Domains', 'DNS Manager', 'Domain Costs']
  },
  {
    title: 'HELP US',
    links: ['Open a Ticket', 'FAQs', 'Docs', 'Tutorials', 'Forum']
  },
  {
    title: 'ABOUT',
    links: ['Our Story', 'Leadership Team', 'Press Room', 'We Hire', 'Alliance', 'Blog']
  }
];

const SOCIAL_ICONS = [Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram];

function NexovaLogo() {
  return (
    <svg viewBox="0 0 480 480" className="w-8 h-8" fill="white">
      <path d="M480 240a240 240 0 0 0-240 240 240 240 0 0 0 240-240Z" />
      <path d="M240 0A240 240 0 0 0 0 240 240 240 0 0 0 240 0Z" />
      <path d="M480 240A240 240 0 0 0 240 0a240 240 0 0 0 240 240Z" />
      <path d="M240 480A240 240 0 0 0 0 240a240 240 0 0 0 240 240Z" />
    </svg>
  );
}

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      const t = setTimeout(() => setShowOnboarding(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      const t = setTimeout(() => setMenuVisible(true), 10);
      return () => clearTimeout(t);
    }
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMenuVisible(false);
    setTimeout(() => setMobileMenuOpen(false), 500);
  };

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  const linkCount = NAV_LINKS.length;

  return (
    <div
      className="relative min-h-screen flex flex-col bg-black"
      style={{ fontFamily: '"Helvetica Now Var", Helvetica, Arial, sans-serif' }}
    >
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4" type="video/mp4" />
      </video>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <NexovaLogo />
            <span className="text-white text-xl font-bold tracking-wider">FluxkMailx402</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/80 hover:text-white text-sm tracking-wide transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop login button */}
          <button
            onClick={() => setShowConnect(true)}
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
          >
            LOG IN <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => (mobileMenuOpen ? closeMenu() : setMobileMenuOpen(true))}
            className="lg:hidden relative z-[60] w-8 h-8 flex items-center justify-center"
          >
            <Menu className={`absolute w-6 h-6 text-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
            <X className={`absolute w-6 h-6 text-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              onClick={closeMenu}
              className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-400 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}
            />

            {/* Menu panel */}
            <div className={`absolute left-0 right-0 top-[68px] z-50 transition-all duration-500 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="backdrop-blur-xl rounded-b-2xl">
                <div className="relative z-10 px-6 py-8 flex flex-col items-center gap-5">
                  {NAV_LINKS.map((link, i) => (
                    <a
                      key={link}
                      href="#"
                      onClick={closeMenu}
                      className="text-lg sm:text-xl font-light tracking-[0.08em] text-white/80 hover:text-white transition-all duration-400"
                      style={{
                        opacity: menuVisible ? 1 : 0,
                        transform: menuVisible ? 'translateY(0)' : 'translateY(12px)',
                        transitionDelay: `${menuVisible ? 350 + i * 50 : 0}ms`,
                        transitionTimingFunction: 'ease-out',
                      }}
                    >
                      {link}
                    </a>
                  ))}
                  <button
                    onClick={() => { closeMenu(); setShowConnect(true); }}
                    className="mt-2 bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-sm font-semibold px-8 py-2.5 rounded-full"
                    style={{
                      opacity: menuVisible ? 1 : 0,
                      transform: menuVisible ? 'translateY(0)' : 'translateY(12px)',
                      transitionDelay: `${menuVisible ? 350 + linkCount * 50 : 0}ms`,
                      transitionTimingFunction: 'ease-out',
                      transitionDuration: '400ms',
                    }}
                  >
                    LOG IN
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hero / 404 section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 md:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-1 sm:mb-2">
              This page seems to have
            </h1>
            <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-8 sm:mb-12">
              slipped beyond our reach :/
            </h1>

            <div className="relative mb-8 sm:mb-12 w-full flex justify-center overflow-visible">
              <span className="four-oh-four text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px] lg:text-[260px] font-black text-white leading-none tracking-tighter select-none">
                404
              </span>
            </div>

            <button
              onClick={() => setShowConnect(true)}
              className="liquid-glass text-white text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase hover:opacity-90 transition-opacity"
            >
              Return to Main Page
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-10 pt-10 sm:pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/50 hover:text-white/80 text-[10px] sm:text-xs transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter + Social */}
            <div className="col-span-2 lg:col-span-2">
              <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mb-3 sm:mb-4">
                JOIN FOR EXCLUSIVE DEALS
              </h4>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Type your email to sign up"
                  className="flex-1 bg-white text-black text-xs sm:text-sm px-3 py-2 rounded-l-md outline-none min-w-0"
                />
                <button className="bg-gradient-to-r from-emerald-400 to-cyan-500 text-white text-xs font-bold tracking-wider px-4 py-2 rounded-r-md hover:opacity-90 transition-opacity">
                  SEND IT
                </button>
              </div>

              <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mt-5 sm:mt-6 mb-3">
                CONNECT
              </h4>
              <div className="flex items-center gap-3">
                {SOCIAL_ICONS.map((Icon, i) => (
                  <a key={i} href="#" className="text-white/50 hover:text-white transition-colors duration-200">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      <ConnectWalletModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
    </div>
  );
}