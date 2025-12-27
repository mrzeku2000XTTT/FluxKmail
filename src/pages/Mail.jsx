import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import Header from '@/components/email/Header';
import Sidebar from '@/components/email/Sidebar';
import EmailToolbar from '@/components/email/EmailToolbar';
import EmailList from '@/components/email/EmailList';
import EmailViewer from '@/components/email/EmailViewer';
import ComposeModal from '@/components/email/ComposeModal';

export default function Mail() {
  const [user, setUser] = useState(null);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await base44.auth.me();
      setUser(userData);
    };
    loadUser();
  }, []);

  // Fetch emails
  const { data: emails = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['emails', activeFolder, searchQuery],
    queryFn: async () => {
      let filter = {};
      
      if (activeFolder === 'starred') {
        filter.is_starred = true;
      } else if (activeFolder !== 'all') {
        filter.folder = activeFolder;
      }
      
      const allEmails = await base44.entities.Email.filter(filter, '-created_date');
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return allEmails.filter(email => 
          email.subject?.toLowerCase().includes(query) ||
          email.from_name?.toLowerCase().includes(query) ||
          email.from_email?.toLowerCase().includes(query) ||
          email.body?.toLowerCase().includes(query)
        );
      }
      
      return allEmails;
    }
  });

  // Fetch labels
  const { data: labels = [] } = useQuery({
    queryKey: ['labels'],
    queryFn: () => base44.entities.Label.list()
  });

  // Calculate folder counts
  const { data: folderCounts = {} } = useQuery({
    queryKey: ['folderCounts'],
    queryFn: async () => {
      const allEmails = await base44.entities.Email.filter({});
      const counts = {
        inbox: allEmails.filter(e => e.folder === 'inbox' && !e.is_read).length,
        starred: allEmails.filter(e => e.is_starred).length,
        sent: allEmails.filter(e => e.folder === 'sent').length,
        drafts: allEmails.filter(e => e.folder === 'drafts').length,
        spam: allEmails.filter(e => e.folder === 'spam').length,
        trash: allEmails.filter(e => e.folder === 'trash').length,
      };
      return counts;
    }
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
      return base44.entities.Email.create({
        from_email: user?.email,
        from_name: user?.full_name,
        to_email: emailData.to,
        subject: emailData.subject,
        body: emailData.body.replace(/\n/g, '<br>'),
        preview: emailData.body.substring(0, 100),
        folder: 'sent',
        is_read: true
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
    if (!email.is_read) {
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

  return (
    <div className="h-screen flex flex-col bg-[#F6F8FC] overflow-hidden">
      <Header 
        user={user}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={() => refetch()}
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

        <main className="flex-1 flex flex-col bg-white rounded-tl-2xl overflow-hidden shadow-sm">
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
  );
}