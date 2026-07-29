// src/components/Notification/NotificationCenter.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  BellRing,
  X,
  CheckCircle2,
  Utensils,
  ShieldCheck,
  MessageSquare,
  Bug,
  Trash2,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import toast from 'react-hot-toast';

export default function NotificationCenter({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const [filterTab, setFilterTab] = useState('All');

  const refreshNotifs = useCallback(() => {
    setNotifications(notificationService.getNotifications());
  }, []);

  useEffect(() => {
    window.addEventListener('kpr_notification_updated', refreshNotifs);
    window.addEventListener('storage', refreshNotifs);
    return () => {
      window.removeEventListener('kpr_notification_updated', refreshNotifs);
      window.removeEventListener('storage', refreshNotifs);
    };
  }, [refreshNotifs]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    toast.success('All notifications marked as read!');
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      notificationService.clearAll();
      toast.success('Notification feed cleared!');
    }
  };

  const handleItemClick = (notif) => {
    notificationService.markAsRead(notif.id);
    onClose();
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filterTab === 'Unread') return !n.read;
    if (filterTab === 'Mess') return n.type === 'mess';
    if (filterTab === 'Hostel') return n.type === 'hostel' || n.type === 'remark';
    if (filterTab === 'Bugs') return n.type === 'bug';
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'mess':
        return <Utensils size={16} className="text-[#52B74A]" />;
      case 'hostel':
        return <ShieldCheck size={16} className="text-sky-500" />;
      case 'remark':
        return <MessageSquare size={16} className="text-purple-500" />;
      case 'bug':
        return <Bug size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-amber-500" />;
    }
  };

  const formatTimeAgo = (isoStr) => {
    try {
      const diffMs = Date.now() - new Date(isoStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-2 sm:p-4 animate-fade-in">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <div className="relative w-full max-w-md bg-[var(--bg-card)] text-[var(--text-primary)] rounded-3xl shadow-2xl border border-[var(--border)] z-10 flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden animate-slide-up mt-14 sm:mt-16">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-[#164350] to-[#0E2730] text-white flex items-center justify-between gap-3 border-b border-purple-500/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              {unreadCount > 0 ? <BellRing size={18} className="animate-bounce" /> : <Bell size={18} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                  Super Admin Live Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black uppercase">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#B0D0D8] mt-0.5">
                Real-time activity alerts across Mess & Hostel management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Controls & Filter Tabs */}
        <div className="p-3 bg-[var(--bg-subtle)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {['All', 'Unread', 'Mess', 'Hostel', 'Bugs'].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all whitespace-nowrap ${
                  filterTab === tab
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-[#52B74A] hover:underline flex items-center gap-1"
              >
                <Check size={13} />
                <span>Read All</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-bold text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="p-3 overflow-y-auto flex flex-col gap-2.5 flex-1">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)] font-medium flex flex-col items-center justify-center gap-2">
              <Bell size={28} className="opacity-40 text-purple-400" />
              <p>No {filterTab.toLowerCase()} notifications at this moment.</p>
            </div>
          ) : (
            filteredNotifs.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                  !item.read
                    ? 'bg-purple-500/10 border-purple-500/30 shadow-xs'
                    : 'bg-[var(--bg-subtle)] border-[var(--border)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getNotifIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h4 className={`font-extrabold text-xs truncate ${!item.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium whitespace-nowrap flex-shrink-0">
                      {formatTimeAgo(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {item.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    notificationService.deleteNotification(item.id);
                  }}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                  title="Remove Notification"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-subtle)] text-center text-[10.5px] text-[var(--text-muted)] font-medium">
          Live Super Admin Notification Feed • KPRIET Hostels Suite
        </div>
      </div>
    </div>
  );
}
