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
    <aside className="w-64 h-full bg-[#F6F8FC] flex flex-col py-4 px-3">
      <Button 
        onClick={onCompose}
        className="mb-4 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg transition-all duration-200 border-0 h-14 px-6 flex items-center gap-3"
      >
        <Pencil className="w-5 h-5 text-gray-600" />
        <span className="text-base font-medium">Compose</span>
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
                  ? "bg-[#D3E3FD] text-[#001D35] font-semibold" 
                  : "text-gray-700 hover:bg-gray-200/60"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "text-[#001D35]")} />
              <span className="flex-1 text-left">{folder.name}</span>
              {count > 0 && (
                <span className="text-xs font-semibold">{count}</span>
              )}
            </button>
          );
        })}

        <div className="pt-6 pb-2 px-4">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <ChevronDown className="w-4 h-4" />
            <span className="font-medium">Labels</span>
          </button>
        </div>

        {labels.map((label) => (
          <button
            key={label.id}
            className="w-full flex items-center gap-4 px-4 py-2 rounded-r-full transition-all duration-150 text-sm text-gray-700 hover:bg-gray-200/60"
          >
            <Tag className="w-5 h-5" style={{ color: label.color }} />
            <span className="flex-1 text-left">{label.name}</span>
          </button>
        ))}

        <button className="w-full flex items-center gap-4 px-4 py-2 rounded-r-full transition-all duration-150 text-sm text-gray-500 hover:bg-gray-200/60">
          <Plus className="w-5 h-5" />
          <span>Create new label</span>
        </button>
      </nav>
    </aside>
  );
}