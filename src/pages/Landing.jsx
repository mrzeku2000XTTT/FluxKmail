import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Menu, X, Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram
} from 'lucide-react';
import FluxkmailLogo from '@/components/FluxkmailLogo';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';

const ONBOARDING_KEY = 'fluxkmail_onboarding_complete';

const NAV_LINKS = ['Inbox', 'Compose', 'Contacts', 'Kaspa', 'TTT ID', 'Security', 'White Paper'];

const FOOTER_COLUMNS = [
  {
    title: 'MAIL',
    links: ['Inbox', 'Compose', 'Drafts', 'Starred', 'Sent']
  },
  {
    title: 'KASPA',
    links: ['Wallet', 'Send KAS', 'Transactions', 'Network']
  },
  {
    title: 'SECURITY',
    links: ['Encryption', 'Spam Protection', 'Privacy', 'Non-custodial']
  },
  {
    title: 'ABOUT',
    links: ['Our Story', 'TTT Network', 'Kaspa', 'Blog', 'Alliance']
  }
];

const SOCIAL_ICONS = [Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram];

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const walletAddress = localStorage.getItem('kmail_wallet');

  const { data: isAdmin = false } = useQuery({
    queryKey: ['isAdmin', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return false;
      const admins = await base44.entities.Admin.filter({ wallet_address: walletAddress });
      return admins.length > 0;
    },
    enabled: !!walletAddress
  });

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
            <FluxkmailLogo size={32} />
            <span className="text-white text-xl font-bold tracking-wider">Fluxkmail 402</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isWhitepaper = link === 'White Paper';
              return isWhitepaper ? (
                <motion.div key={link} whileHover={{ y: -2 }}>
                  <Link
                    to="/Whitepaper"
                    className="text-white/80 hover:text-[#00b7ff] text-sm tracking-wide transition-colors duration-200 inline-block"
                  >
                    {link}
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={link}
                  href="#"
                  whileHover={{ y: -2 }}
                  className="text-white/80 hover:text-[#00b7ff] text-sm tracking-wide transition-colors duration-200 inline-block"
                >
                  {link}
                </motion.a>
              );
            })}
          </div>



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
                  {NAV_LINKS.map((link, i) => {
                    const isWhitepaper = link === 'White Paper';
                    return isWhitepaper ? (
                      <Link
                        key={link}
                        to="/Whitepaper"
                        onClick={closeMenu}
                        className="text-lg sm:text-xl font-light tracking-[0.08em] text-[#00b7ff] hover:text-white transition-all duration-400"
                        style={{
                          opacity: menuVisible ? 1 : 0,
                          transform: menuVisible ? 'translateY(0)' : 'translateY(12px)',
                          transitionDelay: `${menuVisible ? 350 + i * 50 : 0}ms`,
                          transitionTimingFunction: 'ease-out',
                        }}
                      >
                        {link}
                      </Link>
                    ) : (
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
                    );
                  })}

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
              Mail for the Kaspa era.
            </h1>
            <h1 className="text-white/80 text-lg xs:text-2xl sm:text-3xl md:text-5xl font-light leading-snug tracking-tight mb-8 sm:mb-12">
              Your wallet is your address. Your inbox is yours.
            </h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="relative mb-8 sm:mb-12 w-full flex justify-center overflow-visible cursor-default"
            >
              <motion.span
                animate={{ textShadow: ['0 0 80px rgba(255,255,255,0.3), 0 0 160px rgba(255,255,255,0.1)', '0 0 120px rgba(0,183,255,0.4), 0 0 220px rgba(0,183,255,0.15)', '0 0 80px rgba(255,255,255,0.3), 0 0 160px rgba(255,255,255,0.1)'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="four-oh-four text-[80px] xs:text-[100px] sm:text-[140px] md:text-[200px] lg:text-[260px] font-black text-white leading-none tracking-tighter select-none"
              >
                KX402
              </motion.span>
            </motion.div>

            {isAdmin ? (
              <motion.button
                onClick={() => {
                  const completed = localStorage.getItem(ONBOARDING_KEY);
                  if (!completed) {
                    setShowOnboarding(true);
                  } else {
                    setShowConnect(true);
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#00b7ff] text-black text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase hover:bg-[#33c6ff] transition-colors shadow-[0_0_30px_rgba(0,183,255,0.4)]"
              >
                Launch Studio
              </motion.button>
            ) : (
              <div className="text-white/40 text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase border border-white/10 bg-white/5">
                Coming Soon
              </div>
            )}
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
                JOIN THE NETWORK
              </h4>
              <div className="flex max-w-sm">
                <input
                  type="email"
                  placeholder="Type your TTT ID to sign up"
                  className="flex-1 bg-white text-black text-xs sm:text-sm px-3 py-2 rounded-l-md outline-none min-w-0"
                />
                <button className="bg-[#00b7ff] text-black text-xs font-bold tracking-wider px-4 py-2 rounded-r-md hover:bg-[#33c6ff] transition-colors">
                  SEND IT
                </button>
              </div>

              <h4 className="text-white text-[10px] sm:text-xs font-bold tracking-[0.15em] mt-5 sm:mt-6 mb-3">
                CONNECT
              </h4>
              <div className="flex items-center gap-3">
                {SOCIAL_ICONS.map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.3, y: -2 }}
                    className="text-white/50 hover:text-[#00b7ff] transition-colors duration-200 inline-block"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
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