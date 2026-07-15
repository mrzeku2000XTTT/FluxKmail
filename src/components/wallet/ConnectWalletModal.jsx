import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Wallet, ExternalLink, Hash } from 'lucide-react';
import TTTLoginForm from './TTTLoginForm';
import FluxkmailLogo from '@/components/FluxkmailLogo';
import { useEncryption } from '@/lib/EncryptionContext';
import { getEncryptionSignMessage } from '@/lib/crypto';

export default function ConnectWalletModal({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [useWallet, setUseWallet] = useState(true);
  const { initKeys } = useEncryption();

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
        
        const message = `Sign this message to log in to Flux Kmail\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
        await window.kasware.signMessage(message);

        // Sign to derive E2E encryption keys
        const encSignature = await window.kasware.signMessage(getEncryptionSignMessage());
        await initKeys(address, encSignature);

        localStorage.setItem('kmail_wallet', address);
        onClose();
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTTTSuccess = () => {
    onClose();
    window.location.reload();
  };

  const handleTTTError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-black/70 backdrop-blur-xl border border-white/10 max-w-md rounded-3xl p-8 shadow-[0_0_60px_rgba(255,255,255,0.08)]"
        style={{ fontFamily: '"Helvetica Now Var", Helvetica, Arial, sans-serif' }}
      >
        <DialogHeader>
          <div className="mx-auto mb-6">
            <FluxkmailLogo size={72} />
          </div>
          <DialogTitle className="text-2xl font-bold text-white text-center tracking-tight" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
            Welcome to Fluxkmail 402
          </DialogTitle>
          <DialogDescription className="text-sm text-white/50 text-center tracking-wide">
            {useWallet ? 'Connect your Kasware wallet or use TTT ID' : 'Enter your TTT ID to continue'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Toggle Buttons */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-full border border-white/10">
            <button
              onClick={() => setUseWallet(true)}
              className={`flex-1 py-2.5 rounded-full transition-all text-sm tracking-wide flex items-center justify-center ${
                useWallet 
                  ? 'bg-white text-black font-semibold' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Wallet
            </button>
            <button
              onClick={() => setUseWallet(false)}
              className={`flex-1 py-2.5 rounded-full transition-all text-sm tracking-wide flex items-center justify-center ${
                !useWallet 
                  ? 'bg-white text-black font-semibold' 
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <Hash className="w-4 h-4 mr-2" />
              TTT ID
            </button>
          </div>

          {useWallet ? (
            <>
              <button
                onClick={connectKasware}
                disabled={isConnecting}
                className="w-full h-12 rounded-full bg-white text-black text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
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
              </button>

              <div className="pt-1">
                <a
                  href="https://kasware.xyz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors tracking-wide"
                >
                  Don't have Kasware?
                  <span className="text-white/80 font-medium flex items-center gap-1">
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
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}