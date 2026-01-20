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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Kmail
          </CardTitle>
          <CardDescription className="text-base">
            Connect your Kasware wallet to access your decentralized mailbox
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={connectKasware}
            disabled={isConnecting}
            className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <a
              href="https://kasware.xyz/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Don't have Kasware?
              <span className="text-purple-600 font-medium flex items-center gap-1">
                Get it here <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}