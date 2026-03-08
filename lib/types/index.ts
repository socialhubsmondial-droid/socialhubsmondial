// SocialHub Types

export type SocialNetwork = 
  | 'tiktok' 
  | 'instagram' 
  | 'facebook' 
  | 'whatsapp' 
  | 'telegram' 
  | 'youtube' 
  | 'twitter' 
  | 'linkedin'
  | 'native';

export interface ConnectedNetwork {
  network: SocialNetwork;
  username: string;
  profileUrl: string;
  connectedAt: string;
  isActive: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location: string;
  category: string;
  website?: string;
  networks: ConnectedNetwork[];
  followers: number;
  following: number;
  postsCount: number;
  storiesCount: number;
  isVerified: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: string;
  lastLogin: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: 'en' | 'fr' | 'es';
  darkMode: boolean;
  accentColor: string;
  reducedMotion: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  likes: boolean;
  comments: boolean;
  follows: boolean;
  mentions: boolean;
  adminUpdates: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  showEmail: boolean;
  allowMessages: boolean;
}

export interface Post {
  id: string;
  userId: string;
  author: User;
  content: string;
  media: MediaItem[];
  sourceNetwork: SocialNetwork;
  originalUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isLiked: boolean;
  isSaved: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  aspectRatio?: number;
}

export interface Story {
  id: string;
  userId: string;
  author: User;
  media: MediaItem;
  sourceNetwork: SocialNetwork;
  originalUrl?: string;
  views: number;
  createdAt: string;
  expiresAt: string;
  seen?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  author: User;
  content: string;
  likes: number;
  replies: number;
  isLiked: boolean;
  createdAt: string;
}

export type NotificationType = 
  | 'like' 
  | 'comment' 
  | 'follow' 
  | 'mention' 
  | 'post' 
  | 'admin' 
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: User;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'user' | 'story';
  isRead: boolean;
  createdAt: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string;
  coverImage?: string;
  posts: string[];
  isPrivate: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCreators: number;
  totalPosts: number;
  totalStories: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  newUsersToday: number;
  activeUsersToday: number;
  networkStats: NetworkStat[];
  categoryStats: CategoryStat[];
  dailyGrowth: DailyGrowth[];
}

export interface NetworkStat {
  network: SocialNetwork;
  userCount: number;
  postCount: number;
}

export interface CategoryStat {
  category: string;
  userCount: number;
  postCount: number;
}

export interface DailyGrowth {
  date: string;
  users: number;
  posts: number;
  likes: number;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  source: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BugReport {
  id: string;
  userId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export type FeedSort = 'recent' | 'trending' | 'popular';
export type FeedFilter = 'all' | SocialNetwork;

export interface ExploreFilters {
  network?: SocialNetwork;
  category?: string;
  sortBy: 'popularity' | 'recent' | 'trending';
}
