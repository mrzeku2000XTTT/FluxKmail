import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Key, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/email/Header';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [walletAddress] = useState(() => localStorage.getItem('kmail_wallet'));

  const generateApiKey = () => {
    // Generate a secure random API key
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'vk_'; // vk = vibecode key prefix
    for (let i = 0; i < 32; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setApiKey(key);
    toast.success('New API key generated!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('API key copied to clipboard!');
  };

  if (!walletAddress) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please connect your wallet first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/449cf3baf_image.png)' }}>
      <div className="h-screen flex flex-col bg-black/60 backdrop-blur-sm">
        <Header 
          walletAddress={walletAddress}
          onMenuToggle={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
          onSearch={() => {}}
          onDisconnect={() => {
            localStorage.removeItem('kmail_wallet');
            window.location.reload();
          }}
        />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-[0_0_30px_rgba(0,217,255,0.3)] border border-cyan-500/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Key className="w-8 h-8 text-cyan-400" />
                <h1 className="text-3xl font-bold text-white">API Key Management</h1>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mb-6">
                <h3 className="text-cyan-400 font-semibold mb-2">Vibecode Integration</h3>
                <p className="text-gray-300 text-sm">
                  Generate an API key to allow Vibecode to send verification PINs to Fluxkmail.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-cyan-400 mb-2">
                    Current API Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={apiKey}
                      readOnly
                      placeholder="Click 'Generate New Key' to create an API key"
                      className="bg-gray-800 border-cyan-500/30 text-white font-mono"
                    />
                    {apiKey && (
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="icon"
                        className="border-cyan-500/30 hover:bg-cyan-500/20"
                      >
                        <Copy className="w-4 h-4 text-cyan-400" />
                      </Button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={generateApiKey}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(0,217,255,0.5)]"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate New Key
                </Button>

                {apiKey && (
                  <div className="bg-gray-800/50 border border-cyan-500/20 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400">Next Steps:</h3>
                    
                    <div className="space-y-3 text-sm text-gray-300">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center text-xs">1</span>
                        <div>
                          <p className="font-semibold text-white">Update Fluxkmail Environment Variable</p>
                          <p>Go to Base44 Dashboard → Settings → Environment Variables</p>
                          <p>Set <code className="bg-gray-900 px-2 py-1 rounded text-cyan-400">VIBECODE_API_KEY</code> to the generated key</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center text-xs">2</span>
                        <div>
                          <p className="font-semibold text-white">Update Vibecode Environment Variable</p>
                          <p>In your Vibecode app's ENV tab, set:</p>
                          <p><code className="bg-gray-900 px-2 py-1 rounded text-cyan-400">EXPO_PUBLIC_FLUXKMAIL_API_KEY</code> to the generated key</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center text-xs">3</span>
                        <div>
                          <p className="font-semibold text-white">Set Fluxkmail API URL in Vibecode</p>
                          <p>In your Vibecode app's ENV tab, also set:</p>
                          <p><code className="bg-gray-900 px-2 py-1 rounded text-cyan-400">EXPO_PUBLIC_FLUXKMAIL_API_URL</code></p>
                          <p className="text-xs text-gray-400 mt-1">Value: Your Fluxkmail function endpoint URL</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-4">
                      <p className="text-red-400 text-xs">
                        ⚠️ <strong>Security Note:</strong> Keep this API key secret. Anyone with this key can send emails to Fluxkmail accounts.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}