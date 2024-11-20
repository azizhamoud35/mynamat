import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone,
  Mail,
  Globe,
  Moon,
  Volume2,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function SettingsPage() {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Personal Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="profile">
            <div className="border-b">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                  value="profile"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Privacy
                </TabsTrigger>
                <TabsTrigger
                  value="preferences"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary"
                >
                  Preferences
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      defaultValue={userData?.firstName}
                      placeholder="Enter your first name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      defaultValue={userData?.lastName}
                      placeholder="Enter your last name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue={userData?.email}
                      placeholder="Enter your email" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      defaultValue={userData?.phone}
                      placeholder="Enter your phone number" 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Appointment Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about upcoming sessions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Group Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new posts in your groups
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Course Progress</Label>
                        <p className="text-sm text-muted-foreground">
                          Updates about your learning progress
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Summary</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive weekly progress updates
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Newsletter</Label>
                        <p className="text-sm text-muted-foreground">
                          Get wellness tips and updates
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Profile Visibility</Label>
                        <p className="text-sm text-muted-foreground">
                          Show your profile to other members
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Activity Status</Label>
                        <p className="text-sm text-muted-foreground">
                          Show when you're online
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Data Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Collection</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow anonymous usage data collection
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">App Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Toggle dark mode theme
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable app sound effects
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Language</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred language
                        </p>
                      </div>
                      <select className="rounded-md border px-3 py-2">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}