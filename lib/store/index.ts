import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Post, Story, Notification, AdminStats, SocialNetwork, FeedSort, FeedFilter } from '@/lib/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: { email: string; username: string; password: string; displayName: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Mock login - in production, call API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Admin credentials check
        if (email === 'millionsonknives@gmail.com' && password === 'aurel12345&') {
          const adminUser: User = {
            id: 'admin_1',
            email: 'millionsonknives@gmail.com',
            username: 'admin',
            displayName: 'SocialHub Admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            bio: 'Platform Administrator',
            location: 'Global',
            category: 'Administration',
            networks: [],
            followers: 0,
            following: 0,
            postsCount: 0,
            storiesCount: 0,
            isVerified: true,
            isAdmin: true,
            isBanned: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            preferences: {
              language: 'en',
              darkMode: true,
              accentColor: '#ff3b3b',
              reducedMotion: false,
              notifications: {
                email: true,
                push: true,
                likes: true,
                comments: true,
                follows: true,
                mentions: true,
                adminUpdates: true,
              },
              privacy: {
                profileVisible: false,
                showEmail: false,
                allowMessages: false,
              },
            },
          };
          set({ user: adminUser, isAuthenticated: true, isAdmin: true, isLoading: false });
          return true;
        }
        
        // Regular user mock
        const mockUser: User = {
          id: 'user_1',
          email,
          username: email.split('@')[0],
          displayName: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: 'Social media enthusiast | Content creator',
          location: 'New York, USA',
          category: 'Lifestyle',
          networks: [
            { network: 'instagram', username: '@demouser', profileUrl: 'https://instagram.com/demouser', connectedAt: new Date().toISOString(), isActive: true },
            { network: 'tiktok', username: '@demouser', profileUrl: 'https://tiktok.com/@demouser', connectedAt: new Date().toISOString(), isActive: true },
          ],
          followers: 12500,
          following: 850,
          postsCount: 342,
          storiesCount: 56,
          isVerified: true,
          isAdmin: false,
          isBanned: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            language: 'en',
            darkMode: true,
            accentColor: '#ff3b3b',
            reducedMotion: false,
            notifications: {
              email: true,
              push: true,
              likes: true,
              comments: true,
              follows: true,
              mentions: true,
              adminUpdates: true,
            },
            privacy: {
              profileVisible: true,
              showEmail: false,
              allowMessages: true,
            },
          },
        };
        
        set({ user: mockUser, isAuthenticated: true, isAdmin: false, isLoading: false });
        return true;
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser: User = {
          id: 'user_google',
          email: 'google.user@gmail.com',
          username: 'googleuser',
          displayName: 'Google User',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: 'Connected via Google',
          location: '',
          category: '',
          networks: [],
          followers: 0,
          following: 0,
          postsCount: 0,
          storiesCount: 0,
          isVerified: false,
          isAdmin: false,
          isBanned: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            language: 'en',
            darkMode: true,
            accentColor: '#ff3b3b',
            reducedMotion: false,
            notifications: {
              email: true,
              push: true,
              likes: true,
              comments: true,
              follows: true,
              mentions: true,
              adminUpdates: true,
            },
            privacy: {
              profileVisible: true,
              showEmail: false,
              allowMessages: true,
            },
          },
        };
        
        set({ user: mockUser, isAuthenticated: true, isAdmin: false, isLoading: false });
        return true;
      },

      register: async (data) => {
        set({ isLoading: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: data.email,
          username: data.username,
          displayName: data.displayName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
          bio: '',
          location: '',
          category: '',
          networks: [],
          followers: 0,
          following: 0,
          postsCount: 0,
          storiesCount: 0,
          isVerified: false,
          isAdmin: false,
          isBanned: false,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          preferences: {
            language: 'en',
            darkMode: true,
            accentColor: '#ff3b3b',
            reducedMotion: false,
            notifications: {
              email: true,
              push: true,
              likes: true,
              comments: true,
              follows: true,
              mentions: true,
              adminUpdates: true,
            },
            privacy: {
              profileVisible: true,
              showEmail: false,
              allowMessages: true,
            },
          },
        };
        
        set({ user: newUser, isAuthenticated: true, isAdmin: false, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, isAdmin: false });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, isAdmin: state.isAdmin }),
    }
  )
);

// Theme Store
interface ThemeState {
  darkMode: boolean;
  accentColor: string;
  reducedMotion: boolean;
  toggleDarkMode: () => void;
  setAccentColor: (color: string) => void;
  setReducedMotion: (value: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      darkMode: true,
      accentColor: '#ff3b3b',
      reducedMotion: false,

      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode });
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      setAccentColor: (color) => set({ accentColor: color }),
      setReducedMotion: (value) => set({ reducedMotion: value }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Feed Store
interface FeedState {
  posts: Post[];
  stories: Story[];
  notifications: Notification[];
  unreadCount: number;
  sortBy: FeedSort;
  filterBy: FeedFilter;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  setSortBy: (sort: FeedSort) => void;
  setFilterBy: (filter: FeedFilter) => void;
  likePost: (postId: string) => void;
  savePost: (postId: string) => void;
  sharePost: (postId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  loadMorePosts: () => Promise<void>;
  refreshFeed: () => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  stories: [],
  notifications: [],
  unreadCount: 0,
  sortBy: 'recent',
  filterBy: 'all',
  isLoading: false,
  hasMore: true,
  page: 1,

  setSortBy: (sort) => set({ sortBy: sort, page: 1, posts: [] }),
  setFilterBy: (filter) => set({ filterBy: filter, page: 1, posts: [] }),

  likePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post
      ),
    }));
  },

  savePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved, saves: post.isSaved ? post.saves - 1 : post.saves + 1 }
          : post
      ),
    }));
  },

  sharePost: (postId) => {
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, shares: post.shares + 1, isShared: true } : post
      ),
    }));
  },

  markNotificationAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllNotificationsAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  loadMorePosts: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock posts generation
    const newPosts: Post[] = Array.from({ length: 5 }, (_, i) => ({
      id: `post_${Date.now()}_${i}`,
      userId: `user_${i}`,
      author: {
        id: `user_${i}`,
        email: `user${i}@example.com`,
        username: `user${i}`,
        displayName: `User ${i}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face`,
        bio: '',
        location: '',
        category: '',
        networks: [],
        followers: Math.floor(Math.random() * 10000),
        following: Math.floor(Math.random() * 1000),
        postsCount: Math.floor(Math.random() * 500),
        storiesCount: 0,
        isVerified: Math.random() > 0.7,
        isAdmin: false,
        isBanned: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {} as any,
      },
      content: `This is a sample post content with some amazing content! #socialhub #trending #post${i}`,
      media: Math.random() > 0.3 ? [{
        id: `media_${i}`,
        type: 'image' as const,
        url: `https://images.unsplash.com/photo-${1500000000000 + i * 100}?w=800&h=600&fit=crop`,
      }] : [],
      sourceNetwork: (['instagram', 'tiktok', 'native', 'twitter', 'youtube'] as SocialNetwork[])[Math.floor(Math.random() * 5)],
      tags: ['socialhub', 'trending', `tag${i}`],
      likes: Math.floor(Math.random() * 5000),
      comments: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 200),
      saves: Math.floor(Math.random() * 1000),
      isLiked: false,
      isSaved: false,
      isShared: false,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    set((state) => ({
      posts: [...state.posts, ...newPosts],
      page: page + 1,
      hasMore: page < 5,
      isLoading: false,
    }));
  },

  refreshFeed: async () => {
    set({ page: 1, posts: [], hasMore: true });
    await get().loadMorePosts();
  },
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  notificationsOpen: boolean;
  createPostOpen: boolean;
  searchQuery: string;
  activeStory: Story | null;
  setSidebarOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setCreatePostOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveStory: (story: Story | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  notificationsOpen: false,
  createPostOpen: false,
  searchQuery: '',
  activeStory: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setNotificationsOpen: (open) => set({ notificationsOpen: open }),
  setCreatePostOpen: (open) => set({ createPostOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveStory: (story) => set({ activeStory: story }),
}));

// Admin Store
interface AdminState {
  stats: AdminStats | null;
  users: User[];
  logs: any[];
  bugs: any[];
  isLoading: boolean;
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  banUser: (userId: string, banned: boolean) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  stats: null,
  users: [],
  logs: [],
  bugs: [],
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockStats: AdminStats = {
      totalUsers: 45678,
      totalCreators: 12345,
      totalPosts: 234567,
      totalStories: 45678,
      totalLikes: 1234567,
      totalComments: 345678,
      totalShares: 89012,
      newUsersToday: 234,
      activeUsersToday: 12345,
      networkStats: [
        { network: 'instagram', userCount: 34567, postCount: 123456 },
        { network: 'tiktok', userCount: 28901, postCount: 98765 },
        { network: 'youtube', userCount: 19876, postCount: 45678 },
        { network: 'twitter', userCount: 23456, postCount: 67890 },
        { network: 'facebook', userCount: 12345, postCount: 34567 },
        { network: 'telegram', userCount: 5678, postCount: 12345 },
        { network: 'whatsapp', userCount: 8901, postCount: 8901 },
      ],
      categoryStats: [
        { category: 'Photography', userCount: 8901, postCount: 45678 },
        { category: 'Fashion', userCount: 12345, postCount: 67890 },
        { category: 'Technology', userCount: 9876, postCount: 34567 },
        { category: 'Food', userCount: 11234, postCount: 56789 },
        { category: 'Travel', userCount: 7890, postCount: 34567 },
        { category: 'Fitness', userCount: 6789, postCount: 23456 },
      ],
      dailyGrowth: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
        users: Math.floor(Math.random() * 100) + 50,
        posts: Math.floor(Math.random() * 500) + 200,
        likes: Math.floor(Math.random() * 5000) + 1000,
      })),
    };
    
    set({ stats: mockStats, isLoading: false });
  },

  fetchUsers: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
      id: `user_${i}`,
      email: `user${i}@example.com`,
      username: `user${i}`,
      displayName: `User ${i}`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=150&h=150&fit=crop&crop=face`,
      bio: `Bio for user ${i}`,
      location: 'New York, USA',
      category: 'Lifestyle',
      networks: [],
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000),
      postsCount: Math.floor(Math.random() * 500),
      storiesCount: 0,
      isVerified: Math.random() > 0.8,
      isAdmin: false,
      isBanned: Math.random() > 0.9,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      preferences: {} as any,
    }));
    
    set({ users: mockUsers, isLoading: false });
  },

  banUser: async (userId, banned) => {
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isBanned: banned } : u
      ),
    }));
  },
}));
