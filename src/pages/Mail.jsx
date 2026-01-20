import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Header from '@/components/email/Header';
import Sidebar from '@/components/email/Sidebar';
import EmailToolbar from '@/components/email/EmailToolbar';
import EmailList from '@/components/email/EmailList';
import EmailViewer from '@/components/email/EmailViewer';
import ComposeModal from '@/components/email/ComposeModal';
import Landing from './Landing';

export default function Mail() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const savedWallet = localStorage.getItem('kmail_wallet');
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, []);

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    localStorage.setItem('kmail_wallet', address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    localStorage.removeItem('kmail_wallet');
    queryClient.clear();
  };

  // Fetch emails
  const { data: emails = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['emails', activeFolder, searchQuery, walletAddress],
    queryFn: async () => {
      if (!walletAddress) return [];
      
      let filter = {};
      
      if (activeFolder === 'starred') {
        filter.is_starred = true;
        filter.to_wallet = walletAddress;
      } else if (activeFolder === 'sent') {
        filter.folder = 'sent';
        filter.from_wallet = walletAddress;
      } else if (activeFolder !== 'all') {
        filter.folder = activeFolder;
        filter.to_wallet = walletAddress;
      } else {
        // Show both sent and received
        const sent = await base44.entities.Email.filter({ from_wallet: walletAddress }, '-created_date');
        const received = await base44.entities.Email.filter({ to_wallet: walletAddress }, '-created_date');
        const allEmails = [...sent, ...received];
        return allEmails.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      }
      
      const allEmails = await base44.entities.Email.filter(filter, '-created_date');
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return allEmails.filter(email => 
          email.subject?.toLowerCase().includes(query) ||
          email.from_name?.toLowerCase().includes(query) ||
          email.from_wallet?.toLowerCase().includes(query) ||
          email.body?.toLowerCase().includes(query)
        );
      }
      
      return allEmails;
    },
    enabled: !!walletAddress
  });

  // Fetch labels
  const { data: labels = [] } = useQuery({
    queryKey: ['labels'],
    queryFn: () => base44.entities.Label.list(),
    enabled: !!walletAddress
  });

  // Calculate folder counts
  const { data: folderCounts = {} } = useQuery({
    queryKey: ['folderCounts', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return {};
      
      const allReceived = await base44.entities.Email.filter({ to_wallet: walletAddress });
      const allSent = await base44.entities.Email.filter({ from_wallet: walletAddress });
      
      const counts = {
        inbox: allReceived.filter(e => e.folder === 'inbox' && !e.is_read).length,
        starred: allReceived.filter(e => e.is_starred).length,
        sent: allSent.filter(e => e.folder === 'sent').length,
        drafts: allReceived.filter(e => e.folder === 'drafts').length,
        spam: allReceived.filter(e => e.folder === 'spam').length,
        trash: allReceived.filter(e => e.folder === 'trash').length,
      };
      return counts;
    },
    enabled: !!walletAddress
  });

  // Update email mutation
  const updateEmailMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Email.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['folderCounts'] });
    }
  });

  // Delete email mutation
  const deleteEmailMutation = useMutation({
    mutationFn: (id) => base44.entities.Email.update(id, { folder: 'trash' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['folderCounts'] });
      setSelectedEmail(null);
    }
  });

  // Send email mutation
  const sendEmailMutation = useMutation({
    mutationFn: async (emailData) => {
      // Create sent email
      await base44.entities.Email.create({
        from_wallet: walletAddress,
        from_name: emailData.fromName || '',
        to_wallet: emailData.to,
        subject: emailData.subject,
        body: emailData.body.replace(/\n/g, '<br>'),
        preview: emailData.body.substring(0, 100),
        folder: 'sent',
        is_read: true
      });
      
      // Create received email for recipient
      return base44.entities.Email.create({
        from_wallet: walletAddress,
        from_name: emailData.fromName || '',
        to_wallet: emailData.to,
        subject: emailData.subject,
        body: emailData.body.replace(/\n/g, '<br>'),
        preview: emailData.body.substring(0, 100),
        folder: 'inbox',
        is_read: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['folderCounts'] });
      setShowCompose(false);
      setReplyTo(null);
    }
  });

  const handleSelectEmail = async (email) => {
    setSelectedEmail(email);
    if (!email.is_read && email.to_wallet === walletAddress) {
      updateEmailMutation.mutate({ id: email.id, data: { is_read: true } });
    }
  };

  const handleStarEmail = (email) => {
    updateEmailMutation.mutate({ 
      id: email.id, 
      data: { is_starred: !email.is_starred } 
    });
  };

  const handleToggleSelect = (emailId) => {
    setSelectedEmails(prev => 
      prev.includes(emailId) 
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map(e => e.id));
    }
  };

  const handleBulkDelete = () => {
    selectedEmails.forEach(id => {
      deleteEmailMutation.mutate(id);
    });
    setSelectedEmails([]);
  };

  const handleBulkMarkRead = () => {
    selectedEmails.forEach(id => {
      updateEmailMutation.mutate({ id, data: { is_read: true } });
    });
    setSelectedEmails([]);
  };

  const handleReply = () => {
    setReplyTo(selectedEmail);
    setShowCompose(true);
  };

  if (!walletAddress) {
    return <Landing />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69506fa02c99223b93dc5a26/449cf3baf_image.png)' }}>
      <div className="h-screen flex flex-col bg-black/60 backdrop-blur-sm overflow-hidden">
        <Header 
        walletAddress={walletAddress}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => refetch()}
        onDisconnect={handleWalletDisconnect}
      />

        <div className="flex-1 flex overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            activeFolder={activeFolder}
            onFolderChange={(folder) => {
              setActiveFolder(folder);
              setSelectedEmail(null);
              setSelectedEmails([]);
            }}
            onCompose={() => {
              setReplyTo(null);
              setShowCompose(true);
            }}
            labels={labels}
            folderCounts={folderCounts}
          />
        )}

        <main className="flex-1 flex flex-col bg-gray-900 rounded-tl-2xl overflow-hidden shadow-[0_0_20px_rgba(0,217,255,0.2)] border-t border-l border-cyan-500/20">
          {selectedEmail ? (
            <EmailViewer
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onStar={handleStarEmail}
              onReply={handleReply}
              onDelete={() => deleteEmailMutation.mutate(selectedEmail.id)}
            />
          ) : (
            <>
              <EmailToolbar
                selectedCount={selectedEmails.length}
                onRefresh={() => refetch()}
                onSelectAll={handleSelectAll}
                isAllSelected={selectedEmails.length === emails.length && emails.length > 0}
                totalEmails={emails.length}
                currentPage={1}
                onDelete={handleBulkDelete}
                onMarkRead={handleBulkMarkRead}
                isRefreshing={isRefetching}
              />
              <EmailList
                emails={emails}
                selectedEmail={selectedEmail}
                onSelectEmail={handleSelectEmail}
                onStarEmail={handleStarEmail}
                selectedEmails={selectedEmails}
                onToggleSelect={handleToggleSelect}
              />
            </>
          )}
        </main>
        </div>

        <ComposeModal
        isOpen={showCompose}
        onClose={() => {
          setShowCompose(false);
          setReplyTo(null);
        }}
        onSend={(data) => sendEmailMutation.mutate(data)}
        replyTo={replyTo}
        isSending={sendEmailMutation.isPending}
      />
      </div>
    </div>
  );
}