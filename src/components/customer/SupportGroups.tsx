import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessagesSquare, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';
import { GroupList } from './GroupList';
import { GroupChat } from './GroupChat';
import { GroupPosts } from './GroupPosts';
import { CreatePost } from './CreatePost';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const groups = [
  {
    id: '1',
    name: 'Weight Loss Warriors',
    members: 128,
    unread: 3,
    isPrivate: false,
    description: 'Support group for weight loss journey',
    lastPost: 'Great progress everyone! Keep...'
  },
  {
    id: '2',
    name: 'Mindfulness & Meditation',
    members: 85,
    unread: 0,
    isPrivate: true,
    description: 'Daily meditation and mindfulness practices',
    lastPost: 'Today\'s meditation focus will be...'
  },
  {
    id: '3',
    name: 'Healthy Cooking Club',
    members: 256,
    unread: 1,
    isPrivate: false,
    description: 'Share healthy recipes and cooking tips',
    lastPost: 'Here\'s my favorite healthy recipe...'
  }
];

export function SupportGroups() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handleOpenChat = (group: any) => {
    setSelectedGroup(group);
    setShowChat(true);
  };

  const handleSelectGroup = (group: any) => {
    setSelectedGroup(group);
    setShowChat(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Support Groups
          </CardTitle>
          <Button size="sm" variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Join Group
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {selectedGroup ? (
          <div className="divide-y">
            <div className="p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{selectedGroup.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedGroup.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedGroup.members} members
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenChat(selectedGroup)}
                    className="border-muted-foreground/20"
                  >
                    <MessagesSquare className="h-4 w-4 mr-2" />
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="members"
                    className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                  >
                    Members
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="p-4">
                  <div className="flex justify-end mb-4">
                    <Button onClick={() => setShowCreatePost(true)}>
                      <MessageSquareText className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                  <GroupPosts group={selectedGroup} />
                </TabsContent>
                <TabsContent value="members" className="p-4">
                  Members list coming soon...
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <GroupList
            groups={groups}
            onOpenChat={handleOpenChat}
            onSelectGroup={handleSelectGroup}
          />
        )}
      </CardContent>

      {showChat && selectedGroup && (
        <GroupChat
          group={selectedGroup}
          onClose={() => setShowChat(false)}
        />
      )}

      {showCreatePost && selectedGroup && (
        <CreatePost
          group={selectedGroup}
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
        />
      )}
    </Card>
  );
}