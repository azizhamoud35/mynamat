import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, MessageCircle, Share2, BookmarkPlus, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { getGroupPosts, subscribeToGroupPosts } from '@/lib/firebase/queries/posts';
import type { Post, Group } from '@/types/support';

interface GroupPostsProps {
  group: Group;
}

export function GroupPosts({ group }: GroupPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initializePosts = async () => {
      try {
        // First try to get cached data
        const cachedPosts = await getGroupPosts(group.id);
        if (cachedPosts.length > 0) {
          setPosts(cachedPosts);
          setLoading(false);
        }

        // Set up real-time listener
        unsubscribe = subscribeToGroupPosts(
          group.id,
          (updatedPosts) => {
            setPosts(updatedPosts);
            setLoading(false);
            setIsOffline(false);
          },
          (error) => {
            console.error('Posts subscription error:', error);
            if (error.code === 'unavailable' || error.code === 'failed-precondition') {
              setIsOffline(true);
              if (posts.length === 0) {
                toast.warning('Working offline. Some features may be limited.');
              }
            }
            setLoading(false);
          }
        );
      } catch (error: any) {
        console.error('Error initializing posts:', error);
        if (error.code === 'unavailable' || error.code === 'failed-precondition') {
          setIsOffline(true);
          if (posts.length === 0) {
            toast.warning('Working offline. Some features may be limited.');
          }
        } else {
          toast.error('Failed to load posts');
        }
        setLoading(false);
      }
    };

    initializePosts();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [group.id]);

  // Rest of the component remains the same...
  // (The UI rendering part is unchanged)
}