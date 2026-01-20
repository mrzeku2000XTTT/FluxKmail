import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Paperclip } from 'lucide-react';
import { cn } from "@/lib/utils";
import { format, isToday, isThisYear } from 'date-fns';

function formatEmailDate(dateString) {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isThisYear(date)) {
    return format(date, 'MMM d');
  }
  return format(date, 'MM/dd/yy');
}

export default function EmailList({ 
  emails, 
  selectedEmail, 
  onSelectEmail, 
  onStarEmail,
  selectedEmails = [],
  onToggleSelect 
}) {
  if (emails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-cyan-400/50">
        <div className="text-center">
          <Paperclip className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">No emails here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {emails.map((email) => (
        <div
          key={email.id}
          onClick={() => onSelectEmail(email)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 border-b border-cyan-500/10 cursor-pointer transition-colors duration-100 group",
            selectedEmail?.id === email.id && "bg-cyan-500/20 border-l-2 border-l-cyan-400",
            !email.is_read && "bg-gray-900",
            email.is_read && "bg-black",
            "hover:bg-cyan-500/10 hover:border-l-2 hover:border-l-cyan-400/50 hover:z-10 hover:relative"
          )}
        >
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Checkbox 
              checked={selectedEmails.includes(email.id)}
              onCheckedChange={() => onToggleSelect(email.id)}
              className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 border-cyan-500/30"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStarEmail(email);
              }}
              className="p-1 hover:bg-cyan-500/20 rounded-full transition-colors"
            >
              <Star 
                className={cn(
                  "w-5 h-5 transition-colors",
                  email.is_starred 
                    ? "fill-cyan-400 text-cyan-400" 
                    : "text-gray-600 hover:text-cyan-400"
                )} 
              />
            </button>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-4">
            <span className={cn(
              "w-48 truncate text-sm",
              !email.is_read && "font-semibold text-cyan-400"
            )}>
              {email.from_name || (email.from_wallet ? `${email.from_wallet.slice(0, 8)}...${email.from_wallet.slice(-6)}` : email.from_email)}
            </span>

            <div className="flex-1 min-w-0 flex items-baseline gap-2">
              <span className={cn(
                "truncate text-sm",
                !email.is_read ? "font-semibold text-white" : "text-gray-400"
              )}>
                {email.subject}
              </span>
              <span className="text-gray-500 text-sm truncate">
                — {email.preview}
              </span>
            </div>

            {email.attachments?.length > 0 && (
              <Paperclip className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            )}

            <span className={cn(
              "text-xs flex-shrink-0 w-16 text-right",
              !email.is_read ? "font-semibold text-cyan-400" : "text-gray-500"
            )}>
              {formatEmailDate(email.created_date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}