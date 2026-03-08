'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, Bookmark, 
  MoreHorizontal, ExternalLink, Instagram, 
  Youtube, Twitter, Facebook, Music2, Send, MessageCircle as WhatsAppIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Post, SocialNetwork } from '@/lib/types';

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
}

const networkIcons: Record<SocialNetwork, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  telegram: Send,
  whatsapp: WhatsAppIcon,
  linkedin: ExternalLink,
  native: ExternalLink,
};

const networkColors: Record<SocialNetwork, string> = {
  instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
  twitter: 'bg-sky-500',
  facebook: 'bg-blue-600',
  telegram: 'bg-sky-400',
  whatsapp: 'bg-green-500',
  linkedin: 'bg-blue-700',
  native: 'bg-primary',
};

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

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

export function PostCard({ post, onLike, onSave, onShare }: PostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [liked, setLiked] = useState(post.isLiked);
  const [saved, setSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(post.likes);

  const NetworkIcon = networkIcons[post.sourceNetwork];
  const shouldTruncate = post.content.length > 150;
  const displayContent = showFullContent || !shouldTruncate 
    ? post.content 
    : post.content.slice(0, 150) + '...';

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleSave = () => {
    setSaved(!saved);
    onSave();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SocialHub Post',
          text: post.content,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
    onShare();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>{post.author.displayName[0]}</AvatarFallback>
            </Avatar>
            {post.author.isVerified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-sm">{post.author.displayName}</p>
            <p className="text-xs text-muted-foreground">
              @{post.author.username} · {formatTime(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Network Badge */}
          <Badge 
            variant="secondary" 
            className={`${networkColors[post.sourceNetwork]} text-white border-0`}
          >
            <NetworkIcon className="w-3 h-3 mr-1" />
            {post.sourceNetwork}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm whitespace-pre-wrap">
          {displayContent.split(/(\s+)/).map((part, i) => {
            if (part.startsWith('#')) {
              return (
                <span key={i} className="text-primary hover:underline cursor-pointer">
                  {part}
                </span>
              );
            }
            return part;
          })}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-sm text-primary hover:underline mt-1"
          >
            {showFullContent ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Media */}
      {post.media.length > 0 && (
        <div className={`grid gap-1 px-4 pb-3 ${
          post.media.length === 1 ? 'grid-cols-1' : 
          post.media.length === 2 ? 'grid-cols-2' : 
          'grid-cols-2'
        }`}>
          {post.media.map((media, index) => (
            <div
              key={media.id}
              className={`relative overflow-hidden rounded-lg ${
                post.media.length === 1 ? 'aspect-video' : 'aspect-square'
              } ${post.media.length >= 3 && index === 0 ? 'row-span-2' : ''}`}
            >
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  poster={media.thumbnail}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : (
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}
              {index === 3 && post.media.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    +{post.media.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs text-primary hover:underline cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Original URL */}
      {post.originalUrl && (
        <div className="px-4 pb-3">
          <a
            href={post.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View original on {post.sourceNetwork}
          </a>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <div className="flex items-center gap-1">
          <AnimatePresence>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`gap-1.5 ${liked ? 'text-red-500' : ''}`}
              >
                <motion.div
                  animate={liked ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </motion.div>
                <span className="text-sm">{formatNumber(likeCount)}</span>
              </Button>
            </motion.div>
          </AnimatePresence>

          <Button variant="ghost" size="sm" className="gap-1.5">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{formatNumber(post.comments)}</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">{formatNumber(post.shares)}</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className={saved ? 'text-primary' : ''}
        >
          <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </motion.article>
  );
}
