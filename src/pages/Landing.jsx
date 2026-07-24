import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_KEY = 'fluxkmail_onboarding_complete';

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const navigate = useNavigate();

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
    const hasWallet = localStorage.getItem('kmail_wallet');
    const hasTTT = localStorage.getItem('kmail_ttt_id');
    if (!completed && !hasWallet && !hasTTT) {
      const t = setTimeout(() => setShowOnboarding(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

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
        <SiteHeader />

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

            {!walletAddress ? (
              <motion.button
                onClick={() => setShowConnect(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#00b7ff] text-black text-[10px] xs:text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-full uppercase hover:bg-[#33c6ff] transition-colors shadow-[0_0_30px_rgba(0,183,255,0.4)]"
              >
                Launch Studio
              </motion.button>
            ) : isAdmin ? (
              <motion.button
                onClick={() => navigate('/Mail')}
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

        <SiteFooter />
      </div>

      <ConnectWalletModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
    </div>
  );
}