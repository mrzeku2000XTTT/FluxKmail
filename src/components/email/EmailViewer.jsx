import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, Star, Archive, Trash2, Clock, MoreVertical,
  Reply, Forward, Printer, ExternalLink, Paperclip, Download, Coins
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function EmailViewer({ email, onBack, onStar, onReply, onDelete }) {
  if (!email) return null;

  const displayName = email.from_name || (email.from_wallet ? `${email.from_wallet.slice(0, 8)}...${email.from_wallet.slice(-6)}` : email.from_email);
  const initials = email.from_name 
    ? email.from_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (email.from_wallet ? email.from_wallet.slice(0, 2).toUpperCase() : 'U');

  const avatarColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const addressForColor = email.from_wallet || email.from_email || 'default';
  const colorIndex = addressForColor.charCodeAt(0) % avatarColors.length;

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-cyan-500/20">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-cyan-500/20">
          <ArrowLeft className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
          <Archive className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20" onClick={onDelete}>
          <Trash2 className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
          <Clock className="w-5 h-5 text-cyan-400" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
          <Printer className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
          <ExternalLink className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
          <MoreVertical className="w-5 h-5 text-cyan-400" />
        </Button>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl">
          {/* Subject */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-normal text-white mb-3">{email.subject}</h1>
              {email.kas_amount && email.kas_amount > 0 && (
                <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2 w-fit shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                  <Coins className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-400 font-semibold text-lg">{email.kas_amount} KAS</span>
                  <span className="text-gray-400 text-sm">sent with this email</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => onStar(email)}
              className="p-2 hover:bg-cyan-500/20 rounded-full transition-colors flex-shrink-0"
            >
              <Star 
                className={cn(
                  "w-5 h-5",
                  email.is_starred 
                    ? "fill-cyan-400 text-cyan-400" 
                    : "text-gray-600 hover:text-cyan-400"
                )} 
              />
            </button>
          </div>

          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar className={cn("w-10 h-10", avatarColors[colorIndex])}>
              <AvatarFallback className="text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-cyan-400">
                  {email.from_name || (email.from_wallet ? `${email.from_wallet.slice(0, 8)}...` : email.from_email?.split('@')[0])}
                </span>
                <span className="text-sm text-gray-400 break-all">
                  {email.from_wallet || email.from_email}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                to {email.to_name || (email.to_wallet ? `${email.to_wallet.slice(0, 8)}...${email.to_wallet.slice(-6)}` : email.to_email || 'me')}
              </div>
            </div>

            <div className="text-sm text-gray-400 flex-shrink-0">
              {format(new Date(email.created_date), 'MMM d, yyyy, h:mm a')}
            </div>
          </div>

          {/* Body */}
          <div 
            className="prose prose-sm max-w-none text-gray-300 leading-relaxed prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />

          {/* Attachments */}
          {email.attachments?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-cyan-500/20">
              <h3 className="text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                {email.attachments.length} Attachment{email.attachments.length > 1 ? 's' : ''}
              </h3>
              <div className="flex flex-wrap gap-3">
                {email.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-lg border border-cyan-500/30 hover:bg-cyan-500/10 hover:border-cyan-400 transition-colors"
                  >
                    <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center">
                      <span className="text-black text-xs font-bold">
                        {attachment.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[150px]">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Download'}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-cyan-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Bar */}
      <div className="px-6 py-4 border-t border-cyan-500/20">
        <div className="max-w-4xl flex gap-3">
          <Button 
            variant="outline" 
            onClick={onReply}
            className="rounded-full px-6 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400"
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" className="rounded-full px-6 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400">
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}