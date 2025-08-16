'use client';

import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet, Zap, Gift, Clock, CheckCircle, Copy, ExternalLink, Settings, Activity, History } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  type: 'task_completed' | 'reward_redeemed' | 'sol_received';
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Survey Completed',
    description: 'Solana Ecosystem Survey',
    amount: 0.1,
    timestamp: '2024-01-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    type: 'reward_redeemed',
    title: 'Netflix Gift Card',
    description: '1 month subscription redeemed',
    amount: 0.5,
    timestamp: '2024-01-14T15:45:00Z',
    status: 'completed',
  },
  {
    id: '3',
    type: 'sol_received',
    title: 'Task Reward',
    description: 'Social media share task',
    amount: 0.05,
    timestamp: '2024-01-13T09:20:00Z',
    status: 'completed',
  },
  {
    id: '4',
    type: 'task_completed',
    title: 'Feature Testing',
    description: 'Wallet integration testing',
    amount: 0.25,
    timestamp: '2024-01-12T14:15:00Z',
    status: 'pending',
  },
];

export default function ProfilePage() {
  const { connected, publicKey } = useWallet();
  const [activities] = useState<ActivityItem[]>(mockActivities);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast.success('Wallet address copied to clipboard!');
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'reward_redeemed': return <Gift className="w-4 h-4 text-pink-500" />;
      case 'sol_received': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20">
        <Navigation />
        <div className="pt-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="solana-card border-0">
              <CardContent className="pt-12 pb-12">
                <Wallet className="w-16 h-16 mx-auto mb-6 text-purple-600" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-8">
                  Please connect your Solana wallet to view your profile and activity.
                </p>
                <Button className="solana-gradient text-white">
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <div className="mb-12">
            <Card className="solana-card border-0">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/api/placeholder/80/80" />
                    <AvatarFallback className="solana-gradient text-white text-xl">
                      {publicKey?.toString().slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl font-bold mb-2">Solana User</h1>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                      <Badge className="solana-gradient text-white">
                        <Wallet className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                      <Badge variant="outline">Level 3</Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Wallet Address:</span>
                      <code className="bg-muted px-2 py-1 rounded">
                        {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAddress}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">2.45 SOL</div>
              </CardContent>
            </Card>

            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Tasks Completed</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">8</div>
              </CardContent>
            </Card>

            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <span className="text-sm text-muted-foreground">Rewards Redeemed</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">3</div>
              </CardContent>
            </Card>

            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Member Since</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">Dec 2023</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="activity" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-6">
              <Card className="solana-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Your recent task completions and reward redemptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{activity.title}</h4>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.amount && (
                          <div className="flex-shrink-0 text-right">
                            <div className="text-sm font-medium solana-gradient-text">
                              +{activity.amount} SOL
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="solana-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Account Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notifications</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email notifications</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Task completion alerts</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Reward redemption confirmations</span>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Privacy</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Public profile</span>
                        <Button variant="outline" size="sm">Private</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Show wallet address</span>
                        <Button variant="outline" size="sm">Hidden</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Danger Zone</h4>
                    <div className="space-y-2">
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 