import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from '@/api/base44Client';
import { Hash, Lock, Wallet, HelpCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function TTTLoginForm({ onSuccess, onError }) {
  const [isLogin, setIsLogin] = useState(true);
  const [tttId, setTttId] = useState('');
  const [password, setPassword] = useState('');
  const [kaspaAddress, setKaspaAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleLogin = async () => {
    if (!tttId.trim() || !password.trim()) {
      onError('Please enter TTT ID and password');
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await base44.entities.TTTAccount.filter({ ttt_id: tttId.trim() });
      
      if (accounts.length === 0) {
        onError('Account not found. Please register first.');
        setIsLoading(false);
        return;
      }

      const account = accounts[0];
      
      // Simple password check (in production, use proper hashing)
      if (account.password !== password) {
        onError('Invalid password');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('kmail_ttt_id', tttId.trim());
      localStorage.setItem('kmail_wallet', account.main_kaspa_address);
      localStorage.setItem('kmail_ttt_account', JSON.stringify(account));
      onSuccess();
    } catch (err) {
      onError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!tttId.trim() || !password.trim() || !kaspaAddress.trim()) {
      onError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // Check if TTT ID already exists
      const existing = await base44.entities.TTTAccount.filter({ ttt_id: tttId.trim() });
      
      if (existing.length > 0) {
        onError(`TTT ID "${tttId}" is already claimed. Please login instead.`);
        setIsLoading(false);
        return;
      }

      // Create new account
      const newAccount = await base44.entities.TTTAccount.create({
        ttt_id: tttId.trim(),
        password: password, // In production, hash this
        main_kaspa_address: kaspaAddress.trim()
      });

      localStorage.setItem('kmail_ttt_id', tttId.trim());
      localStorage.setItem('kmail_wallet', kaspaAddress.trim());
      localStorage.setItem('kmail_ttt_account', JSON.stringify(newAccount));
      localStorage.setItem('kmail_new_registration', 'true');
      
      toast.success('Account created! Add security addresses in Settings.');
      onSuccess();
    } catch (err) {
      onError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-lg transition-all ${
              isLogin 
                ? 'bg-cyan-500 text-black font-semibold' 
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-lg transition-all ${
              !isLogin 
                ? 'bg-cyan-500 text-black font-semibold' 
                : 'text-gray-400 hover:text-cyan-400'
            }`}
          >
            Register
          </button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowHelp(true)}
          className="text-cyan-400 hover:bg-cyan-500/20"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-400 mb-1 block">TTT Agent ID</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <Input
              value={tttId}
              onChange={(e) => setTttId(e.target.value)}
              placeholder="e.g., ZK-HKZQGWEKQ3"
              className="bg-gray-800 border-cyan-500/30 text-white focus:border-cyan-500 pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-1 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-gray-800 border-cyan-500/30 text-white focus:border-cyan-500 pl-10"
              onKeyDown={(e) => e.key === 'Enter' && (isLogin ? handleLogin() : handleRegister())}
            />
          </div>
        </div>

        {!isLogin && (
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Main Kaspa Address *</label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <Input
                value={kaspaAddress}
                onChange={(e) => setKaspaAddress(e.target.value)}
                placeholder="kaspa:..."
                className="bg-gray-800 border-cyan-500/30 text-white focus:border-cyan-500 pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              You can add 2nd & 3rd addresses in Settings for extra security
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={isLogin ? handleLogin : handleRegister}
        disabled={isLoading}
        className="w-full h-12 text-base bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] transition-all"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            {isLogin ? 'Logging in...' : 'Creating account...'}
          </>
        ) : (
          <>
            <Hash className="w-5 h-5 mr-2" />
            {isLogin ? 'Login with TTT ID' : 'Create Account'}
          </>
        )}
      </Button>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="bg-gray-900 border-cyan-500/30 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-cyan-400">
              What is TTT Agent ID?
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Your unique identity from TTT Network
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">How to get your TTT ID:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Visit <a href="https://tttz.xyz/profile" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">tttz.xyz/profile</a></li>
                <li>Make sure you're logged in with your wallet</li>
                <li>Your TTT Agent ID will be displayed (e.g., ZK-HKZQGWEKQ3)</li>
                <li>Copy this ID to use for Flux Kmail registration</li>
              </ol>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Why use TTT ID?</h3>
              <p className="text-sm">
                • Access Flux Kmail without connecting wallet every time<br />
                • Receive emails using your TTT ID<br />
                • Enhanced security with multiple Kaspa addresses<br />
                • You'll still need Kasware to send KAS with emails
              </p>
            </div>
            <Button
              onClick={() => window.open('https://tttz.xyz/profile', '_blank')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black"
            >
              Get TTT ID <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}