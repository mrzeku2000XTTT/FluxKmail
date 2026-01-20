import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Menu, Search, HelpCircle, Settings, Grid3X3, X, SlidersHorizontal, Wallet 
} from 'lucide-react';
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

  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : '';

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
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
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">K</span>
        </div>
        <span className="text-[22px] bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">Kmail</span>
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
            <Button variant="ghost" className="rounded-full ml-2 px-4 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200">
              <Wallet className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">{shortAddress}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-4 text-center border-b">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <p className="font-medium">Connected Wallet</p>
              <p className="text-sm text-gray-500 break-all">{walletAddress}</p>
            </div>
            <DropdownMenuItem className="py-3">View on Explorer</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDisconnect} className="py-3 text-red-600">
              Disconnect Wallet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}