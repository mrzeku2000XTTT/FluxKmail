import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, Search, HelpCircle, Grid3X3, X, SlidersHorizontal, Wallet, Settings 
} from 'lucide-react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function Header({ 
  walletAddress,
  onMenuToggle, 
  searchQuery, 
  onSearchChange,
  onSearch,
  onDisconnect
}) {
  const [isFocused, setIsFocused] = useState(false);

  const { data: isAdmin = false } = useQuery({
    queryKey: ['isAdmin', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return false;
      const admins = await base44.entities.Admin.filter({ wallet_address: walletAddress });
      return admins.length > 0;
    },
    enabled: !!walletAddress
  });

  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return (
    <header className="h-16 bg-black border-b border-cyan-500/20 flex items-center px-2 md:px-4 gap-1 md:gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuToggle}
        className="rounded-full hidden md:flex"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </Button>

      <a href="/" className="flex items-center gap-2 mr-2 md:mr-4 flex-shrink-0">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/7e6911f88_image.png" 
          alt="Flux Kmail" 
          className="h-8 md:h-12"
        />
      </a>

      <div className={`flex-1 max-w-2xl relative transition-all duration-200 ${
        isFocused ? 'shadow-[0_0_20px_rgba(0,217,255,0.3)]' : ''
      }`}>
        <div className={`flex items-center ${isFocused ? 'bg-gray-900 border-cyan-500' : 'bg-gray-900/50 border-cyan-500/30'} border rounded-full transition-colors`}>
          <button className="p-2 md:p-3" onClick={onSearch}>
            <Search className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          </button>
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 text-sm md:text-base text-white placeholder:text-gray-400"
          />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="p-1 md:p-2 hover:bg-cyan-500/20 rounded-full mr-1"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
            </button>
          )}
          <button className="p-2 md:p-3 hidden md:block">
            <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20 hidden md:flex">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-cyan-500/20 hidden md:flex">
          <Grid3X3 className="w-5 h-5 text-cyan-400" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full ml-1 md:ml-2 px-2 md:px-4 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(0,217,255,0.3)]">
              <Wallet className="w-3 h-3 md:w-4 md:h-4 md:mr-2 text-cyan-400" />
              <span className="text-xs md:text-sm font-medium text-cyan-400 hidden sm:inline">{shortAddress}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-gray-900 border-cyan-500/30">
            <div className="p-4 text-center border-b border-cyan-500/20">
              <div className="w-16 h-16 mx-auto mb-3 bg-black border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,217,255,0.5)]">
                <Wallet className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="font-medium text-white">Connected Wallet</p>
              <p className="text-sm text-cyan-400 break-all">{walletAddress}</p>
            </div>
            <DropdownMenuItem className="py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">View on Explorer</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-cyan-500/20" />
            {isAdmin && (
              <Link to={createPageUrl('Settings')}>
                <DropdownMenuItem className="py-3 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuItem onClick={handleDisconnect} className="py-3 text-cyan-400 font-medium hover:bg-cyan-500/20">
              Switch Account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDisconnect} className="py-3 text-red-400 hover:bg-red-500/20">
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}