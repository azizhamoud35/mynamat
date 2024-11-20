import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lock, MessagesSquare, MessageSquareText } from 'lucide-react';
import type { Group } from '@/types/support';

interface GroupListProps {
  groups: Group[];
  onOpenChat: (group: Group) => void;
  onSelectGroup: (group: Group) => void;
}

export function GroupList({ groups, onOpenChat, onSelectGroup }: GroupListProps) {
  return (
    <ScrollArea className="h-[300px]">
      {groups.map((group, index) => (
        <motion.div
          key={group.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
        >
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <button
                    onClick={() => onSelectGroup(group)}
                    className="flex items-center gap-2 hover:text-primary transition-colors text-left font-medium"
                  >
                    {group.name}
                    {group.isPrivate && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                  </button>
                  <p className="text-sm text-muted-foreground/75">
                    {group.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onOpenChat(group)}
                    className="border-muted-foreground/20 hover:bg-muted/50"
                  >
                    <MessagesSquare className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                  <Badge variant="secondary" className="text-xs">
                    {group.members} members
                  </Badge>
                </div>
              </div>

              {group.lastPost && (
                <div className="flex items-center gap-2 mt-2">
                  {group.unread > 0 && (
                    <Badge variant="default" className="text-xs shrink-0">
                      {group.unread} new posts
                    </Badge>
                  )}
                  <MessageSquareText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    {group.lastPost}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </ScrollArea>
  );
}