import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import FluxkmailLogo from '@/components/FluxkmailLogo';

const NAV_LINKS = ['Inbox', 'Compose', 'Contacts', 'Kaspa', 'TTT ID', 'Security', 'White Paper'];

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

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

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 md:px-12 lg:px-16 py-5">
      <Link to="/Landing" className="flex items-center gap-2">
        <FluxkmailLogo size={32} />
        <span className="text-white text-xl font-bold tracking-wider">Fluxkmail 402</span>
      </Link>

      <div className="hidden lg:flex items-center gap-8">
        {NAV_LINKS.map((link) => {
          const isWhitepaper = link === 'White Paper';
          return (
            <motion.div key={link} whileHover={{ y: -2 }}>
              <Link
                to={isWhitepaper ? '/Whitepaper' : '/Landing'}
                className="text-white/80 hover:text-[#00b7ff] text-sm tracking-wide transition-colors duration-200 inline-block"
              >
                {link}
              </Link>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => (mobileMenuOpen ? closeMenu() : setMobileMenuOpen(true))}
        className="lg:hidden relative z-[60] w-8 h-8 flex items-center justify-center"
      >
        <Menu className={`absolute w-6 h-6 text-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
        <X className={`absolute w-6 h-6 text-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
      </button>

      {mobileMenuOpen && (
        <>
          <div
            onClick={closeMenu}
            className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-md transition-opacity duration-400 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}
          />
          <div className={`absolute left-0 right-0 top-[68px] z-50 transition-all duration-500 ${menuVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="backdrop-blur-xl rounded-b-2xl">
              <div className="relative z-10 px-6 py-8 flex flex-col items-center gap-5">
                {NAV_LINKS.map((link, i) => {
                  const isWhitepaper = link === 'White Paper';
                  return (
                    <Link
                      key={link}
                      to={isWhitepaper ? '/Whitepaper' : '/Landing'}
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
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}