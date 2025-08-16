'use client';

import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useWallet } from '@solana/wallet-adapter-react';
import { Gift, Wallet, Zap, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
  category: string;
  popular: boolean;
  available: boolean;
}

interface UserStats {
  totalEarned: number;
  totalRedeemed: number;
  availableBalance: number;
  tasksCompleted: number;
  rewardsRedeemed: number;
}

const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Netflix Gift Card',
    description: '1 month subscription to Netflix Premium',
    cost: 0.5,
    image: '🎬',
    category: 'Streaming',
    popular: true,
    available: true,
  },
  {
    id: '2',
    name: 'Spotify Premium',
    description: '1 month subscription to Spotify Premium',
    cost: 0.3,
    image: '🎵',
    category: 'Music',
    popular: true,
    available: true,
  },
  {
    id: '3',
    name: 'ChatGPT Plus',
    description: '1 month subscription to ChatGPT Plus',
    cost: 0.4,
    image: '🤖',
    category: 'Productivity',
    popular: false,
    available: true,
  },
  {
    id: '4',
    name: 'YouTube Premium',
    description: '1 month subscription to YouTube Premium',
    cost: 0.35,
    image: '📺',
    category: 'Streaming',
    popular: false,
    available: true,
  },
  {
    id: '5',
    name: 'Discord Nitro',
    description: '1 month subscription to Discord Nitro',
    cost: 0.2,
    image: '💬',
    category: 'Gaming',
    popular: false,
    available: true,
  },
  {
    id: '6',
    name: 'GitHub Pro',
    description: '1 month subscription to GitHub Pro',
    cost: 0.6,
    image: '💻',
    category: 'Development',
    popular: false,
    available: true,
  },
];

const mockUserStats: UserStats = {
  totalEarned: 2.45,
  totalRedeemed: 1.2,
  availableBalance: 1.25,
  tasksCompleted: 8,
  rewardsRedeemed: 3,
};

export default function RewardsPage() {
  const { connected } = useWallet();
  const [userStats] = useState<UserStats>(mockUserStats);
  const [rewards] = useState<Reward[]>(mockRewards);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Streaming', 'Music', 'Productivity', 'Gaming', 'Development'];

  const handleRedeem = (reward: Reward) => {
    if (userStats.availableBalance < reward.cost) {
      toast.error('Insufficient balance. Complete more tasks to earn SOL.');
      return;
    }
    toast.success(`${reward.name} redeemed successfully! Check your email for the gift card.`);
  };

  const filteredRewards = selectedCategory === 'All' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

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
                  Please connect your Solana wallet to view your rewards and earnings.
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
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Your Rewards</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Redeem your earned SOL for popular subscription services and gift cards.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">{userStats.availableBalance} SOL</div>
              </CardContent>
            </Card>

            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Total Earned</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">{userStats.totalEarned} SOL</div>
              </CardContent>
            </Card>

            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Tasks Completed</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">{userStats.tasksCompleted}</div>
              </CardContent>
            </Card>

            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <span className="text-sm text-muted-foreground">Rewards Redeemed</span>
                </div>
                <div className="text-2xl font-bold solana-gradient-text">{userStats.rewardsRedeemed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="solana-card border-0 mb-12">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress to Next Reward</span>
                <span className="text-sm text-muted-foreground">
                  {userStats.availableBalance.toFixed(2)} / 0.5 SOL
                </span>
              </div>
              <Progress value={(userStats.availableBalance / 0.5) * 100} className="mb-2" />
              <p className="text-xs text-muted-foreground">
                Complete more tasks to unlock higher-tier rewards
              </p>
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "solana-gradient text-white" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Rewards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <Card key={reward.id} className="solana-card border-0 hover:solana-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    {reward.popular && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <div className="text-2xl">{reward.image}</div>
                  </div>
                  <CardTitle className="text-lg">{reward.name}</CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{reward.cost} SOL</span>
                    </div>
                    <Badge variant="secondary">{reward.category}</Badge>
                  </div>
                  
                  <Button 
                    onClick={() => handleRedeem(reward)}
                    disabled={!reward.available || userStats.availableBalance < reward.cost}
                    className="w-full solana-gradient text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    {userStats.availableBalance < reward.cost ? 'Insufficient Balance' : 'Redeem Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-16">
            <Card className="solana-card border-0">
              <CardContent className="pt-12 pb-12 text-center">
                <h2 className="text-2xl font-bold mb-4">More Rewards Coming Soon</h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We&apos;re constantly adding new subscription services and gift cards. 
                  Stay tuned for more exciting rewards!
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Badge variant="outline" className="px-4 py-2">Amazon Prime</Badge>
                  <Badge variant="outline" className="px-4 py-2">Disney+</Badge>
                  <Badge variant="outline" className="px-4 py-2">Hulu</Badge>
                  <Badge variant="outline" className="px-4 py-2">Apple Music</Badge>
                  <Badge variant="outline" className="px-4 py-2">Adobe Creative Cloud</Badge>
                  <Badge variant="outline" className="px-4 py-2">Notion Pro</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 