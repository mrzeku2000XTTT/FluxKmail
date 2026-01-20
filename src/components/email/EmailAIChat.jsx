import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, X, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmailAIChat({ email, walletAddress }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Create conversation when chat opens
  useEffect(() => {
    if (isOpen && !conversation) {
      createConversation();
    }
  }, [isOpen]);

  const createConversation = async () => {
    try {
      const conv = await base44.agents.createConversation({
        agent_name: 'email_assistant',
        metadata: {
          email_id: email.id,
          wallet_address: walletAddress,
          subject: email.subject
        }
      });
      setConversation(conv);
      setMessages(conv.messages || []);
      
      // Send initial context message
      const contextMessage = `I'm viewing an email with the following details:
- Subject: ${email.subject}
- From: ${email.from_name || email.from_wallet}
- To: ${email.to_name || email.to_wallet}
- Date: ${new Date(email.created_date).toLocaleString()}
${email.kas_amount ? `- KAS Amount: ${email.kas_amount} KAS` : ''}

Email content:
${email.body.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}

Please help me understand this email. What questions do you have?`;
      
      await sendMessage(contextMessage, conv, true);
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  const sendMessage = async (messageText, conv = conversation, isInitial = false) => {
    if (!conv || (!messageText.trim() && !isInitial)) return;
    
    setIsLoading(true);
    
    try {
      // Add user message to UI if not initial
      if (!isInitial) {
        setMessages(prev => [...prev, { role: 'user', content: messageText }]);
        setInput('');
      }

      // Subscribe to conversation updates
      const unsubscribe = base44.agents.subscribeToConversation(conv.id, (data) => {
        setMessages(data.messages);
      });

      // Send message
      await base44.agents.addMessage(conv, {
        role: 'user',
        content: messageText
      });

      // Cleanup subscription after response
      setTimeout(() => {
        unsubscribe();
        setIsLoading(false);
      }, 100);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
  };

  return (
    <>
      {/* AI Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_30px_rgba(0,217,255,0.6)] hover:shadow-[0_0_40px_rgba(0,217,255,0.8)] z-50"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-gray-900 rounded-2xl border border-cyan-500/30 shadow-[0_0_40px_rgba(0,217,255,0.4)] flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-blue-600/10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Assistant</h3>
                  <p className="text-xs text-cyan-400">Ask me anything about this email</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="rounded-full hover:bg-cyan-500/20"
              >
                <X className="w-5 h-5 text-cyan-400" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .filter(msg => msg.content) // Filter out empty messages
                .map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800 text-gray-200 border border-cyan-500/20'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-sm">{msg.content}</p>
                    ) : (
                      <ReactMarkdown
                        className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          strong: ({ children }) => <strong className="text-cyan-400">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-cyan-500/20">
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-cyan-500/30">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about this email..."
                  className="bg-gray-800 border-cyan-500/30 text-white focus:border-cyan-500"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}