'use client';

import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, UserPlus, AtSign, 
  FileText, Shield 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Notification } from '@/lib/types';

interface NotificationItemProps {
  notification?: Notification;
}

const notificationConfig = {
  like: { icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
  comment: { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  follow: { icon: UserPlus, color: 'text-green-500', bg: 'bg-green-500/10' },
  mention: { icon: AtSign, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  post: { icon: FileText, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  admin: { icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
  system: { icon: Shield, color: 'text-muted-foreground', bg: 'bg-muted' },
};

function formatTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString();
}

export function NotificationItem({ notification }: NotificationItemProps) {
  // Mock notification for demo
  const mockNotification: Notification = {
    id: '1',
    userId: 'user_1',
    type: 'like',
    title: 'New Like',
    message: 'Sarah Smith liked your post',
    actor: {
      id: 'user_2',
      email: 'sarah@example.com',
      username: 'sarahsmith',
      displayName: 'Sarah Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      bio: '',
      location: '',
      category: '',
      networks: [],
      followers: 45600,
      following: 1200,
      postsCount: 892,
      storiesCount: 0,
      isVerified: true,
      isAdmin: false,
      isBanned: false,
      createdAt: '',
      lastLogin: '',
      preferences: {} as any,
    },
    targetId: 'post_1',
    targetType: 'post',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  };

  const notif = notification || mockNotification;
  const config = notificationConfig[notif.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        notif.isRead ? 'hover:bg-muted/50' : 'bg-primary/5 hover:bg-primary/10'
      }`}
    >
      {notif.actor ? (
        <div className="relative flex-shrink-0">
          <Avatar className="w-10 h-10">
            <AvatarImage src={notif.actor.avatar} />
            <AvatarFallback>{notif.actor.displayName[0]}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${config.bg}`}>
            <Icon className={`w-3 h-3 ${config.color}`} />
          </div>
        </div>
      ) : (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          {notif.actor && (
            <span className="font-semibold">{notif.actor.displayName} </span>
          )}
          {notif.message}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatTime(notif.createdAt)}
        </p>
      </div>

      {!notif.isRead && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </motion.div>
  );
}
