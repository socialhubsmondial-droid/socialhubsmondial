'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore, useUIStore } from '@/lib/store';
import { mockStories } from '@/lib/data/mockData';

export function StoriesBar() {
  const { user } = useAuthStore();
  const { setCreatePostOpen } = useUIStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative mb-6">
      {/* Stories Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1"
      >
        {/* Add Story Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCreatePostOpen(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-primary to-primary/50">
              <div className="w-full h-full rounded-full bg-background p-[2px]">
                <Avatar className="w-full h-full">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
              <Plus className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Your Story</span>
        </motion.button>

        {/* User Stories */}
        {mockStories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className={`w-16 h-16 rounded-full p-[2px] ${
              story.seen 
                ? 'bg-muted' 
                : 'bg-gradient-to-br from-yellow-400 via-red-500 to-purple-500'
            }`}>
              <div className="w-full h-full rounded-full bg-background p-[2px]">
                <Avatar className="w-full h-full">
                  <AvatarImage src={story.author.avatar} />
                  <AvatarFallback>{story.author.displayName[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[64px]">
              {story.author.username}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
