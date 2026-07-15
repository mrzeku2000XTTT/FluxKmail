import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';
import { useEncryption } from '@/lib/EncryptionContext';
import { getEncryptionSignMessage } from '@/lib/crypto';

export default function UnlockEncryptionModal() {
  const { initKeys } = useEncryption();
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [error, setError] = useState(null);

  const walletAddress = localStorage.getItem('kmail_wallet');
  const tttId = localStorage.getItem('kmail_ttt_id');
  const tttAccountStr = localStorage.getItem('kmail_ttt_account');
  const isTTT = !!(tttId && tttAccountStr);

  const handleUnlock = async () => {
    setIsUnlocking(true);
    setError(null);

    try {
      if (isTTT) {
        const account = JSON.parse(tttAccountStr);
        const credentialString = `${tttId}:${account.password}`;
        await initKeys(walletAddress, credentialString);
      } else if (window.kasware) {
        const signature = await window.kasware.signMessage(getEncryptionSignMessage());
        await initKeys(walletAddress, signature);
      } else {
        setError('Kasware wallet not detected. Please install the extension.');
      }
    } catch (err) {
      setError(err.message || 'Failed to unlock encryption');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,183,255,0.2)]">
            <Lock className="w-8 h-8 text-[#00b7ff]" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          Unlock Your Encrypted Messages
        </h2>
        <p className="text-sm text-gray-400 mb-1">
          {isTTT
            ? 'Authenticating with your TTT credentials to decrypt your messages.'
            : 'Sign with your Kasware wallet to unlock your end-to-end encrypted inbox.'}
        </p>
        <p className="text-xs text-gray-500 mb-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00b7ff]" />
          Your private key never leaves your device.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <Button
          onClick={handleUnlock}
          disabled={isUnlocking}
          className="bg-[#00b7ff] hover:bg-[#33c6ff] text-black font-semibold rounded-full px-8 shadow-[0_0_25px_rgba(0,183,255,0.4)]"
        >
          {isUnlocking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Unlocking...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              {isTTT ? 'Unlock with TTT' : 'Unlock with Wallet'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}