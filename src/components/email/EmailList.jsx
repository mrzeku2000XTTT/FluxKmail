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
      <div className="flex-1 flex items-center justify-center text-gray-400">
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
            "flex items-center gap-2 px-4 py-2 border-b border-gray-100 cursor-pointer transition-colors duration-100 group",
            selectedEmail?.id === email.id && "bg-[#C2E7FF]/50",
            !email.is_read && "bg-white",
            email.is_read && "bg-[#F6F8FC]",
            "hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] hover:z-10 hover:relative"
          )}
        >
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Checkbox 
              checked={selectedEmails.includes(email.id)}
              onCheckedChange={() => onToggleSelect(email.id)}
              className="data-[state=checked]:bg-[#1A73E8] data-[state=checked]:border-[#1A73E8]"
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStarEmail(email);
              }}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <Star 
                className={cn(
                  "w-5 h-5 transition-colors",
                  email.is_starred 
                    ? "fill-[#F4B400] text-[#F4B400]" 
                    : "text-gray-400 hover:text-gray-600"
                )} 
              />
            </button>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-4">
            <span className={cn(
              "w-48 truncate text-sm",
              !email.is_read && "font-semibold text-gray-900"
            )}>
              {email.from_name || (email.from_wallet ? `${email.from_wallet.slice(0, 8)}...${email.from_wallet.slice(-6)}` : email.from_email)}
            </span>

            <div className="flex-1 min-w-0 flex items-baseline gap-2">
              <span className={cn(
                "truncate text-sm",
                !email.is_read && "font-semibold text-gray-900"
              )}>
                {email.subject}
              </span>
              <span className="text-gray-500 text-sm truncate">
                — {email.preview}
              </span>
            </div>

            {email.attachments?.length > 0 && (
              <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}

            <span className={cn(
              "text-xs flex-shrink-0 w-16 text-right",
              !email.is_read ? "font-semibold text-gray-900" : "text-gray-500"
            )}>
              {formatEmailDate(email.created_date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}