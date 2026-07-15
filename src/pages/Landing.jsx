import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import {
  Mail, Lock, Wallet, Zap, Shield, Coins, ArrowRight, Globe, Sparkles
} from 'lucide-react';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';

const ONBOARDING_KEY = 'fluxkmail_onboarding_complete';

export default function Landing() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showConnect, setShowConnect] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    if (!completed) {
      const t = setTimeout(() => setShowOnboarding(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-[100dvh] bg-black text-white overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-semibold tracking-tight">Fluxkmail</span>
          </div>
          <Button
            onClick={() => setShowConnect(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full px-5 text-sm"
          >
            Launch App
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-5 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 mb-6">
            <Sparkles className="w-3 h-3" />
            Built on Kaspa
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Mail for the<br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">crypto world</span>
          </h1>
          <p className="text-base text-gray-400 max-w-sm mx-auto mb-8">
            Your wallet is your address. Your inbox is yours. No servers, no tracking, no spam.
          </p>
          <Button
            onClick={() => setShowConnect(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-full px-8 py-6 text-base shadow-[0_0_30px_rgba(0,217,255,0.4)]"
          >
            Launch App <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={() => setShowOnboarding(true)}
            className="block mx-auto mt-4 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
          >
            See how it works
          </button>
        </motion.div>
      </section>

      {/* Feature cards */}
      <section className="px-5 pb-12">
        <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
          {[
            { icon: Wallet, title: 'Wallet = ID', desc: 'No email address needed' },
            { icon: Lock, title: 'Encrypted', desc: 'Your keys, your messages' },
            { icon: Zap, title: 'Spam-proof', desc: 'Approved senders only' },
            { icon: Coins, title: 'Send KAS', desc: 'Attach Kaspa in any mail' }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-2xl bg-gray-900/60 border border-white/5"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-3">
                <f.icon className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div className="text-sm font-semibold mb-0.5">{f.title}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gmail comparison */}
      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto rounded-2xl bg-gray-900/60 border border-white/5 p-5">
          <h2 className="text-lg font-semibold mb-4 text-center">vs. Gmail</h2>
          <div className="space-y-2.5">
            {[
              { same: true, text: 'Inbox, compose, search, starred' },
              { same: false, text: 'No email address — wallet is your identity' },
              { same: false, text: 'No servers — fully decentralized' },
              { same: false, text: 'Attach KAS payments inside any message' }
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                {row.same ? (
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                )}
                <span className={row.same ? 'text-gray-400' : 'text-white'}>
                  {row.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="px-5 pb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center tracking-tight">Security & Trust</h2>
          <div className="space-y-2">
            {[
              { icon: Shield, title: 'Non-custodial', desc: 'You control your keys' },
              { icon: Lock, title: 'Client-side encryption', desc: 'Encrypt before sending' },
              { icon: Globe, title: 'No data resale', desc: 'We collect nothing to sell' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-white/5">
                <item.icon className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <h2 className="text-2xl font-bold mb-3 tracking-tight">Start your inbox</h2>
        <p className="text-sm text-gray-400 mb-6">Join the future of private communication.</p>
        <Button
          onClick={() => setShowConnect(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full px-10 py-6 shadow-[0_0_30px_rgba(0,217,255,0.4)]"
        >
          Launch App <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <p className="text-xs text-gray-600 mt-8">Powered by TTT · Built for Kaspa</p>
      </section>

      <ConnectWalletModal isOpen={showConnect} onClose={() => setShowConnect(false)} />
    </div>
  );
}

function Check({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}