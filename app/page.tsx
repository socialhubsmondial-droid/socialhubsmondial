'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, Chrome, 
  Instagram, Youtube, Twitter, Facebook, 
  MessageCircle, Send, Music2, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore, useThemeStore } from '@/lib/store';
import { toast } from 'sonner';

const socialNetworks = [
  { icon: Instagram, name: 'Instagram', color: 'from-purple-500 via-pink-500 to-orange-500' },
  { icon: Music2, name: 'TikTok', color: 'from-black to-pink-600' },
  { icon: Youtube, name: 'YouTube', color: 'from-red-600 to-red-700' },
  { icon: Twitter, name: 'Twitter', color: 'from-sky-400 to-sky-500' },
  { icon: Facebook, name: 'Facebook', color: 'from-blue-600 to-blue-700' },
  { icon: Send, name: 'Telegram', color: 'from-sky-400 to-blue-500' },
  { icon: MessageCircle, name: 'WhatsApp', color: 'from-green-500 to-green-600' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading } = useAuthStore();
  const { darkMode } = useThemeStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back!');
        router.push('/feed');
      } else {
        toast.error('Invalid credentials');
      }
    } else {
      if (!agreeTerms) {
        toast.error('Please agree to the terms');
        return;
      }
      const success = await login(email, password);
      if (success) {
        toast.success('Account created successfully!');
        router.push('/feed');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      toast.success('Welcome!');
      router.push('/feed');
    }
  };

  const quickLogin = async (type: 'user' | 'admin') => {
    if (type === 'admin') {
      const success = await login('millionsonknives@gmail.com', 'aurel12345&');
      if (success) {
        toast.success('Welcome Admin!');
        router.push('/admin');
      }
    } else {
      const success = await login('demo@example.com', 'demo123');
      if (success) {
        toast.success('Welcome!');
        router.push('/feed');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Branding */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 relative overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-background">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1920&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center p-8 lg:p-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">SocialHub</h1>
            </div>
            
            <p className="text-xl lg:text-2xl text-white/90 mb-4 font-light">
              Promote all your social networks<br />in one place
            </p>
            
            <p className="text-white/60 text-sm mb-8">
              Powered by ImageTouch
            </p>
            
            {/* Social Network Icons */}
            <div className="flex flex-wrap justify-center gap-3">
              {socialNetworks.map((network, index) => (
                <motion.div
                  key={network.name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${network.color} flex items-center justify-center shadow-lg cursor-pointer`}
                  title={network.name}
                >
                  <network.icon className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-16"
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin ? 'Sign in to continue to SocialHub' : 'Join the ultimate social hub'}
                </p>
              </div>

              {/* Google Login */}
              <Button
                variant="outline"
                className="w-full mb-4 h-12 relative overflow-hidden group"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <Chrome className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="John Doe"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-12"
                        required={!isLogin}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="h-12"
                        required={!isLogin}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-11 pr-11"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm font-normal leading-tight cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </Label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              {/* Quick Demo Login */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Login</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => quickLogin('user')}
                  >
                    User Demo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => quickLogin('admin')}
                  >
                    Admin Demo
                  </Button>
                </div>
              </div>

              {/* Toggle */}
              <p className="text-center text-sm text-muted-foreground mt-6">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>

              {/* Footer */}
              <div className="mt-8 text-center text-xs text-muted-foreground">
                <p>Developer: Black King</p>
                <p>Full Stack Developer: Primus Dev</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
