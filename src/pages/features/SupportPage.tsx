import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessagesSquare, Search, Plus, MessageSquareText } from 'lucide-react';
import { GroupList } from '@/components/customer/GroupList';
import { GroupChat } from '@/components/customer/GroupChat';
import { GroupPosts } from '@/components/customer/GroupPosts';
import { CreatePost } from '@/components/customer/CreatePost';

const groups = [
  {
    id: '1',
    name: 'Weight Loss Warriors',
    members: 128,
    unread: 3,
    isPrivate: false,
    description: 'Support group for weight loss journey',
    lastPost: 'Great progress everyone! Keep pushing forward!'
  },
  {
    id: '2',
    name: 'Mindfulness & Meditation',
    members: 85,
    unread: 0,
    isPrivate: true,
    description: 'Daily meditation and mindfulness practices',
    lastPost: 'Today\'s meditation focus will be on gratitude'
  },
  {
    id: '3',
    name: 'Healthy Cooking Club',
    members: 256,
    unread: 1,
    isPrivate: false,
    description: 'Share healthy recipes and cooking tips',
    lastPost: 'Here\'s my favorite protein-packed breakfast recipe'
  },
  {
    id: '4',
    name: 'Fitness Beginners',
    members: 156,
    unread: 0,
    isPrivate: false,
    description: 'Support for those starting their fitness journey',
    lastPost: 'What was your first gym experience like?'
  }
];

export function SupportPage() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenChat = (group: any) => {
    setSelectedGroup(group);
    setShowChat(true);
  };

  const handleSelectGroup = (group: any) => {
    setSelectedGroup(group);
    setShowChat(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Support Groups</h1>
        <p className="text-muted-foreground">
          Connect with others, share experiences, and find support on your wellness journey.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Join New Group
        </Button>
      </div>

      <Card>
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
                    <div className="grid gap-4 md:grid-cols-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-muted" />
                            <div>
                              <div className="font-medium">Member Name</div>
                              <div className="text-sm text-muted-foreground">Joined 2 months ago</div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          ) : (
            <GroupList
              groups={filteredGroups}
              onOpenChat={handleOpenChat}
              onSelectGroup={handleSelectGroup}
            />
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}