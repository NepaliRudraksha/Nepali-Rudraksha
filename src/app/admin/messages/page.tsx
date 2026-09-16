'use client';

import { useState, useEffect, useCallback } from 'react';
import { getContactMessages, updateMessageStatus, ContactMessage, isSupabaseConfigured } from '@/lib/api';
import { Mail, Loader2, CheckCircle, Clock, Search, Eye, X, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const supabaseReady = isSupabaseConfigured();

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const data = await getContactMessages();
    setMessages(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filtered = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    setUpdatingId(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    const result = await updateMessageStatus(id, status);
    if (result.error) {
      await loadMessages();
    }
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage((prev) => prev ? { ...prev, status } : null);
    }
    setUpdatingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md"><Clock size={12} /> Unread</span>;
      case 'read':
        return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-blue-100 text-blue-800 rounded-md"><Eye size={12} /> Read</span>;
      case 'replied':
        return <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded-md"><CheckCircle size={12} /> Replied</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      {!supabaseReady && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Database Not Connected:</strong> Displaying empty list.
          </p>
        </div>
      )}

      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <div className="bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3 min-w-[150px]">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Mail size={20} /></div>
            <div>
              <p className="text-xs text-brand-muted font-medium">Unread</p>
              <p className="text-xl font-bold text-brand-primary">{messages.filter(m => m.status === 'unread').length}</p>
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-xl p-4 flex items-center gap-3 min-w-[150px]">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><MessageCircle size={20} /></div>
            <div>
              <p className="text-xs text-brand-muted font-medium">Total Messages</p>
              <p className="text-xl font-bold text-brand-primary">{messages.length}</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={loadMessages}
          className="flex items-center gap-2 text-brand-muted border border-brand-border font-bold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors text-sm bg-white"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Refresh Inbox
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-brand-border rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center border border-brand-border rounded-lg px-3 py-2 flex-1">
          <Search size={16} className="text-brand-muted mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border border-brand-border rounded-lg px-3 py-2 outline-none text-sm bg-white"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-brand-muted">
            <Loader2 size={32} className="animate-spin text-brand-accent" />
            <span className="text-sm font-medium">Loading inbox...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-light border-b border-brand-border text-brand-primary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Sender</th>
                  <th className="px-4 py-3 font-semibold">Subject</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-gray-50 transition-colors ${msg.status === 'unread' ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <p className={`font-medium ${msg.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</p>
                      <p className="text-xs text-gray-400">{msg.email}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-gray-700">
                      {msg.subject}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(msg.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          if (msg.status === 'unread') {
                            handleUpdateStatus(msg.id, 'read');
                          }
                        }}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded bg-brand-light text-brand-primary hover:bg-brand-accent hover:text-white transition-colors text-xs font-bold border border-brand-border"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-400">
                <Mail size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No messages found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-brand-light border-b border-brand-border p-4 px-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-primary flex items-center gap-2">
                <Mail size={18} className="text-brand-accent" /> Message Details
              </h2>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selectedMessage.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm font-medium text-gray-700">{selectedMessage.name}</p>
                    <span className="text-gray-300">&bull;</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-sm text-brand-secondary hover:underline">{selectedMessage.email}</a>
                  </div>
                  {selectedMessage.phone && (
                    <p className="text-xs text-gray-500 mt-1">Phone: {selectedMessage.phone}</p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-400 mb-2">{new Date(selectedMessage.created_at).toLocaleString()}</p>
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 min-h-[150px] mb-6">
                <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex items-center justify-between bg-brand-light/50 p-4 rounded-xl border border-brand-border">
                <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Update Status</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                    disabled={updatingId === selectedMessage.id || selectedMessage.status === 'read'}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                      selectedMessage.status === 'read' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Eye size={14} /> Mark as Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                    disabled={updatingId === selectedMessage.id || selectedMessage.status === 'replied'}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                      selectedMessage.status === 'replied' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-brand-primary text-white hover:bg-[#1a251d] border-transparent'
                    }`}
                  >
                    <CheckCircle size={14} /> Mark as Replied
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
