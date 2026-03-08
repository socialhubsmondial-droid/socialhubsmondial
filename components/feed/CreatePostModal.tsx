'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Image, Video, Link2, Send, 
  Instagram, Youtube, Twitter, Facebook, Music2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import type { SocialNetwork } from '@/lib/types';

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const networks: { id: SocialNetwork; icon: React.ElementType; label: string; color: string }[] = [
  { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'from-purple-500 via-pink-500 to-orange-500' },
  { id: 'tiktok', icon: Music2, label: 'TikTok', color: 'from-black to-pink-600' },
  { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'from-red-600 to-red-700' },
  { id: 'twitter', icon: Twitter, label: 'Twitter', color: 'from-sky-400 to-sky-500' },
  { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'from-blue-600 to-blue-700' },
];

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetwork>('native');
  const [forwardUrl, setForwardUrl] = useState('');
  const [isForwarding, setIsForwarding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  }, [files, previews]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi'],
    },
    maxFiles: 10,
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0 && !forwardUrl) {
      toast.error('Please add some content');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(isForwarding ? 'Post forwarded successfully!' : 'Post created successfully!');
    
    // Reset form
    setContent('');
    setFiles([]);
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
    setForwardUrl('');
    setIsForwarding(false);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{user?.displayName}</p>
              <p className="text-xs text-muted-foreground">@{user?.username}</p>
            </div>
          </div>

          {/* Content */}
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          {/* Forward URL */}
          {isForwarding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <input
                type="url"
                placeholder="Paste post URL..."
                value={forwardUrl}
                onChange={(e) => setForwardUrl(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-lg text-sm"
              />
              <div className="flex gap-2 flex-wrap">
                {networks.map(({ id, icon: Icon, label, color }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedNetwork(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedNetwork === id
                        ? `bg-gradient-to-r ${color} text-white`
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Media Previews */}
          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex justify-center gap-4 mb-2">
              <Image className="w-6 h-6 text-muted-foreground" />
              <Video className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsForwarding(!isForwarding)}
                className={isForwarding ? 'text-primary' : ''}
              >
                <Link2 className="w-4 h-4 mr-1" />
                Forward
              </Button>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || (!content.trim() && files.length === 0 && !forwardUrl)}
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
