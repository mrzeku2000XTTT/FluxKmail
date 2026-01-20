import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectWalletModal({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectKasware = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window.kasware === 'undefined') {
        setError('Kasware wallet not detected. Please install the Kasware browser extension.');
        window.open('https://kasware.xyz/', '_blank');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.kasware.requestAccounts();
      
      if (accounts && accounts.length > 0) {
        localStorage.setItem('kmail_wallet', accounts[0]);
        window.location.reload();
      }
    } catch (err) {
      console.error('Error connecting to Kasware:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-gray-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,217,255,0.3)] max-w-md w-full"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-cyan-500/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-cyan-400" />
          </button>

          <div className="p-8 space-y-6">
            {/* Icon */}
            <div className="mx-auto w-20 h-20 bg-black border-2 border-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,217,255,0.5)]">
              <Wallet className="w-10 h-10 text-cyan-400" />
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-cyan-400">
                Welcome to Flux Kmail
              </h2>
              <p className="text-gray-400">
                Connect your Kasware wallet to access your decentralized inbox
              </p>
            </div>

            {/* Connect Button */}
            <Button
              onClick={connectKasware}
              disabled={isConnecting}
              className="w-full h-12 text-base bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] transition-all"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Kasware Wallet
                </>
              )}
            </Button>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Footer Link */}
            <div className="pt-4 border-t border-cyan-500/20 text-center">
              <a
                href="https://kasware.xyz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
              >
                Don't have Kasware?
                <span className="text-cyan-400 font-medium flex items-center gap-1">
                  Get it here <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}