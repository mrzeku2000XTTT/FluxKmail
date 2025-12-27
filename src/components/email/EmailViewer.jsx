import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft, Star, Archive, Trash2, Clock, MoreVertical,
  Reply, Forward, Printer, ExternalLink, Paperclip, Download
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

export default function EmailViewer({ email, onBack, onStar, onReply, onDelete }) {
  if (!email) return null;

  const initials = (email.from_name || email.from_email)
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const colorIndex = email.from_email.charCodeAt(0) % avatarColors.length;

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Archive className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={onDelete}>
          <Trash2 className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Clock className="w-5 h-5" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Printer className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ExternalLink className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="max-w-4xl">
          {/* Subject */}
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl font-normal text-gray-900">{email.subject}</h1>
            <button 
              onClick={() => onStar(email)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <Star 
                className={cn(
                  "w-5 h-5",
                  email.is_starred 
                    ? "fill-[#F4B400] text-[#F4B400]" 
                    : "text-gray-400"
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
                <span className="font-medium text-gray-900">
                  {email.from_name || email.from_email.split('@')[0]}
                </span>
                <span className="text-sm text-gray-500">
                  &lt;{email.from_email}&gt;
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-0.5">
                to {email.to_name || email.to_email || 'me'}
              </div>
            </div>

            <div className="text-sm text-gray-500 flex-shrink-0">
              {format(new Date(email.created_date), 'MMM d, yyyy, h:mm a')}
            </div>
          </div>

          {/* Body */}
          <div 
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />

          {/* Attachments */}
          {email.attachments?.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
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
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-[#EA4335] rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {attachment.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {attachment.size ? `${(attachment.size / 1024).toFixed(1)} KB` : 'Download'}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Bar */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="max-w-4xl flex gap-3">
          <Button 
            variant="outline" 
            onClick={onReply}
            className="rounded-full px-6"
          >
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" className="rounded-full px-6">
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
}