import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Zap, Users, Mail, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import ConnectWalletModal from '../components/wallet/ConnectWalletModal';

export default function Landing() {
  const [showConnectModal, setShowConnectModal] = useState(false);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/449cf3baf_image.png)' }}>
      <div className="min-h-screen bg-black/40">
        {/* Header */}
        <header className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/925d1c391_image.png" 
                alt="Flux Kmail" 
                className="h-12"
              />
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition-colors">How it Works</a>
              <a href="#security" className="text-gray-300 hover:text-cyan-400 transition-colors">Security</a>
              <a href="#use-cases" className="text-gray-300 hover:text-cyan-400 transition-colors">Use Cases</a>
              <Button 
                onClick={() => setShowConnectModal(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:shadow-[0_0_30px_rgba(0,217,255,0.7)]"
              >
                Launch App
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Private messaging for the <span className="text-cyan-400">crypto world</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-4">
            No emails. No spam. No surveillance.
          </p>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Send encrypted messages using wallet identity. No accounts. No servers. No data harvesting.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              onClick={() => setShowConnectModal(true)}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-6 shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)]"
            >
              Launch App <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>

        {/* Product Preview */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">What your decentralized inbox looks like</h2>
            <p className="text-gray-400 text-lg">Clean, simple, and completely private</p>
          </div>
          <div className="rounded-2xl border-2 border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,217,255,0.3)] bg-black/40 backdrop-blur-md">
            <img 
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=600&fit=crop" 
              alt="Inbox Preview" 
              className="w-full opacity-80"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Why Flux Kmail</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "End-to-End Encrypted", desc: "Messages encrypted with your wallet's private key" },
              { icon: Shield, title: "Wallet = Identity", desc: "No email addresses, no phone numbers, no personal data" },
              { icon: Zap, title: "Spam-Proof Inbox", desc: "Only receive messages from approved senders" },
              { icon: Globe, title: "No Servers", desc: "Fully decentralized, no central authority" },
              { icon: Mail, title: "No Tracking", desc: "Zero data collection, no surveillance" },
              { icon: CheckCircle2, title: "Censorship Resistant", desc: "Open protocol, unstoppable communication" }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-black/60 border-cyan-500/30 backdrop-blur-md hover:border-cyan-400 transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.3)]">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/50">
                    <feature.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="max-w-7xl mx-auto px-6 py-24 bg-black/40 backdrop-blur-md">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Built for Web3</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "DAO communications",
              "Private crypto DMs",
              "Support inboxes",
              "Community messaging",
              "Whitelisted sender inbox",
              "Paid DMs & tip-gated messages"
            ].map((useCase, idx) => (
              <div key={idx} className="flex items-center gap-4 p-6 bg-black/60 border border-cyan-500/30 rounded-lg hover:border-cyan-400 transition-all">
                <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <span className="text-lg text-gray-300">{useCase}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Trust */}
        <section id="security" className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Security & Trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Non-custodial", desc: "You control your keys, you control your messages" },
              { title: "Zero message storage", desc: "Messages are never stored on our servers" },
              { title: "Client-side encryption", desc: "Encrypt before sending, decrypt after receiving" },
              { title: "Wallet-based auth", desc: "No passwords, no 2FA, just your wallet" },
              { title: "No data resale", desc: "We don't collect data, so we can't sell it" },
              { title: "Open protocol", desc: "Transparent, auditable, and community-driven" }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-black/60 border border-cyan-500/30 rounded-lg backdrop-blur-md">
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Start your decentralized inbox</h2>
          <p className="text-xl text-gray-400 mb-12">Join the future of private communication</p>
          <Button 
            onClick={() => setShowConnectModal(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-12 py-6 shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)]"
          >
            Launch App <ArrowRight className="ml-2" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="border-t border-cyan-500/20 bg-black/40 backdrop-blur-md py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
            <p className="mb-2">Built for Kaspa</p>
            <p className="text-sm">Powered by TTT</p>
          </div>
        </footer>

        {/* Connect Wallet Modal */}
        <ConnectWalletModal 
          isOpen={showConnectModal} 
          onClose={() => setShowConnectModal(false)} 
        />
      </div>
    </div>
  );
}