'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Search, TrendingUp, Users, Hash, Flame,
  Instagram, Youtube, Twitter, Facebook, Music2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { PostCard } from '@/components/feed/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { mockPosts, mockUsers } from '@/lib/data/mockData';
import type { Post, User } from '@/lib/types';

const trendingTags = [
  { tag: 'socialhub', count: 125000 },
  { tag: 'trending', count: 89000 },
  { tag: 'photography', count: 67000 },
  { tag: 'fashion', count: 54000 },
  { tag: 'food', count: 43000 },
  { tag: 'travel', count: 38000 },
  { tag: 'technology', count: 32000 },
  { tag: 'fitness', count: 28000 },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function ExplorePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('trending');
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Load mock data
    setTimeout(() => {
      setPosts(mockPosts);
      setUsers(mockUsers);
      setIsLoading(false);
    }, 800);
  }, [isAuthenticated, router]);

  const filteredPosts = posts.filter(post => 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users, posts, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24">
        <h1 className="text-2xl font-bold mb-4">Explore</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="trending">
              <Flame className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="creators">
              <Users className="w-4 h-4 mr-2" />
              Creators
            </TabsTrigger>
            <TabsTrigger value="tags">
              <Hash className="w-4 h-4 mr-2" />
              Tags
            </TabsTrigger>
          </TabsList>

          {/* Trending Posts */}
          <TabsContent value="trending">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Popular Posts
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-full h-64 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Flame className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No posts found</p>
                <p className="text-muted-foreground">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={() => {}}
                    onSave={() => {}}
                    onShare={() => {}}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trending Creators */}
          <TabsContent value="creators">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Trending Creators
            </h2>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-16 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No creators found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => router.push(`/profile`)}
                    className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{user.displayName}</p>
                        <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                      </div>
                      {user.isVerified && (
                        <Badge variant="default" className="shrink-0">Verified</Badge>
                      )}
                    </div>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span><strong>{formatNumber(user.followers)}</strong> followers</span>
                      <span><strong>{formatNumber(user.postsCount)}</strong> posts</span>
                    </div>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Trending Tags */}
          <TabsContent value="tags">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Trending Tags
            </h2>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map(({ tag, count }) => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery(`#${tag}`);
                    setActiveTab('trending');
                  }}
                  className="px-4 py-2 bg-card border border-border rounded-full hover:bg-muted transition-colors"
                >
                  <span className="text-primary font-medium">#{tag}</span>
                  <span className="text-muted-foreground text-sm ml-2">
                    {formatNumber(count)} posts
                  </span>
                </motion.button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden z-50">
        <div className="flex justify-around items-center h-16 pb-safe">
          <Button variant="ghost" size="icon" onClick={() => router.push('/feed')}>
            <Music2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push('/feed')}>
            <Music2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
            <Users className="w-5 h-5" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
