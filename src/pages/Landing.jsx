import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, Lock, Zap, Users, MessageSquare, DollarSign,
  Check, Mail, Wallet, ArrowRight, Play
} from 'lucide-react';
import ConnectWalletModal from '@/components/wallet/ConnectWalletModal';

export default function Landing() {
  const [showConnectModal, setShowConnectModal] = useState(false);

  const features = [
    {
      icon: Lock,
      title: "End-to-End Encrypted",
      description: "Your messages are encrypted client-side. Zero server storage."
    },
    {
      icon: Wallet,
      title: "Wallet = Identity",
      description: "No email addresses, no usernames. Your wallet is your identity."
    },
    {
      icon: Shield,
      title: "Spam-Proof Inbox",
      description: "Only receive messages from wallets you trust."
    },
    {
      icon: Zap,
      title: "Censorship Resistant",
      description: "Decentralized protocol. No central authority can shut you down."
    }
  ];

  const useCases = [
    { icon: Users, text: "DAO Communications" },
    { icon: MessageSquare, text: "Private Crypto DMs" },
    { icon: Mail, text: "Support Inboxes" },
    { icon: DollarSign, text: "Paid DMs & Tipping" }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/449cf3baf_image.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.6
        }}
      />

      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-cyan-500/20 backdrop-blur-md bg-black/40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/925d1c391_image.png"
                alt="Flux Kmail"
                className="h-12 w-auto"
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

            <Button 
              onClick={() => setShowConnectModal(true)}
              className="md:hidden bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            >
              Launch App
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Private messaging for the
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                crypto world
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Send encrypted messages using wallet identity.
              <span className="block mt-2">No emails. No spam. No surveillance.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                onClick={() => setShowConnectModal(true)}
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-8 py-6 shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)] transition-all"
              >
                Launch App
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 text-lg px-8 py-6"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Product Preview */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-8 shadow-[0_0_50px_rgba(0,217,255,0.2)]">
            <div className="aspect-video bg-black/50 rounded-lg border border-cyan-500/20 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Mail className="w-24 h-24 text-cyan-400 mx-auto opacity-50" />
                <p className="text-gray-400 text-lg">Your decentralized inbox preview</p>
              </div>
            </div>
            <p className="text-center text-gray-400 mt-6 text-sm">
              What your encrypted, wallet-based inbox looks like
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Why Flux Kmail?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card key={idx} className="bg-gray-900/80 backdrop-blur-md border-cyan-500/30 hover:border-cyan-400/50 transition-all hover:shadow-[0_0_30px_rgba(0,217,255,0.3)]">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
            Built for Web3
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              return (
                <div key={idx} className="flex items-center gap-4 bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/50 transition-all">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-white font-medium">{useCase.text}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Security */}
        <section id="security" className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
              Security & Trust
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                "Non-custodial messaging",
                "Zero message storage",
                "Client-side encryption",
                "Wallet-based authentication",
                "No data resale",
                "Open protocol"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start your decentralized inbox
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Connect your wallet and experience private, encrypted messaging
          </p>
          <Button 
            onClick={() => setShowConnectModal(true)}
            size="lg"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg px-12 py-6 shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)] transition-all"
          >
            Launch App Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="border-t border-cyan-500/20 backdrop-blur-md bg-black/40 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/925d1c391_image.png"
                  alt="Flux Kmail"
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-400 text-sm">
                © 2026 Flux Kmail. Decentralized messaging for Web3.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Connect Modal */}
      <ConnectWalletModal 
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
      />
    </div>
  );
}