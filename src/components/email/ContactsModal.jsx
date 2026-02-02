import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Trash2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactsModal({ isOpen, onClose, recipientAddress, onSelectContact }) {
  const [newName, setNewName] = useState('');
  const [newAddress, setNewAddress] = useState(recipientAddress || '');
  const [isAdding, setIsAdding] = useState(false);
  const [walletAddress] = useState(() => localStorage.getItem('kmail_wallet'));

  const queryClient = useQueryClient();

  // Fetch contacts
  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      return base44.entities.Contact.filter({ owner_wallet: walletAddress }, '-created_date');
    },
    enabled: !!walletAddress && isOpen
  });

  // Add contact mutation
  const addContactMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setNewName('');
      setNewAddress('');
      setIsAdding(false);
      toast.success('Contact saved!');
    }
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Contact deleted');
    }
  });

  const handleAddContact = () => {
    if (!newAddress.trim()) return;
    
    addContactMutation.mutate({
      owner_wallet: walletAddress,
      contact_name: newName.trim() || 'Unnamed Contact',
      kaspa_address: newAddress.trim()
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400">Kaspa Contacts</DialogTitle>
        </DialogHeader>

        {/* Current Recipient (if replying) */}
        {recipientAddress && (
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg mb-4">
            <p className="text-xs text-cyan-400 mb-1">Replying to:</p>
            <div className="flex items-center justify-between">
              <code className="text-white font-mono text-sm">{recipientAddress}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(recipientAddress);
                  toast.success('Address copied!');
                }}
                className="text-cyan-400 hover:bg-cyan-500/20"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Add New Contact */}
        {isAdding && (
          <div className="space-y-3 p-4 bg-gray-800 rounded-lg border border-cyan-500/20">
            <Input
              placeholder="Contact name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-gray-900 border-cyan-500/30 text-white"
            />
            <Input
              placeholder="kaspa:... address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="bg-gray-900 border-cyan-500/30 text-white font-mono"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddContact}
                disabled={!newAddress.trim() || addContactMutation.isPending}
                className="bg-cyan-500 hover:bg-cyan-400 text-black flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Save Contact
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewName('');
                  setNewAddress(recipientAddress || '');
                }}
                className="text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Contact
          </Button>
        )}

        {/* Contacts List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {contacts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No contacts saved yet</p>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-cyan-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">{contact.contact_name}</h4>
                      <code className="text-xs text-gray-400 font-mono break-all">
                        {contact.kaspa_address}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(contact.kaspa_address);
                          toast.success('Address copied!');
                        }}
                        className="text-cyan-400 hover:bg-cyan-500/20"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onSelectContact(contact.kaspa_address)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-black"
                      >
                        Use
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteContactMutation.mutate(contact.id)}
                        className="text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}