import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  X, Minus, Maximize2, Paperclip, Link, Smile, 
  MoreVertical, Trash2, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComposeModal({ 
  isOpen, 
  onClose, 
  onSend, 
  replyTo = null,
  isSending = false 
}) {
  const [to, setTo] = useState(replyTo?.from_wallet || replyTo?.from_email || '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const handleSend = () => {
    if (!to || !subject) return;
    onSend({ to, subject, body });
    setTo('');
    setSubject('');
    setBody('');
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
                <div className="flex items-center ml-2">
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
    </AnimatePresence>
  );
}