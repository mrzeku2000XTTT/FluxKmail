import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  RefreshCw, MoreVertical, ChevronLeft, ChevronRight,
  Archive, AlertOctagon, Trash2, Mail, Clock, Tag
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
  onArchive,
  onSpam,
  onDelete,
  onMarkRead,
  isRefreshing = false
}) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-1">
        <Checkbox 
          checked={isAllSelected}
          onCheckedChange={onSelectAll}
          className="data-[state=checked]:bg-[#1A73E8] data-[state=checked]:border-[#1A73E8]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-6">
              <ChevronLeft className="w-4 h-4 rotate-[-90deg]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All</DropdownMenuItem>
            <DropdownMenuItem>None</DropdownMenuItem>
            <DropdownMenuItem>Read</DropdownMenuItem>
            <DropdownMenuItem>Unread</DropdownMenuItem>
            <DropdownMenuItem>Starred</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedCount > 0 ? (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onArchive} className="rounded-full" title="Archive">
            <Archive className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSpam} className="rounded-full" title="Report spam">
            <AlertOctagon className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="rounded-full" title="Delete">
            <Trash2 className="w-5 h-5" />
          </Button>
          <div className="w-px h-5 bg-gray-300 mx-1" />
          <Button variant="ghost" size="icon" onClick={onMarkRead} className="rounded-full" title="Mark as read">
            <Mail className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" title="Snooze">
            <Clock className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" title="Labels">
            <Tag className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRefresh} 
          className="rounded-full"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      )}

      <Button variant="ghost" size="icon" className="rounded-full">
        <MoreVertical className="w-5 h-5" />
      </Button>

      <div className="flex-1" />

      <div className="flex items-center text-sm text-gray-600">
        <span>
          {totalEmails > 0 
            ? `1-${Math.min(50, totalEmails)} of ${totalEmails}`
            : 'No emails'
          }
        </span>
        <Button variant="ghost" size="icon" className="rounded-full ml-2" disabled>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}