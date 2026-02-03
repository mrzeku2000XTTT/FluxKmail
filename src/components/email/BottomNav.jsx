import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Inbox, Send, FileText, Trash2, AlertOctagon, Star, Pencil, Settings
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const navItems = [
  { id: 'inbox', name: 'Inbox', icon: Inbox },
  { id: 'starred', name: 'Starred', icon: Star },
  { id: 'sent', name: 'Sent', icon: Send },
  { id: 'drafts', name: 'Drafts', icon: FileText },
  { id: 'trash', name: 'Trash', icon: Trash2 },
];

export default function BottomNav({ 
  activeFolder, 
  onFolderChange, 
  onCompose, 
  folderCounts = {}
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-cyan-500/20 px-2 py-2 flex items-center justify-around z-50 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeFolder === item.id;
        const count = folderCounts[item.id] || 0;
        
        return (
          <button
            key={item.id}
            onClick={() => onFolderChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-150 relative",
              isActive 
                ? "text-cyan-400" 
                : "text-gray-400"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive && "text-cyan-400")} />
            <span className="text-[10px] font-medium">{item.name}</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {count}
              </span>
            )}
          </button>
        );
      })}
      
      <button
        onClick={onCompose}
        className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-cyan-400 bg-cyan-500/20"
      >
        <Pencil className="w-5 h-5" />
        <span className="text-[10px] font-medium">Compose</span>
      </button>

      <Link to={createPageUrl('Settings')} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-gray-400">
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-medium">Settings</span>
      </Link>
    </nav>
  );
}