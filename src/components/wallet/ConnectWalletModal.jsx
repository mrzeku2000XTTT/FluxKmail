import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, ExternalLink } from 'lucide-react';

export default function ConnectWalletModal({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectKasware = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.kasware) {
        setError('Kasware wallet not detected. Please install the Kasware browser extension.');
        setIsConnecting(false);
        return;
      }

      const accounts = await window.kasware.requestAccounts();
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        localStorage.setItem('walletAddress', address);
        localStorage.setItem('isWalletConnected', 'true');
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-cyan-500/30 max-w-md shadow-[0_0_50px_rgba(0,217,255,0.3)]">
        <DialogHeader>
          <div className="mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/1c72e6aaf_image.png" 
              alt="Flux Kmail Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <DialogTitle className="text-3xl font-bold text-cyan-400 text-center">
            Welcome to Flux Kmail
          </DialogTitle>
          <DialogDescription className="text-base text-gray-400 text-center">
            Connect your Kasware wallet to access your decentralized inbox
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
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

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="pt-4 border-t border-cyan-500/20">
            <a
              href="https://kasware.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Don't have Kasware?
              <span className="text-cyan-400 font-medium flex items-center gap-1">
                Get it here <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}