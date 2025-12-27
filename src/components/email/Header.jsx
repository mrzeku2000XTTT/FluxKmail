import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, Search, HelpCircle, Settings, Grid3X3, X, SlidersHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { base44 } from '@/api/base44Client';

export default function Header({ 
  user, 
  onMenuToggle, 
  searchQuery, 
  onSearchChange,
  onSearch
}) {
  const [isFocused, setIsFocused] = useState(false);

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <header className="h-16 bg-[#F6F8FC] flex items-center px-4 gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuToggle}
        className="rounded-full"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </Button>

      <a href="/" className="flex items-center gap-2 mr-4">
        <svg viewBox="0 0 75 24" className="h-6">
          <path fill="#EA4335" d="M7.5 12.5L0 6v12z"/>
          <path fill="#34A853" d="M22.5 6L15 12.5 22.5 19z"/>
          <path fill="#FBBC04" d="M22.5 6H7.5l7.5 6.5z"/>
          <path fill="#4285F4" d="M7.5 6v13l7.5-6.5z"/>
          <path fill="#C5221F" d="M7.5 19h15L15 12.5z"/>
        </svg>
        <span className="text-[22px] text-gray-600 font-normal">Gmail</span>
      </a>

      <div className={`flex-1 max-w-2xl relative transition-all duration-200 ${
        isFocused ? 'shadow-lg' : ''
      }`}>
        <div className={`flex items-center bg-${isFocused ? 'white' : '[#EAF1FB]'} rounded-full transition-colors`}>
          <button className="p-3" onClick={onSearch}>
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <Input
            type="text"
            placeholder="Search mail"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-base placeholder:text-gray-500"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="p-2 hover:bg-gray-100 rounded-full mr-1"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <button className="p-3">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="w-5 h-5 text-gray-600" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Grid3X3 className="w-5 h-5 text-gray-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ml-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#1A73E8] text-white text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 text-center border-b">
              <Avatar className="w-16 h-16 mx-auto mb-3">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#1A73E8] text-white text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium">{user?.full_name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <DropdownMenuItem className="py-3">Manage your Google Account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="py-3 text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}