'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Compass, Bell, User, Plus,
  Search, Menu, Sun, Moon, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore, useFeedStore, useUIStore, useThemeStore } from '@/lib/store';
import { StoriesBar } from '@/components/stories/StoriesBar';
import { PostCard } from '@/components/feed/PostCard';
import { CreatePostModal } from '@/components/feed/CreatePostModal';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const navItems = [
  { icon: Home, label: 'Home', href: '/feed' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: Bell, label: 'Notifications', href: '#', badge: true },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function FeedPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { posts, isLoading, hasMore, unreadCount, sortBy, filterBy, loadMorePosts, refreshFeed, likePost, savePost, sharePost } = useFeedStore();
  const { sidebarOpen, setSidebarOpen, createPostOpen, setCreatePostOpen, notificationsOpen, setNotificationsOpen } = useUIStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    refreshFeed();
  }, [isAuthenticated, router, refreshFeed]);

  // Infinite scroll observer
  const lastPostRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePosts();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, loadMorePosts]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation - Desktop */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl hidden sm:block">SocialHub</span>
            </motion.div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users, posts, tags..."
                className="pl-10 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  {/* Notifications list */}
                  <div className="space-y-2">
                    <NotificationItem />
                    <NotificationItem />
                    <NotificationItem />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Avatar className="cursor-pointer" onClick={() => router.push('/profile')}>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-20 lg:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Stories */}
          <StoriesBar />

          {/* Feed Filters */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {['recent', 'trending', 'popular'].map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? 'default' : 'outline'}
                size="sm"
                onClick={() => useFeedStore.setState({ sortBy: sort as any })}
                className="capitalize"
              >
                {sort}
              </Button>
            ))}
            <div className="w-px h-6 bg-border mx-2" />
            {['all', 'instagram', 'tiktok', 'youtube', 'twitter'].map((filter) => (
              <Button
                key={filter}
                variant={filterBy === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => useFeedStore.setState({ filterBy: filter as any })}
                className="capitalize"
              >
                {filter}
              </Button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  ref={index === posts.length - 1 ? lastPostRef : null}
                >
                  <PostCard 
                    post={post} 
                    onLike={() => likePost(post.id)}
                    onSave={() => savePost(post.id)}
                    onShare={() => sharePost(post.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Skeletons */}
            {isLoading && (
              <>
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
                    <div className="flex gap-4">
                      <Skeleton className="w-20 h-8" />
                      <Skeleton className="w-20 h-8" />
                      <Skeleton className="w-20 h-8" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {!hasMore && posts.length > 0 && (
              <p className="text-center text-muted-foreground py-8">No more posts</p>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setCreatePostOpen(true)}
        className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden z-50">
        <div className="flex justify-around items-center h-16 pb-safe">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => {
                if (item.label === 'Notifications') {
                  setNotificationsOpen(true);
                } else {
                  router.push(item.href);
                }
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.badge && unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </nav>

      {/* Create Post Modal */}
      <CreatePostModal open={createPostOpen} onOpenChange={setCreatePostOpen} />

      {/* Sidebar - Desktop */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={() => {
                  setSidebarOpen(false);
                  if (item.label === 'Notifications') {
                    setNotificationsOpen(true);
                  } else {
                    router.push(item.href);
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            ))}
            <div className="border-t border-border my-4" />
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
