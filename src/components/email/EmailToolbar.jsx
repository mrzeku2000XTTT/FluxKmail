import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  RefreshCw, MoreVertical, ChevronLeft, ChevronRight,
  AlertOctagon, Trash2, Mail, Clock, Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmailToolbar({ 
  selectedCount = 0, 
  onRefresh, 
  onSelectAll,
  isAllSelected,
  totalEmails,
  currentPage,
  onSpam,
  onDelete,
  onMarkRead,
  isRefreshing = false
}) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-cyan-500/20 bg-black">
      <div className="flex items-center gap-1">
        <Checkbox 
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
          className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 border-cyan-500/30"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-6 hover:bg-cyan-500/20">
              <ChevronLeft className="w-4 h-4 rotate-[-90deg] text-cyan-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-cyan-500/30">
            <DropdownMenuItem className="text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">All</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">None</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">Read</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">Unread</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">Starred</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCount > 0 ? (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onSpam} className="rounded-full hover:bg-cyan-500/20" title="Move to spam">
            <AlertOctagon className="w-5 h-5 text-cyan-400" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="rounded-full hover:bg-cyan-500/20" title="Move to trash">
            <Trash2 className="w-5 h-5 text-cyan-400" />
          </Button>
          <div className="w-px h-5 bg-cyan-500/30 mx-1" />
          <Button variant="ghost" size="icon" onClick={onMarkRead} className="rounded-full hover:bg-cyan-500/20" title="Mark as read">
            <Mail className="w-5 h-5 text-cyan-400" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20" title="Snooze">
            <Clock className="w-5 h-5 text-cyan-400" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20" title="Labels">
            <Tag className="w-5 h-5 text-cyan-400" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRefresh} 
          className="rounded-full hover:bg-cyan-500/20"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-5 h-5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}

      <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
        <MoreVertical className="w-5 h-5 text-cyan-400" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center text-sm text-gray-400">
        <span>
          {totalEmails > 0 
            ? `1-${Math.min(50, totalEmails)} of ${totalEmails}`
            : 'No emails'
          }
        </span>
        <Button variant="ghost" size="icon" className="rounded-full ml-2 hover:bg-cyan-500/20" disabled>
          <ChevronLeft className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20">
          <ChevronRight className="w-5 h-5 text-cyan-400" />
        </Button>
      </div>
    </div>
  );
}