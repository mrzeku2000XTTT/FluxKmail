import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Inbox, Send, FileText, Trash2, AlertOctagon, Star, 
  Tag, Plus, Pencil, ChevronDown 
} from 'lucide-react';
import { cn } from "@/lib/utils";

const folders = [
  { id: 'inbox', name: 'Inbox', icon: Inbox },
  { id: 'starred', name: 'Starred', icon: Star },
  { id: 'sent', name: 'Sent', icon: Send },
  { id: 'drafts', name: 'Drafts', icon: FileText },
  { id: 'spam', name: 'Spam', icon: AlertOctagon },
  { id: 'trash', name: 'Trash', icon: Trash2 },
];

export default function Sidebar({ 
  activeFolder, 
  onFolderChange, 
  onCompose, 
  labels = [],
  folderCounts = {}
}) {
  return (
    <aside className="w-64 h-full bg-black border-r border-cyan-500/20 flex flex-col py-4 px-3">
      <div className="flex justify-center mb-6">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/7e6911f88_image.png" 
          alt="Flux Kmail" 
          className="w-32 h-32 object-contain"
        />
      </div>
      
      <Button 
        onClick={onCompose}
        className="mb-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,217,255,0.5)] hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] transition-all duration-200 border-0 h-14 px-6 flex items-center gap-3"
      >
        <Pencil className="w-5 h-5 text-black" />
        <span className="text-base font-semibold">Compose</span>
      </Button>

      <nav className="flex-1 space-y-0.5">
        {folders.map((folder) => {
          const Icon = folder.icon;
          const isActive = activeFolder === folder.id;
          const count = folderCounts[folder.id] || 0;
          
          return (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-2 rounded-r-full transition-all duration-150 text-sm",
                isActive 
                  ? "bg-cyan-500/20 text-cyan-400 font-semibold border-r-2 border-cyan-400 shadow-[0_0_15px_rgba(0,217,255,0.3)]" 
                  : "text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-cyan-400")} />
              <span className="flex-1 text-left">{folder.name}</span>
              {count > 0 && (
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">{count}</span>
              )}
            </button>
          );
        })}

        <div className="pt-6 pb-2 px-4">
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400">
            <ChevronDown className="w-4 h-4" />
            <span className="font-medium">Labels</span>
          </button>
        </div>

        {labels.map((label) => (
          <button
            key={label.id}
            className="w-full flex items-center gap-4 px-4 py-2 rounded-r-full transition-all duration-150 text-sm text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400"
          >
            <Tag className="w-5 h-5 text-cyan-400" />
            <span className="flex-1 text-left">{label.name}</span>
          </button>
        ))}

        <button className="w-full flex items-center gap-4 px-4 py-2 rounded-r-full transition-all duration-150 text-sm text-gray-500 hover:bg-cyan-500/10 hover:text-cyan-400">
          <Plus className="w-5 h-5" />
          <span>Create new label</span>
        </button>
      </nav>
    </aside>
  );
}