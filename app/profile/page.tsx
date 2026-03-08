'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Heart, TrendingUp, Activity,
  Shield, Search, Ban, UserCheck, RefreshCw,
  Instagram, Youtube, Twitter, Facebook, Music2, Send, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuthStore, useAdminStore } from '@/lib/store';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const networkIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  telegram: Send,
  whatsapp: MessageCircle,
};

const COLORS = ['#ff3b3b', '#ff6b6b', '#ffa0a0', '#ffc7c7', '#ffe0e0', '#fff1f1'];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const { stats, users, isLoading, fetchStats, fetchUsers, banUser } = useAdminStore();
  const [userSearch, setUserSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (!isAdmin) {
      toast.error('Admin access required');
      router.push('/feed');
      return;
    }
    fetchStats();
    fetchUsers();
  }, [isAuthenticated, isAdmin, router, fetchStats, fetchUsers]);

  const handleBanUser = async (userId: string, banned: boolean) => {
    await banUser(userId, banned);
    toast.success(banned ? 'User banned' : 'User unbanned');
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.displayName.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Platform Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { fetchStats(); fetchUsers(); }}>
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Avatar className="cursor-pointer" onClick={() => router.push('/profile')}>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Users"
                value={stats?.totalUsers || 0}
                trend={stats?.newUsersToday || 0}
                trendLabel="new today"
              />
              <StatCard
                icon={FileText}
                label="Total Posts"
                value={stats?.totalPosts || 0}
                trend={stats?.totalStories || 0}
                trendLabel="stories"
              />
              <StatCard
                icon={Heart}
                label="Total Likes"
                value={stats?.totalLikes || 0}
                trend={stats?.totalComments || 0}
                trendLabel="comments"
              />
              <StatCard
                icon={Activity}
                label="Active Today"
                value={stats?.activeUsersToday || 0}
                trend={stats?.newUsersToday || 0}
                trendLabel="new users"
              />
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Daily Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stats?.dailyGrowth || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="users" stroke="#ff3b3b" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="posts" stroke="#ff6b6b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Network Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Network Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.networkStats || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="userCount"
                          nameKey="network"
                        >
                          {(stats?.networkStats || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {stats?.networkStats.map((net, index) => {
                      const Icon = networkIcons[net.network];
                      return (
                        <div key={net.network} className="flex items-center gap-1 text-xs">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="capitalize">{net.network}</span>
                          <span className="text-muted-foreground">({formatNumber(net.userCount)})</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <CardTitle>User Management</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {filteredUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              @{user.username} · {user.email}
                            </p>
                          </div>
                          {user.isBanned && (
                            <Badge variant="destructive">Banned</Badge>
                          )}
                          {user.isAdmin && (
                            <Badge variant="default">Admin</Badge>
                          )}
                        </div>
                        <Button
                          variant={user.isBanned ? 'outline' : 'destructive'}
                          size="sm"
                          onClick={() => handleBanUser(user.id, !user.isBanned)}
                        >
                          {user.isBanned ? (
                            <><UserCheck className="w-4 h-4 mr-1" /> Unban</>
                          ) : (
                            <><Ban className="w-4 h-4 mr-1" /> Ban</>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.categoryStats.map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between">
                        <span>{cat.category}</span>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{formatNumber(cat.userCount)} users</span>
                          <span>{formatNumber(cat.postCount)} posts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Network Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Network Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.networkStats.map((net) => (
                      <div key={net.network} className="flex items-center justify-between">
                        <span className="capitalize">{net.network}</span>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{formatNumber(net.userCount)} users</span>
                          <span>{formatNumber(net.postCount)} posts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Admin Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Support Email</p>
                  <a 
                    href="mailto:socialhubsmondial@gmail.com" 
                    className="text-primary hover:underline"
                  >
                    socialhubsmondial@gmail.com
                  </a>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">WhatsApp Support</p>
                  <a 
                    href="https://wa.me/237659262653" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    +237 659 262 653
                  </a>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Admin Channels</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://wa.me/237659262653" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Music2 className="w-4 h-4 mr-1" />
                        TikTok
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="#" target="_blank" rel="noopener noreferrer">
                        <Send className="w-4 h-4 mr-1" />
                        Telegram
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  trend?: number;
  trendLabel?: string;
}

function StatCard({ icon: Icon, label, value, trend, trendLabel }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {trend !== undefined && (
            <div className="text-right">
              <span className="text-sm text-green-500 font-medium">+{formatNumber(trend)}</span>
              {trendLabel && <span className="text-xs text-muted-foreground ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{formatNumber(value)}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
