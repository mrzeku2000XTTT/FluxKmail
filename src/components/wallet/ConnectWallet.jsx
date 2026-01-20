import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function ConnectWallet({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.kasware !== 'undefined') {
      try {
        const accounts = await window.kasware.getAccounts();
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
          onConnect(accounts[0]);
        }
      } catch (err) {
        console.log('No wallet connected yet');
      }
    }
  };

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
        setWalletAddress(accounts[0]);
        onConnect(accounts[0]);
      }
    } catch (err) {
      console.error('Error connecting to Kasware:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  if (walletAddress) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-green-900">Connected</p>
          <p className="text-xs text-green-700 truncate">{walletAddress}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,217,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,217,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,217,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      <Card className="w-full max-w-md shadow-[0_0_50px_rgba(0,217,255,0.3)] bg-gray-900 border-cyan-500/30 relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-black border-2 border-cyan-400 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,217,255,0.5)]">
            <Wallet className="w-8 h-8 text-cyan-400" />
          </div>
          <CardTitle className="text-3xl font-bold text-cyan-400">
            Welcome to Kmail
          </CardTitle>
          <CardDescription className="text-base text-gray-400">
            Connect your Kasware wallet to access your decentralized mailbox
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}