import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Mail, Lock, Wallet, Zap, Shield, Send, Search, Inbox,
  ArrowRight, Check, X, Globe, Coins, ArrowLeft, ExternalLink
} from 'lucide-react';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';
import Logo from '@/components/Logo';

const STORAGE_KEY = 'fluxkmail_onboarding_complete';

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [showConnect, setShowConnect] = useState(false);
  const totalSteps = 5;

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onComplete();
  };

  const next = () => step < totalSteps - 1 ? setStep(step + 1) : handleFinish();
  const back = () => step > 0 && setStep(step - 1);

  const slides = [
    <SlideWelcome key="0" />,
    <SlideLikeGmail key="1" />,
    <SlideUnlikeGmail key="2" />,
    <SlideKaspa key="3" />,
    <SlideTTT key="4" onGetId={() => setShowConnect(true)} />
  ];

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Progress bar */}
        <div className="flex gap-1.5 px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i === step ? 'bg-cyan-400' : i < step ? 'bg-cyan-400/40' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={handleFinish}
          className="absolute top-[max(1rem,env(safe-area-inset-top))] right-4 text-sm text-gray-500 hover:text-gray-300 z-10"
        >
          Skip
        </button>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {slides[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div className="px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 flex items-center justify-between">
          {step > 0 ? (
            <Button variant="ghost" onClick={back} className="text-gray-400">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          ) : <div />}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              onClick={next}
              className="bg-[#00b7ff] hover:bg-[#33c6ff] text-black font-semibold rounded-full px-8 shadow-[0_0_25px_rgba(0,183,255,0.4)]"
            >
              {step === totalSteps - 1 ? 'Get Started' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>

      <ConnectWalletModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
    </>
  );
}

/* --- Browser Tab UI Wrapper (used by all slides) --- */
function BrowserWindow({ tabs, activeTab, children, url }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-full rounded-2xl overflow-hidden border border-white/10 bg-gray-950 shadow-2xl hover:shadow-[0_0_40px_rgba(0,183,255,0.15)] hover:border-[#00b7ff]/30 transition-all duration-300"
    >
      {/* Tab bar */}
      <div className="flex items-end gap-1 px-2 pt-2 bg-gray-900">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[10px] transition-all duration-300 max-w-[100px] ${
              i === activeTab ? 'bg-gray-950 text-white' : 'bg-gray-800/50 text-gray-500'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${i === activeTab ? 'bg-cyan-400' : 'bg-gray-600'}`} />
            <span className="truncate">{tab}</span>
          </div>
        ))}
        <div className="flex-1" />
      </div>
      {/* Address bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-t border-white/5">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 bg-gray-800 rounded-md px-2 py-1 text-[10px] text-gray-400 font-mono truncate">
          {url}
        </div>
      </div>
      {/* Content */}
      <div className="p-4 min-h-[180px]">
        {children}
      </div>
    </motion.div>
  );
}

/* --- Slide 1: Welcome --- */
function SlideWelcome() {
  const features = [
    { icon: Inbox, text: 'Inbox, sent, drafts, starred' },
    { icon: Send, text: 'Compose and reply' },
    { icon: Search, text: 'Search by wallet address' }
  ];
  return (
    <div className="flex flex-col px-6 py-6">
      <BrowserWindow tabs={['Fluxkmail', 'Welcome', 'Start']} activeTab={1} url="fluxkmail.app">
        <div className="flex flex-col items-center justify-center text-center py-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-4"
          >
            <Logo size={64} />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Fluxkmail</h1>
          <p className="text-sm text-gray-400 mb-1">Mail for the Kaspa era.</p>
          <p className="text-xs text-gray-500 max-w-xs mb-5">
            Your wallet is your address. Your inbox is yours.
          </p>
          <div className="w-full space-y-3">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-center gap-3 text-sm text-white"
              >
                <item.icon className="w-5 h-5 text-[#00b7ff] flex-shrink-0" />
                {item.text}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-5 w-full rounded-xl bg-cyan-500/8 border border-cyan-500/20 p-3 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4 text-[#00b7ff]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-white">End-to-end encrypted</div>
              <div className="text-[11px] text-gray-400">No one reads your mail — not even us.</div>
            </div>
          </motion.div>
        </div>
      </BrowserWindow>
    </div>
  );
}

/* --- Slide 2: Like Gmail --- */
function SlideLikeGmail() {
  const [tab, setTab] = useState(0);
  const tabs = ['Inbox', 'Compose', 'Search'];

  useEffect(() => {
    const interval = setInterval(() => setTab(t => (t + 1) % 3), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col px-6 py-6">
      <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Feels familiar</h2>
      <p className="text-sm text-gray-400 mb-5">If you've used Gmail, you already know how to use this.</p>

      <BrowserWindow tabs={tabs} activeTab={tab} url="fluxkmail.app/inbox">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 0 && (
              <div className="space-y-2">
                {[['kaspa:qz...', 'Payment received', '+50 KAS'], ['TTT Network', 'Welcome aboard', ''], ['ZK-HKZ...', 'Re: Collaboration', '']].map((row, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                    <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white truncate font-mono">{row[0]}</div>
                      <div className="text-[10px] text-gray-500 truncate">{row[1]}</div>
                    </div>
                    {row[2] && <span className="text-[10px] text-cyan-400 font-semibold">{row[2]}</span>}
                  </div>
                ))}
              </div>
            )}
            {tab === 1 && (
              <div className="space-y-2">
                <div className="text-[10px] text-gray-500">To</div>
                <div className="bg-gray-800 rounded px-2 py-1.5 text-[11px] text-cyan-400 font-mono">kaspa:qz8x...3fK</div>
                <div className="text-[10px] text-gray-500 mt-2">Subject</div>
                <div className="bg-gray-800 rounded px-2 py-1.5 text-[11px] text-white">Thanks for the payment</div>
                <div className="bg-gray-800 rounded px-2 py-1.5 text-[11px] text-gray-400 h-12 flex items-center">Writing...</div>
              </div>
            )}
            {tab === 2 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[11px] text-gray-400">kaspa:qz...</span>
                </div>
                <div className="text-[10px] text-gray-500">Results</div>
                <div className="bg-gray-800/50 rounded px-2 py-1.5 text-[11px] text-white">Payment received — +50 KAS</div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </BrowserWindow>

      <div className="mt-5 space-y-2">
        {[
          { icon: Inbox, text: 'Inbox, sent, drafts, starred' },
          { icon: Send, text: 'Compose and reply' },
          { icon: Search, text: 'Search by wallet address' }
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 text-sm text-white"
          >
            <item.icon className="w-5 h-5 text-[#00b7ff] flex-shrink-0" />
            {item.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* --- Slide 3: Unlike Gmail --- */
function SlideUnlikeGmail() {
  const differences = [
    { icon: Wallet, title: 'Wallet = address', desc: 'No email or password. Your Kaspa wallet is your identity.' },
    { icon: Lock, title: 'No servers', desc: 'Decentralized. No company reads or stores your mail.' },
    { icon: Coins, title: 'Attach KAS', desc: 'Send Kaspa directly inside any message.' },
    { icon: Shield, title: 'Spam-proof', desc: 'Only approved wallets reach your inbox.' }
  ];

  return (
    <div className="flex flex-col px-6 py-6">
      <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">But completely different</h2>
      <p className="text-sm text-gray-400 mb-5">No accounts. No tracking. No central authority.</p>

      <BrowserWindow tabs={['Features', 'Security', 'Privacy']} activeTab={0} url="fluxkmail.app/features">
        <div className="space-y-2.5">
          {differences.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-900 border border-white/5"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                <d.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{d.title}</div>
                <div className="text-xs text-gray-400">{d.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </BrowserWindow>
    </div>
  );
}

/* --- Slide 4: Kaspa 101 --- */
function SlideKaspa() {
  const facts = [
    { icon: Zap, title: 'Lightning fast', desc: 'Blocks every second. Near-instant confirmation.' },
    { icon: Shield, title: 'Proof-of-Work', desc: 'Secure, decentralized, no single point of control.' },
    { icon: Globe, title: 'Truly native', desc: 'Fluxkmail runs on Kaspa — your wallet, your coins, your mail.' }
  ];

  return (
    <div className="flex flex-col px-6 py-6">
      <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">What is Kaspa?</h2>
      <p className="text-sm text-gray-400 mb-5">The blockchain that powers your inbox.</p>

      <BrowserWindow tabs={['Kaspa', 'Network', 'KAS']} activeTab={0} url="kaspa.org">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-2xl bg-gradient-to-br from-blue-900/40 to-cyan-900/20 border border-cyan-500/20 p-4 mb-3 text-center"
        >
          <div className="text-4xl font-bold text-cyan-400 mb-1">KAS</div>
          <div className="text-xs text-gray-400">The native currency of the Kaspa network</div>
        </motion.div>

        <div className="space-y-2.5">
          {facts.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{f.title}</div>
                <div className="text-xs text-gray-400">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </BrowserWindow>
    </div>
  );
}

/* --- Slide 5: TTT ID --- */
function SlideTTT({ onGetId }) {
  return (
    <div className="flex flex-col px-6 py-6">
      <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Get your TTT ID</h2>
      <p className="text-sm text-gray-400 mb-4">Your universal identity across the TTT Network and Fluxkmail.</p>

      <BrowserWindow tabs={['TTT ID', 'Profile', 'Login']} activeTab={0} url="tttz.xyz/profile">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-cyan-500/20 bg-gray-900 p-4 text-center">
            <div className="mx-auto mb-3 w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-sm text-gray-300 mb-1">
              Log in with your wallet on the TTT profile page and copy your Agent ID.
            </div>
            <div className="text-[11px] text-gray-500 mb-3 font-mono">
              e.g. <span className="text-cyan-400">ZK-HKZQGWEKQ3</span>
            </div>
            <a
              href="https://tttz.xyz/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center bg-[#00b7ff] hover:bg-[#33c6ff] text-black font-semibold rounded-xl px-4 py-2.5 text-sm shadow-[0_0_20px_rgba(0,183,255,0.3)] transition-colors"
            >
              Open TTT Profile <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            One ID for all TTT apps
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Check className="w-3.5 h-3.5 text-cyan-400" />
            No password to remember — your wallet signs you in
          </div>
        </motion.div>

        <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <p className="text-xs text-cyan-200">
            Once you have your TTT ID, tap <span className="font-semibold">Get Started</span> to connect and enter Fluxkmail.
          </p>
        </div>
      </BrowserWindow>
    </div>
  );
}