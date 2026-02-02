import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  X, Minus, Maximize2, Paperclip, Link, Smile, 
  MoreVertical, Trash2, Send, Coins, Wallet, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ContactsModal from './ContactsModal';

export default function ComposeModal({ 
  isOpen, 
  onClose, 
  onSend, 
  replyTo = null,
  isSending = false 
}) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [kasAmount, setKasAmount] = useState('');
  const [showKasInput, setShowKasInput] = useState(false);
  const [showWalletIframe, setShowWalletIframe] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  useEffect(() => {
    if (replyTo) {
      setTo(replyTo.from_wallet || '');
      setSubject(replyTo.subject?.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`);
    }
  }, [replyTo]);

  const handleSend = async () => {
    if (!to || !subject) return;

    // Send KAS if amount is specified
    if (kasAmount && parseFloat(kasAmount) > 0) {
      try {
        if (!window.kasware) {
          alert('Kasware wallet not detected. Please install Kasware extension.');
          return;
        }

        // Convert KAS to sompi (1 KAS = 100000000 sompi)
        const amountInSompi = Math.floor(parseFloat(kasAmount) * 100000000);
        
        // Trigger Kasware to send KAS
        const txid = await window.kasware.sendKaspa(to, amountInSompi);
        console.log('KAS transaction sent, txid:', txid);
      } catch (err) {
        console.error('Failed to send KAS:', err);
        alert('Failed to send KAS: ' + (err.message || 'Transaction cancelled'));
        return;
      }
    }

    // Send the email with KAS amount
    onSend({ to, subject, body, kasAmount: kasAmount || null });
    setTo('');
    setSubject('');
    setBody('');
    setKasAmount('');
    setShowKasInput(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`fixed bottom-0 right-6 w-[580px] bg-gray-900 rounded-t-lg shadow-[0_0_30px_rgba(0,217,255,0.3)] border border-cyan-500/30 z-50 flex flex-col ${
          isMinimized ? 'h-12' : 'h-[500px]'
        }`}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-2 bg-black border-b border-cyan-500/30 rounded-t-lg cursor-pointer"
          onClick={() => isMinimized && setIsMinimized(false)}
        >
          <span className="text-cyan-400 text-sm font-medium">
            {subject || 'New Message'}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(!isMinimized);
              }}
              className="p-1 hover:bg-cyan-500/20 rounded"
            >
              <Minus className="w-4 h-4 text-cyan-400" />
            </button>
            <button className="p-1 hover:bg-cyan-500/20 rounded">
              <Maximize2 className="w-4 h-4 text-cyan-400" />
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-cyan-500/20 rounded"
            >
              <X className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Fields */}
            <div className="border-b border-cyan-500/20">
              <div className="flex items-center border-b border-cyan-500/10">
                <span className="px-4 text-sm text-cyan-400 w-16">To</span>
                <Input 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border-0 focus-visible:ring-0 rounded-none text-sm bg-transparent text-white placeholder:text-gray-500"
                  placeholder="Wallet address"
                />
              </div>
              <div className="flex items-center">
                <span className="px-4 text-sm text-cyan-400 w-16">Subject</span>
                <Input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border-0 focus-visible:ring-0 rounded-none text-sm bg-transparent text-white placeholder:text-gray-500"
                  placeholder="Subject"
                />
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-hidden">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-full p-4 text-sm resize-none focus:outline-none bg-transparent text-white placeholder:text-gray-500"
                placeholder="Compose email"
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-cyan-500/20">
              <div className="flex items-center gap-1">
                <Button 
                  onClick={handleSend}
                  disabled={!to || !subject || isSending}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-full px-6 shadow-[0_0_15px_rgba(0,217,255,0.5)] hover:shadow-[0_0_25px_rgba(0,217,255,0.7)]"
                >
                  {isSending ? 'Sending...' : 'Send'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
                <div className="flex items-center ml-2 gap-2">
                  {showKasInput && (
                    <div className="flex items-center gap-2 bg-cyan-500/10 rounded-lg px-3 py-2 border-2 border-cyan-500/50">
                      <Coins className="w-5 h-5 text-cyan-400" />
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={kasAmount}
                        onChange={(e) => setKasAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-24 h-8 border-0 bg-transparent text-white text-base p-1 focus-visible:ring-0 placeholder:text-gray-400"
                      />
                      <span className="text-cyan-400 text-sm font-semibold">KAS</span>
                      <button 
                        onClick={() => { setShowKasInput(false); setKasAmount(''); }}
                        className="hover:bg-red-500/20 rounded-full p-1"
                      >
                        <X className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => setShowWalletIframe(!showWalletIframe)}
                    className={`p-2 hover:bg-cyan-500/20 rounded-full ${showWalletIframe ? 'bg-cyan-500/20' : ''}`}
                    title="Open KcWallet"
                  >
                    <Wallet className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button 
                    onClick={() => setShowKasInput(!showKasInput)}
                    className={`p-2 hover:bg-cyan-500/20 rounded-full ${showKasInput ? 'bg-cyan-500/20' : ''}`}
                    title="Send KAS with message"
                  >
                    <Coins className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button className="p-2 hover:bg-cyan-500/20 rounded-full">
                    <Paperclip className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button className="p-2 hover:bg-cyan-500/20 rounded-full">
                    <Link className="w-5 h-5 text-cyan-400" />
                  </button>
                  <button className="p-2 hover:bg-cyan-500/20 rounded-full">
                    <Smile className="w-5 h-5 text-cyan-400" />
                  </button>
                </div>
              </div>
              <div className="flex items-center">
                <button className="p-2 hover:bg-cyan-500/20 rounded-full">
                  <MoreVertical className="w-5 h-5 text-cyan-400" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-red-500/20 rounded-full"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>

      {/* KcWallet iframe */}
      {showWalletIframe && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          onClick={() => setShowWalletIframe(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-900 rounded-lg border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,217,255,0.4)] w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/30">
              <div className="flex items-center gap-3">
                <Wallet className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-semibold text-cyan-400">KcWallet</h3>
              </div>
              <div className="flex items-center gap-2">
                {to && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(to);
                      toast.success('Recipient address copied!');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg border border-cyan-500/50 transition-all"
                  >
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-mono">{to.slice(0, 12)}...{to.slice(-8)}</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowContacts(true);
                  }}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 rounded-lg text-black font-semibold transition-all shadow-[0_0_15px_rgba(0,217,255,0.5)]"
                >
                  Contacts
                </button>
                <button
                  onClick={() => setShowWalletIframe(false)}
                  className="p-2 hover:bg-cyan-500/20 rounded-full"
                >
                  <X className="w-5 h-5 text-cyan-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <iframe
                src="https://wallet.kaspa.com"
                className="w-full h-full border-0"
                title="KcWallet"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Contacts Modal */}
      {showContacts && (
        <ContactsModal
          isOpen={showContacts}
          onClose={() => setShowContacts(false)}
          recipientAddress={to}
          onSelectContact={(address) => {
            setTo(address);
            setShowContacts(false);
            toast.success('Contact address added!');
          }}
        />
      )}
    </AnimatePresence>
  );
}