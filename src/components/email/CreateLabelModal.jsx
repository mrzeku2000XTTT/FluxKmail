import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateLabelModal({ isOpen, onClose, onCreateLabel }) {
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('#00d9ff');

  const handleCreate = () => {
    if (labelName.trim()) {
      onCreateLabel({ name: labelName, color: labelColor });
      setLabelName('');
      setLabelColor('#00d9ff');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Create New Label</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Label Name</label>
            <Input
              value={labelName}
              onChange={(e) => setLabelName(e.target.value)}
              placeholder="Enter label name"
              className="bg-black border-cyan-500/30 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Label Color</label>
            <input
              type="color"
              value={labelColor}
              onChange={(e) => setLabelColor(e.target.value)}
              className="w-full h-10 rounded bg-black border border-cyan-500/30 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-cyan-500 hover:bg-cyan-400 text-black">
              Create Label
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}