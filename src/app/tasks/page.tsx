'use client';

import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@solana/wallet-adapter-react';
import { Zap, Clock, Users, CheckCircle, Play, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  estimatedTime: string;
  participants: number;
  completed: boolean;
  proofRequired: boolean;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Survey: Solana Ecosystem',
    description: 'Take a 5-minute survey about your experience with Solana and earn SOL rewards.',
    reward: 0.1,
    difficulty: 'Easy',
    category: 'Survey',
    estimatedTime: '5 min',
    participants: 1247,
    completed: false,
    proofRequired: true,
  },
  {
    id: '2',
    title: 'Share on Twitter',
    description: 'Share our platform on Twitter with #SolanaRewards and tag 3 friends.',
    reward: 0.05,
    difficulty: 'Easy',
    category: 'Social',
    estimatedTime: '2 min',
    participants: 892,
    completed: false,
    proofRequired: true,
  },
  {
    id: '3',
    title: 'Test New Feature',
    description: 'Test our new wallet integration feature and provide feedback.',
    reward: 0.25,
    difficulty: 'Medium',
    category: 'Testing',
    estimatedTime: '15 min',
    participants: 156,
    completed: false,
    proofRequired: true,
  },
  {
    id: '4',
    title: 'Write Blog Post',
    description: 'Write a 500-word blog post about your experience with Solana DeFi.',
    reward: 0.5,
    difficulty: 'Hard',
    category: 'Content',
    estimatedTime: '45 min',
    participants: 23,
    completed: false,
    proofRequired: true,
  },
  {
    id: '5',
    title: 'Join Discord Community',
    description: 'Join our Discord server and introduce yourself in the #general channel.',
    reward: 0.02,
    difficulty: 'Easy',
    category: 'Community',
    estimatedTime: '3 min',
    participants: 2341,
    completed: false,
    proofRequired: false,
  },
];

export default function TasksPage() {
  const { connected } = useWallet();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Survey', 'Social', 'Testing', 'Content', 'Community'];

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    toast.success('Task completed! Proof submitted for review.');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

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
                  Please connect your Solana wallet to view and complete tasks.
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
            <h1 className="text-4xl font-bold mb-4">Available Tasks</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete tasks to earn SOL rewards. Choose from various categories and difficulty levels.
            </p>
          </div>

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

          {/* Tasks Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="solana-card border-0 hover:solana-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty}
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{task.participants}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold">{task.reward} SOL</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedTime}</span>
                    </div>
                  </div>
                  
                  {task.completed ? (
                    <Button disabled className="w-full bg-green-600 text-white">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleTaskComplete(task.id)}
                      className="w-full solana-gradient text-white hover:opacity-90"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {task.proofRequired ? 'Submit Proof' : 'Complete Task'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-16">
            <Card className="solana-card border-0">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold solana-gradient-text">{tasks.length}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold solana-gradient-text">
                      {tasks.filter(t => t.completed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold solana-gradient-text">
                      {tasks.reduce((sum, t) => sum + t.reward, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Rewards</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold solana-gradient-text">
                      {tasks.reduce((sum, t) => sum + t.participants, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Participants</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 