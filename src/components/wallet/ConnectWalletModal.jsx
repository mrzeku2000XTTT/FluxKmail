import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, ExternalLink, Hash } from 'lucide-react';
import TTTLoginForm from './TTTLoginForm';

export default function ConnectWalletModal({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [useWallet, setUseWallet] = useState(true);

  const connectKasware = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.kasware) {
        setError('Kasware wallet not detected. Please install the Kasware browser extension.');
        setIsConnecting(false);
        return;
      }

      // Request accounts - this will open Kasware popup
      const accounts = await window.kasware.requestAccounts();
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        
        // Request signature for login authentication
        const message = `Sign this message to log in to Flux Kmail\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
        await window.kasware.signMessage(message);
        
        localStorage.setItem('kmail_wallet', address);
        onClose();
        setTimeout(() => window.location.reload(), 100);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTTTSuccess = () => {
    onClose();
    setTimeout(() => window.location.reload(), 100);
  };

  const handleTTTError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-cyan-500/30 max-w-md shadow-[0_0_50px_rgba(0,217,255,0.3)]">
        <DialogHeader>
          <div className="mx-auto w-32 h-32 flex items-center justify-center mb-6">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/a1024d7d4_image.png" 
              alt="Flux Kmail Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <DialogTitle className="text-3xl font-bold text-cyan-400 text-center">
            Welcome to Flux Kmail
          </DialogTitle>
          <DialogDescription className="text-base text-gray-400 text-center">
            {useWallet ? 'Connect your Kasware wallet or use TTT ID' : 'Enter your TTT ID to continue'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Toggle Buttons */}
          <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
            <button
              onClick={() => setUseWallet(true)}
              className={`flex-1 py-2 rounded-md transition-all ${
                useWallet 
                  ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(0,217,255,0.5)]' 
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              Wallet
            </button>
            <button
              onClick={() => setUseWallet(false)}
              className={`flex-1 py-2 rounded-md transition-all ${
                !useWallet 
                  ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(0,217,255,0.5)]' 
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              <Hash className="w-4 h-4 inline mr-2" />
              TTT ID
            </button>
          </div>

          {useWallet ? (
            <>
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

              <div className="pt-2">
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
            </>
          ) : (
            <TTTLoginForm 
              onSuccess={handleTTTSuccess}
              onError={handleTTTError}
            />
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}