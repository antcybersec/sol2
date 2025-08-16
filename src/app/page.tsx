'use client';

import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet, Zap, Gift, Users, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { connected } = useWallet();

  const features = [
    {
      icon: Zap,
      title: 'Quick Tasks',
      description: 'Complete simple tasks and earn SOL instantly',
    },
    {
      icon: Gift,
      title: 'Gift Cards',
      description: 'Redeem earnings for popular subscription services',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of users earning rewards',
    },
    {
      icon: TrendingUp,
      title: 'Growing Rewards',
      description: 'More tasks and higher rewards added regularly',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '2,847', icon: Users },
    { label: 'Tasks Completed', value: '15,392', icon: Zap },
    { label: 'SOL Distributed', value: '1,247', icon: Wallet },
    { label: 'Gift Cards Redeemed', value: '892', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-50/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 solana-gradient text-white">
              <Star className="w-3 h-3 mr-1" />
              Powered by Solana
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Complete Tasks,
              <span className="solana-gradient-text block">Earn SOL</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the future of task-based rewards. Complete simple tasks, earn SOL, 
              and redeem for your favorite subscription services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {connected ? (
                <Link href="/tasks">
                  <Button size="lg" className="solana-gradient text-white hover:opacity-90">
                    <Zap className="w-5 h-5 mr-2" />
                    Start Earning
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="solana-gradient text-white hover:opacity-90">
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </Button>
              )}
              <Link href="/rewards">
                <Button variant="outline" size="lg">
                  <Gift className="w-5 h-5 mr-2" />
                  View Rewards
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="solana-card border-0 text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-2xl font-bold solana-gradient-text">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Solana Rewards?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the fastest, most cost-effective way to earn rewards on the blockchain.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="solana-card border-0 hover:solana-glow transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 solana-gradient rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="solana-card border-0">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Connect your wallet and start completing tasks to earn SOL rewards. 
                Join thousands of users already earning on our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tasks">
                  <Button size="lg" className="solana-gradient text-white hover:opacity-90">
                    <Zap className="w-5 h-5 mr-2" />
                    Browse Tasks
                  </Button>
                </Link>
                <Link href="/rewards">
                  <Button variant="outline" size="lg">
                    <Gift className="w-5 h-5 mr-2" />
                    View Available Rewards
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
