import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram } from 'lucide-react';

const FOOTER_COLUMNS = [
  { title: 'MAIL', links: ['Inbox', 'Compose', 'Drafts', 'Starred', 'Sent'] },
  { title: 'KASPA', links: ['Wallet', 'Send KAS', 'Transactions', 'Network'] },
  { title: 'SECURITY', links: ['Encryption', 'Spam Protection', 'Privacy', 'Non-custodial'] },
  { title: 'ABOUT', links: ['Our Story', 'TTT Network', 'Kaspa', 'Blog', 'Alliance'] },
];

const SOCIAL_ICONS = [Facebook, Twitter, Dribbble, Youtube, Linkedin, Instagram];

export default function SiteFooter() {
  return (
    <footer
      className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-16 pb-8 sm:pb-10 pt-12 sm:pt-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(5,5,8,0.6) 0%, rgba(5,5,8,0.85) 60%, rgba(5,5,8,0.95) 100%), url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80)',
      }}
    >
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

      <div className="mt-10 pt-6 border-t border-white/5 text-center">
        <p className="text-white/30 text-[10px] sm:text-xs tracking-wide">
          © 2026 Fluxkmail 402 — Mail for the Kaspa era.
        </p>
      </div>
    </footer>
  );
}