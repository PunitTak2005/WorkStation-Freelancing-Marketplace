import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import Avatar from '@/components/common/Avatar';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn';

export default function ChatWindow({ conversationId, onBack, onUpdateConversation }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      if (socket && typeof socket.emit === 'function') {
        socket.emit('join_conversation', conversationId);
      }
    }
    
    return () => {
      if (socket && typeof socket.emit === 'function' && conversationId) {
        socket.emit('leave_conversation', conversationId);
      }
    };
  }, [conversationId, socket]);

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return;

    const handleNewMessage = (message) => {
      if (message.conversation === conversationId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Mark as read if conversation is open
        const senderId = message.sender?._id || message.sender;
        if (senderId !== user?._id && typeof socket.emit === 'function') {
          socket.emit('mark_read', { conversationId });
        }
      }
    };

    const handleMessagesRead = ({ conversationId: cId, readBy }) => {
      if (cId === conversationId && readBy !== user?._id) {
        setMessages(prev => prev.map(msg => 
          (msg.sender?._id === user?._id || msg.sender === user?._id) 
            ? { ...msg, isRead: true, status: 'read' } 
            : msg
        ));
      }
    };

    const handleTypingStart = ({ conversationId: cId, userId }) => {
      if (cId === conversationId && userId !== user?._id) setIsTyping(true);
    };

    const handleTypingStop = ({ conversationId: cId, userId }) => {
      if (cId === conversationId && userId !== user?._id) setIsTyping(false);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      if (socket && typeof socket.off === 'function') {
        socket.off('new_message', handleNewMessage);
        socket.off('messages_read', handleMessagesRead);
        socket.off('typing_start', handleTypingStart);
        socket.off('typing_stop', handleTypingStop);
      }
    };
  }, [socket, conversationId, user?._id]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      if (conversationId?.startsWith('seed-')) {
        // Fallback for seeded marketplace conversations
        const seedIndex = parseInt(conversationId.split('-')[1], 10);
        
        const seededUsers = {
          1: { _id: 'u1', name: 'Aarav Mehta', avatar: '/freelancers/aarav-mehta.webp' },
          2: { _id: 'u2', name: 'Neha Singh', avatar: '/freelancers/neha-singh.webp' },
          3: { _id: 'u3', name: 'Priya Kapoor', avatar: '/freelancers/priya-kapoor.webp' },
          4: { _id: 'u4', name: 'Rohan Patel', avatar: '/freelancers/rohan-patel.webp' },
          5: { _id: 'u5', name: 'Karan Sharma', avatar: '/freelancers/karan-sharma.webp' },
          6: { _id: 'u6', name: 'Ananya Verma', avatar: '/freelancers/ananya-verma.webp' }
        };
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const sep11 = new Date(today.getFullYear(), 8, 11);
        const sep10 = new Date(today.getFullYear(), 8, 10);
        const sep9 = new Date(today.getFullYear(), 8, 9);
        
        const other = seededUsers[seedIndex];
        setOtherUser(other);

        let history = [];
        
        if (seedIndex === 1) {
          history = [
            { _id: 'm1-1', sender: other, content: "I'll deliver the first milestone tonight.", createdAt: new Date(new Date().setHours(10, 42, 0)).toISOString() },
            { _id: 'm1-2', sender: { _id: user?._id }, content: "Perfect. Please include the responsive dashboard and login flow in this milestone.", createdAt: new Date(new Date().setHours(10, 45, 0)).toISOString(), status: 'read' },
            { _id: 'm1-3', sender: other, content: "Sure, I'll send the GitHub update once it's ready.", createdAt: new Date(new Date().setHours(10, 46, 0)).toISOString() }
          ];
        } else if (seedIndex === 2) {
          history = [
            { _id: 'm2-1', sender: other, content: "The revised mockups are ready.", createdAt: new Date(yesterday.setHours(16, 15, 0)).toISOString() },
            { _id: 'm2-2', sender: { _id: user?._id }, content: "Great. I'll review the homepage and dashboard screens first.", createdAt: new Date(yesterday.setHours(16, 18, 0)).toISOString(), status: 'read' },
            { _id: 'm2-3', sender: other, content: "I've also updated the color palette for dark mode.", createdAt: new Date(yesterday.setHours(16, 20, 0)).toISOString() },
            { _id: 'm2-4', sender: { _id: user?._id }, content: "That sounds good. Let's keep the WorkStation branding consistent across all pages.", createdAt: new Date(yesterday.setHours(16, 24, 0)).toISOString(), status: 'read' }
          ];
        } else if (seedIndex === 3) {
          history = [
            { _id: 'm3-1', sender: other, content: "Can you confirm the API endpoints?", createdAt: new Date(yesterday.setHours(11, 12, 0)).toISOString() },
            { _id: 'm3-2', sender: { _id: user?._id }, content: "Yes. I'll share the latest API documentation with authentication routes included.", createdAt: new Date(yesterday.setHours(11, 15, 0)).toISOString(), status: 'read' },
            { _id: 'm3-3', sender: other, content: "Thanks. I'll start integrating them today.", createdAt: new Date(yesterday.setHours(11, 18, 0)).toISOString() }
          ];
        } else if (seedIndex === 4) {
          history = [
            { _id: 'm4-1', sender: other, content: "Deployment completed successfully.", createdAt: new Date(yesterday.setHours(18, 40, 0)).toISOString() },
            { _id: 'm4-2', sender: { _id: user?._id }, content: "Excellent. I'll verify the live version and let you know if I notice anything.", createdAt: new Date(yesterday.setHours(18, 43, 0)).toISOString(), status: 'read' },
            { _id: 'm4-3', sender: other, content: "SSL and domain redirects are already configured.", createdAt: new Date(yesterday.setHours(18, 45, 0)).toISOString() }
          ];
        } else if (seedIndex === 5) {
          const twoDaysAgo = new Date(today);
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
          history = [
            { _id: 'm5-1', sender: other, content: "Invoice has been uploaded.", createdAt: new Date(twoDaysAgo.setHours(15, 5, 0)).toISOString() },
            { _id: 'm5-2', sender: { _id: user?._id }, content: "Received it. I'll approve the payment after reviewing the completed milestone.", createdAt: new Date(twoDaysAgo.setHours(15, 12, 0)).toISOString(), status: 'read' },
            { _id: 'm5-3', sender: other, content: "No problem. Everything is documented in the invoice notes.", createdAt: new Date(twoDaysAgo.setHours(15, 14, 0)).toISOString() }
          ];
        } else if (seedIndex === 6) {
          history = [
            { _id: 'm6-1', sender: other, content: "Hello, how is the project going?", createdAt: new Date(new Date().setHours(7, 29, 0)).toISOString() },
            { _id: 'm6-2', sender: { _id: user?._id }, content: "It's going well. We're finishing the final optimizations this week.", createdAt: new Date(new Date().setHours(7, 35, 0)).toISOString(), status: 'read' },
            { _id: 'm6-3', sender: other, content: "I've shared the report.", createdAt: new Date(new Date().setHours(8, 29, 0)).toISOString() },
            { _id: 'm6-4', sender: { _id: user?._id }, content: "Thanks. I'll review the keyword recommendations and implementation checklist today.", createdAt: new Date(new Date().setHours(8, 36, 0)).toISOString(), status: 'read' },
            { _id: 'm6-5', sender: other, content: "Let me know if you'd like a follow-up optimization round next week.", createdAt: new Date(new Date().setHours(8, 40, 0)).toISOString() },
            { _id: 'm6-6', sender: { _id: user?._id }, content: "Definitely. I'll get back to you after reviewing the report.", createdAt: new Date(new Date().setHours(8, 42, 0)).toISOString(), status: 'read' }
          ];
        }
        
        setMessages(history);
        
        scrollToBottom();
        return;
      }
      
      const res = await api.get(`/chat/messages/${conversationId}`);
      setMessages(res.data.data.messages);
      
      // We get otherUser info from a separate API or from the conversation details
      try {
        const convRes = await api.get(`/chat/conversations/${conversationId}`);
        const other = convRes.data.data.conversation.participants.find(p => p._id !== user._id);
        setOtherUser(other);
      } catch (err) {
        // Fallback if the route doesn't exist
      }
      
      scrollToBottom();
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && typeof socket.emit === 'function') {
      socket.emit('typing_start', { conversationId, userId: user?._id });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        if (socket && typeof socket.emit === 'function') {
          socket.emit('typing_stop', { conversationId, userId: user?._id });
        }
      }, 2000);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      if (socket && typeof socket.emit === 'function') {
        socket.emit('typing_stop', { conversationId, userId: user?._id });
      }
      
      if (conversationId?.startsWith('seed-')) {
        const msg = {
          _id: `m-seed-${Date.now()}`,
          sender: { _id: user?._id, name: user?.name, avatar: user?.avatar },
          content: newMessage,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        scrollToBottom();
        
        onUpdateConversation(conversationId, { 
          lastMessage: { content: msg.content, createdAt: msg.createdAt },
          updatedAt: msg.createdAt,
          unreadCount: 0
        });
        return;
      }
      
      const res = await api.post('/chat/messages', {
        conversationId,
        text: newMessage
      });
      
      const msg = res.data.data;
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
      scrollToBottom();
      
      onUpdateConversation(conversationId, { 
        lastMessage: msg,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = new Date(msg.createdAt).toLocaleDateString([], { 
        weekday: 'short', month: 'short', day: 'numeric' 
      });
      // Replace with 'Today' or 'Yesterday' if applicable
      const todayDate = new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      const yest = new Date();
      yest.setDate(yest.getDate() - 1);
      const yestDate = yest.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      
      let label = date;
      if (date === todayDate) label = 'Today';
      if (date === yestDate) label = 'Yesterday';
      
      if (!groups[label]) groups[label] = [];
      groups[label].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex h-full bg-[#E5DDD5] dark:bg-[#0B141A] relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 relative min-w-0">
        {/* Background Texture overlay */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-10 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

        {/* Chat Header */}
        <ChatHeader 
          otherUser={otherUser} 
          isTyping={isTyping} 
          onBack={onBack} 
        />

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-2 z-10 hide-scrollbar scroll-smooth">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A84FF]"></div>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([dateLabel, msgs], groupIndex) => (
              <React.Fragment key={dateLabel}>
                {/* Date Divider */}
                <div className="flex justify-center my-5">
                  <div className="bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 text-[13px] font-medium px-4 py-1.5 rounded-full shadow-sm">
                    {dateLabel}
                  </div>
                </div>
                
                {/* Messages in Date Group */}
                <div className="flex flex-col">
                  {msgs.map((msg, idx) => {
                    const isOwn = msg.sender?._id === user?._id;
                    const prevMsg = msgs[idx - 1];
                    const nextMsg = msgs[idx + 1];
                    const isFirst = !prevMsg || prevMsg.sender?._id !== msg.sender?._id;
                    const isLast = !nextMsg || nextMsg.sender?._id !== msg.sender?._id;
                    
                    // 10px between consecutive, 20px between groups
                    const marginTop = idx === 0 ? "mt-0" : (isFirst ? "mt-[20px]" : "mt-[10px]");

                    return (
                      <div key={msg._id} className={marginTop}>
                        <MessageBubble 
                          message={msg} 
                          isOwn={isOwn} 
                          isFirst={isFirst}
                          isLast={isLast}
                        />
                      </div>
                    );
                  })}
                </div>
              </React.Fragment>
            ))
          )}
          
          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-white dark:bg-[#1E293B] shadow-sm w-fit px-4 py-3 rounded-2xl rounded-tl-sm ml-2 mt-4"
              >
                <div className="flex gap-1.5 items-center">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="bg-[#F0F2F5] dark:bg-[#202C33] p-3 md:px-6 md:py-4 z-20 flex items-end gap-2 md:gap-3 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
          <button className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all mb-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          
          <div className="flex-1 bg-white dark:bg-[#2A3942] rounded-[24px] flex items-center min-h-[56px] px-2 shadow-sm border border-transparent dark:border-slate-700/50 group focus-within:border-[#0A84FF]/50 transition-colors">
            <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </button>
            <button className="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors hidden sm:block">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
            </button>

            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 py-3.5 px-3 text-[15px] text-slate-900 dark:text-white placeholder-slate-400 hide-scrollbar"
              rows="1"
            />
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="bg-[#0A84FF] hover:bg-[#0070E0] text-white w-[56px] h-[56px] rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-0 shadow-sm flex-shrink-0 flex items-center justify-center active:scale-95"
          >
            <Send size={22} className={cn("ml-1", sending && "animate-pulse")} />
          </button>
        </div>
      </div>
      
      {/* Right Project Drawer (Optional for XL screens) */}
      <div className="hidden min-[1440px]:flex w-80 bg-[#F8FBFF] dark:bg-[#0B141A] border-l border-slate-200 dark:border-slate-800/60 flex-col overflow-y-auto shrink-0">
        <div className="p-6 flex flex-col items-center border-b border-slate-200 dark:border-slate-800/60">
          <Avatar src={otherUser?.avatar} name={otherUser?.name} alt={otherUser?.name} size="xl" className="mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{otherUser?.name || 'Contact Info'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{otherUser?.email || 'freelancer@workstation.com'}</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-slate-500">Project Info</h4>
            <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="font-medium text-slate-900 dark:text-white">Website Redesign</p>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-slate-500">Budget</span>
                <span className="font-medium text-emerald-600">$1,500</span>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-slate-500">Deadline</span>
                <span className="font-medium">Oct 15, 2026</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-slate-500">Shared Files</h4>
            <div className="bg-white dark:bg-[#1E293B] p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Paperclip size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">requirements_v2.pdf</p>
                <p className="text-xs text-slate-500">2.4 MB • 2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
