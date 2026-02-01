import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AVATAR_GRID_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/4d544e35d_image.png";

export default function AvatarSelector({ isOpen, onClose, onSelect, currentAvatar }) {
  const avatars = Array.from({ length: 16 }, (_, i) => i);

  const getAvatarStyle = (index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    return {
      backgroundImage: `url(${AVATAR_GRID_URL})`,
      backgroundSize: '400% 400%',
      backgroundPosition: `${(col / 3) * 100}% ${(row / 3) * 100}%`
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400">Choose Your Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-4 gap-4 p-2">
          {avatars.map((index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                "relative w-full aspect-square rounded-full overflow-hidden border-4 transition-all hover:scale-105 bg-gray-800",
                currentAvatar === index 
                  ? "border-cyan-400 shadow-[0_0_20px_rgba(0,217,255,0.6)]" 
                  : "border-cyan-500/30 hover:border-cyan-400/50"
              )}
            >
              <div 
                className="w-full h-full bg-cover bg-center"
                style={getAvatarStyle(index)}
              />
              {currentAvatar === index && (
                <div className="absolute inset-0 bg-cyan-400/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center">
                    <span className="text-black font-bold text-lg">✓</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}