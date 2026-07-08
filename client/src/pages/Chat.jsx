import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaSpinner, FaCommentDots, FaArrowLeft, FaUsers, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axios';
import Loader from '../components/common/Loader';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { getPublicFileUrl, getApiOrigin } from '../utils/apiOrigin';
import { io } from 'socket.io-client';

const Chat = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);
  const socketRef = useRef(null);

  // Confirm modals
  const [confirmDeleteMsg, setConfirmDeleteMsg] = useState(null);
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(null);

  const getAvatarUrl = (p) => getPublicFileUrl(p);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (user?.role === 'instructor') {
          const res = await axiosInstance.get('/groups/my');
          setGroups(res.data || []);
        } else if (user?.role === 'student') {
          const membershipRes = await axiosInstance.get('/groups/my-membership');
          if (membershipRes.data.status === 'approved' && membershipRes.data.group) {
            setGroups([membershipRes.data.group]);
            setActiveGroup(membershipRes.data.group);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, [user]);

  const fetchMessages = async (groupId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      setMessages(res.data || []);
    } catch {
      if (!silent) toast.error(t('chat.failedLoad'));
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Socket connection for real-time
  useEffect(() => {
    if (!user || !activeGroup?._id) return;
    const socket = io(getApiOrigin(), {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-group', activeGroup._id);
    });

    socket.on('newMessage', (msg) => {
      if (msg.group === activeGroup._id) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on('messageDeleted', ({ messageId, groupId }) => {
      if (groupId === activeGroup._id) {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      }
    });

    socket.on('groupDeleted', ({ groupId }) => {
      setGroups(prev => prev.filter(g => g._id !== groupId));
      if (activeGroup?._id === groupId) {
        setActiveGroup(null);
        setMessages([]);
      }
    });

    return () => {
      if (activeGroup?._id) socket.emit('leave-group', activeGroup._id);
      socket.disconnect();
    };
  }, [user, activeGroup?._id]);

  useEffect(() => {
    if (activeGroup?._id) {
      fetchMessages(activeGroup._id);
      pollRef.current = setInterval(() => fetchMessages(activeGroup._id, true), 5000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeGroup?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      const res = await axiosInstance.post('/messages', {
        groupId: activeGroup._id,
        content: input.trim()
      });
      setMessages(prev => [...prev, res.data]);
      setInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || t('chat.failedSend'));
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async () => {
    if (!confirmDeleteMsg) return;
    try {
      await axiosInstance.delete(`/messages/${confirmDeleteMsg._id}`);
      setMessages(prev => prev.filter(m => m._id !== confirmDeleteMsg._id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    } finally {
      setConfirmDeleteMsg(null);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirmDeleteGroup) return;
    try {
      await axiosInstance.delete(`/groups/${confirmDeleteGroup._id}`);
      setGroups(prev => prev.filter(g => g._id !== confirmDeleteGroup._id));
      if (activeGroup?._id === confirmDeleteGroup._id) {
        setActiveGroup(null);
        setMessages([]);
      }
      toast.success('Group deleted');
    } catch {
      toast.error('Failed to delete group');
    } finally {
      setConfirmDeleteGroup(null);
    }
  };

  const canDeleteMessage = (msg) => {
    if (!user) return false;
    const isOwn = (msg.sender?._id || msg.sender) === user.id;
    const isInstructor = user.role === 'instructor';
    return isOwn || isInstructor;
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (isToday) return time;
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`;
  };

  if (loadingGroups) {
    return <div className="p-6 space-y-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>;
  }

  if (groups.length === 0) {
    return (
      <div className="p-1">
        <EmptyState title={t('chat.noGroups')} description={user?.role === 'student' ? t('chat.noGroupsStudent') : t('chat.noGroupsOther')} />
      </div>
    );
  }

  const openMobileChat = (group) => {
    setActiveGroup(group);
    setMobileChatOpen(true);
  };

  const closeMobileChat = () => {
    setMobileChatOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 p-1">
      {/* Group list sidebar */}
      <div className={`${mobileChatOpen ? 'hidden' : 'flex'} w-full md:w-64 shrink-0 flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:flex`}>
        <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t('chat.groups')}</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {groups.map(g => (
            <div key={g._id} className="group relative">
              <button
                onClick={() => {
                  if (window.innerWidth < 768) {
                    openMobileChat(g);
                  } else {
                    setActiveGroup(g);
                  }
                }}
                className={`w-full border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 dark:border-gray-800/50 ${
                  activeGroup?._id === g._id ? 'bg-[#0084D1]/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                }`}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{g.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{g.members?.length || 0} {t('chat.members')}</p>
              </button>
              {user?.role === 'instructor' && (
                <button
                  onClick={() => setConfirmDeleteGroup(g)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
                  title="Delete group"
                >
                  <FaTrash className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`${!activeGroup && 'hidden md:flex'} ${activeGroup && !mobileChatOpen ? 'hidden md:flex' : 'flex'} flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${mobileChatOpen ? 'fixed inset-0 z-30 rounded-none md:relative md:inset-auto md:z-auto md:rounded-2xl' : ''}`}>
        {activeGroup ? (
          <>
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-4 md:px-5 py-3 dark:border-gray-800">
            <button
              onClick={closeMobileChat}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
              aria-label="Back to groups"
            >
              <FaArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{activeGroup.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <FaUsers className="inline h-3 w-3 mr-1" />
                {activeGroup.members?.length || 0} {t('chat.members')}
                {activeGroup.instructor?.name ? ` • ${activeGroup.instructor.name}` : ''}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center"><Loader size="md" /></div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <FaCommentDots className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600" />
                  <p className="mt-2 text-sm text-gray-400">{t('chat.noMessages')}</p>
                </div>
              </div>
            ) : (
              messages.map(msg => {
                const isOwn = (msg.sender?._id || msg.sender) === user.id;
                const senderName = msg.sender?.name || t('chat.unknown');
                const senderAvatar = msg.sender?.avatar;
                return (
                  <div key={msg._id} className={`group/msg flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[75%] gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <div className="mt-1 h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        {senderAvatar ? (
                          <img src={getAvatarUrl(senderAvatar)} alt={senderName} className="h-full w-full object-cover object-top" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFB900] to-[#0084D1] text-[9px] font-bold text-white">
                            {senderName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="relative">
                        <div className={`rounded-2xl px-4 py-2 text-sm ${
                          isOwn
                            ? 'bg-[#0084D1] text-white rounded-tr-sm'
                            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 rounded-tl-sm'
                        }`}>
                          {!isOwn && (
                            <p className="mb-0.5 text-[10px] font-semibold text-[#0084D1]">{senderName}</p>
                          )}
                          <p>{msg.content}</p>
                        </div>
                        <p className={`mt-0.5 text-[10px] text-gray-400 ${isOwn ? 'text-right' : ''}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                        {canDeleteMessage(msg) && (
                          <button
                            onClick={() => setConfirmDeleteMsg(msg)}
                            className="absolute -top-1 right-0 hidden group-hover/msg:flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700 text-red-400 hover:text-red-600 transition-colors"
                            title="Delete message"
                          >
                            <FaTrash className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-3 border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('chat.typeMessage')}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none transition focus:border-[#0084D1] focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0084D1] text-white hover:bg-[#0277BD] disabled:opacity-50 transition-all"
            >
              {sending ? <FaSpinner className="h-4 w-4 animate-spin" /> : <FaPaperPlane className="h-4 w-4" />}
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="text-center">
            <FaCommentDots className="mx-auto h-10 w-10 md:h-16 md:w-16 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm md:text-lg font-semibold text-gray-500 dark:text-gray-400">{t('chat.selectGroup')}</p>
          </div>
        </div>
      )}
    </div>

      {/* Delete message confirm */}
      <ConfirmModal
        isOpen={!!confirmDeleteMsg}
        onConfirm={handleDeleteMessage}
        onCancel={() => setConfirmDeleteMsg(null)}
        title="Delete message"
        message="This cannot be undone."
        confirmLabel="Delete"
        destructive
      />

      {/* Delete group confirm */}
      <ConfirmModal
        isOpen={!!confirmDeleteGroup}
        onConfirm={handleDeleteGroup}
        onCancel={() => setConfirmDeleteGroup(null)}
        title={`Delete "${confirmDeleteGroup?.name || ''}"`}
        message="All messages in this group will be permanently deleted."
        confirmLabel="Delete Group"
        destructive
      />
    </div>
  );
};

export default Chat;