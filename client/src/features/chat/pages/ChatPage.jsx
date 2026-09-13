import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquareOff } from 'lucide-react';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { useSocket } from '@/hooks/useSocket';

export default function ChatPage() {
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListOnMobile, setShowListOnMobile] = useState(!conversationId);
  const { socket } = useSocket();

  useEffect(() => {
    fetchConversations();
  }, []);

  const markAsRead = async (id) => {
    // Check if it's a seed conversation, skip API if so
    if (id.startsWith('seed-')) {
      updateConversation(id, { unreadCount: 0 });
      return;
    }
    
    try {
      // Optimistic update
      updateConversation(id, { unreadCount: 0 });
      await api.patch(`/chat/conversations/${id}/read`);
    } catch (error) {
      console.error('Failed to mark conversation as read:', error);
    }
  };

  useEffect(() => {
    if (conversationId) {
      setShowListOnMobile(false);
      markAsRead(conversationId);
    } else {
      setShowListOnMobile(true);
    }
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/conversations');
      let fetched = res.data?.data?.conversations || [];
      
      if (fetched.length === 0) {
        // Fallback to seeded marketplace conversations if database is empty
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const sep11 = new Date(today.getFullYear(), 8, 11);
        const sep10 = new Date(today.getFullYear(), 8, 10);
        const sep9 = new Date(today.getFullYear(), 8, 9);
        
        const am1042 = new Date();
        am1042.setHours(10, 42, 0);

        fetched = [
          {
            _id: 'seed-1',
            participants: [{ _id: 'u1', name: 'Aarav Mehta', avatar: '/freelancers/aarav-mehta.webp' }],
            otherUser: { _id: 'u1', name: 'Aarav Mehta', avatar: '/freelancers/aarav-mehta.webp' },
            job: { title: 'CRM Dashboard' },
            lastMessage: { content: "Sure, I'll send the GitHub update once it's ready.", createdAt: am1042 },
            unreadCount: 2
          },
          {
            _id: 'seed-2',
            participants: [{ _id: 'u2', name: 'Neha Singh', avatar: '/freelancers/neha-singh.webp' }],
            otherUser: { _id: 'u2', name: 'Neha Singh', avatar: '/freelancers/neha-singh.webp' },
            job: { title: 'UI Redesign' },
            lastMessage: { content: "That sounds good. Let's keep the WorkStation branding consistent across all pages.", createdAt: yesterday },
            unreadCount: 0
          },
          {
            _id: 'seed-3',
            participants: [{ _id: 'u3', name: 'Priya Kapoor', avatar: '/freelancers/priya-kapoor.webp' }],
            otherUser: { _id: 'u3', name: 'Priya Kapoor', avatar: '/freelancers/priya-kapoor.webp' },
            job: { title: 'Mobile App' },
            lastMessage: { content: "Thanks. I'll start integrating them today.", createdAt: yesterday },
            unreadCount: 1
          },
          {
            _id: 'seed-4',
            participants: [{ _id: 'u4', name: 'Rohan Patel', avatar: '/freelancers/rohan-patel.webp' }],
            otherUser: { _id: 'u4', name: 'Rohan Patel', avatar: '/freelancers/rohan-patel.webp' },
            job: { title: 'Portfolio Website' },
            lastMessage: { content: "SSL and domain redirects are already configured.", createdAt: sep11 },
            unreadCount: 0
          },
          {
            _id: 'seed-5',
            participants: [{ _id: 'u5', name: 'Karan Sharma', avatar: '/freelancers/karan-sharma.webp' }],
            otherUser: { _id: 'u5', name: 'Karan Sharma', avatar: '/freelancers/karan-sharma.webp' },
            job: { title: 'E-commerce Store' },
            lastMessage: { content: "No problem. Everything is documented in the invoice notes.", createdAt: sep10 },
            unreadCount: 0
          },
          {
            _id: 'seed-6',
            participants: [{ _id: 'u6', name: 'Ananya Verma', avatar: '/freelancers/ananya-verma.webp' }],
            otherUser: { _id: 'u6', name: 'Ananya Verma', avatar: '/freelancers/ananya-verma.webp' },
            job: { title: 'SEO Audit' },
            lastMessage: { content: "Definitely. I'll get back to you after reviewing the report.", createdAt: sep9 },
            unreadCount: 0
          }
        ];
      }
      setConversations(fetched);
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const updateConversation = useCallback((id, updates) => {
    setConversations(prev => {
      const idx = prev.findIndex(conv => conv._id === id);
      if (idx === -1) return prev;
      
      const updatedConv = { ...prev[idx], ...updates };
      
      // If there's a new message or unread count, bring to top
      if (updates.lastMessage || updates.unreadCount !== undefined) {
        const newArray = [...prev];
        newArray.splice(idx, 1);
        newArray.unshift(updatedConv);
        return newArray;
      }
      
      return prev.map(conv => conv._id === id ? updatedConv : conv);
    });
  }, []);

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return;

    const handleConversationUpdated = (data) => {
      // If we are currently in this conversation, and a new message arrives, we should immediately read it
      if (data.conversationId === conversationId && data.unreadCount > 0) {
        updateConversation(data.conversationId, { lastMessage: data.lastMessage, unreadCount: 0 });
        socket.emit('mark_read', { conversationId });
      } else {
        updateConversation(data.conversationId, data);
      }
    };

    socket.on('conversation_updated', handleConversationUpdated);

    return () => {
      if (socket && typeof socket.off === 'function') {
        socket.off('conversation_updated', handleConversationUpdated);
      }
    };
  }, [socket, conversationId, updateConversation]);

  return (
    <div className="h-[calc(100vh-64px)] max-h-screen bg-slate-50 dark:bg-slate-950 flex overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-[320px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 flex flex-col transition-transform ${!showListOnMobile ? 'hidden md:flex' : 'flex'}`}>
        <ConversationList 
          conversations={conversations} 
          loading={loading}
          activeId={conversationId}
        />
      </div>

      {/* Main Area - Chat Window */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${showListOnMobile ? 'hidden md:flex' : 'flex'}`}>
        {conversationId ? (
          <ChatWindow 
            conversationId={conversationId} 
            onBack={() => setShowListOnMobile(true)}
            onUpdateConversation={updateConversation}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquareOff size={32} className="text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Your Messages</h2>
            <p>Select a conversation from the sidebar to start chatting or view previous messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
