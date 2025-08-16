'use client';

import { Navigation } from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@solana/wallet-adapter-react';
import { Zap, Clock, Users, CheckCircle, Play, Wallet } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useBalance } from '@/contexts/BalanceContext';
import { QuizTask } from '@/components/tasks/QuizTask';
import { TwitterVerificationTask } from '@/components/tasks/TwitterVerificationTask';
import { DiscordVerificationTask } from '@/components/tasks/DiscordVerificationTask';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  taskType?: 'quiz' | 'verification' | 'profile' | 'survey' | 'daily' | 'social' | 'education' | 'referral' | 'testing' | 'feedback' | 'challenge' | 'content';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Solana Knowledge Quiz',
    description: 'Answer 5 questions about Solana blockchain. Get 4+ correct to earn rewards.',
    reward: 0.1,
    difficulty: 'Easy',
    category: 'Quiz',
    estimatedTime: '5 min',
    participants: 1247,
    completed: false,
    proofRequired: false,
    taskType: 'quiz',
  },
  {
    id: '2',
    title: 'Verify Your Email',
    description: 'Enter your email address to verify your account and earn bonus rewards.',
    reward: 0.05,
    difficulty: 'Easy',
    category: 'Verification',
    estimatedTime: '2 min',
    participants: 892,
    completed: false,
    proofRequired: false,
    taskType: 'verification',
  },
  {
    id: '3',
    title: 'Complete Profile Setup',
    description: 'Fill out your complete profile with bio, location, and interests.',
    reward: 0.08,
    difficulty: 'Easy',
    category: 'Profile',
    estimatedTime: '3 min',
    participants: 567,
    completed: false,
    proofRequired: false,
    taskType: 'profile',
  },
  {
    id: '4',
    title: 'Take Platform Feedback Survey',
    description: 'Complete a short survey about your experience with our platform.',
    reward: 0.12,
    difficulty: 'Easy',
    category: 'Survey',
    estimatedTime: '8 min',
    participants: 234,
    completed: false,
    proofRequired: false,
    taskType: 'survey',
  },
  {
    id: '5',
    title: 'Daily Check-in',
    description: 'Check in daily to maintain your streak and earn rewards.',
    reward: 0.02,
    difficulty: 'Easy',
    category: 'Daily',
    estimatedTime: '1 min',
    participants: 2341,
    completed: false,
    proofRequired: false,
    taskType: 'daily',
  },
  {
    id: '6',
    title: 'Verify Twitter Account',
    description: 'Connect your Twitter/X account to earn social media rewards.',
    reward: 0.06,
    difficulty: 'Easy',
    category: 'Social',
    estimatedTime: '3 min',
    participants: 445,
    completed: false,
    proofRequired: false,
    taskType: 'social',
  },
  {
    id: '7',
    title: 'Complete Tutorial',
    description: 'Watch our platform tutorial video and answer 3 questions.',
    reward: 0.15,
    difficulty: 'Easy',
    category: 'Education',
    estimatedTime: '10 min',
    participants: 123,
    completed: false,
    proofRequired: false,
    taskType: 'education',
  },
  {
    id: '8',
    title: 'Refer a Friend',
    description: 'Share your referral link and get a friend to join the platform.',
    reward: 0.25,
    difficulty: 'Medium',
    category: 'Referral',
    estimatedTime: '5 min',
    participants: 89,
    completed: false,
    proofRequired: true,
    taskType: 'referral',
  },
  {
    id: '9',
    title: 'Submit Bug Report',
    description: 'Find and report any bugs you encounter while using the platform.',
    reward: 0.2,
    difficulty: 'Medium',
    category: 'Testing',
    estimatedTime: '15 min',
    participants: 67,
    completed: false,
    proofRequired: true,
    taskType: 'testing',
  },
  {
    id: '10',
    title: 'Feature Request',
    description: 'Submit a detailed feature request with use case explanation.',
    reward: 0.18,
    difficulty: 'Medium',
    category: 'Feedback',
    estimatedTime: '12 min',
    participants: 45,
    completed: false,
    proofRequired: true,
    taskType: 'feedback',
  },
  {
    id: '11',
    title: 'Weekly Challenge',
    description: 'Complete 5 tasks this week to unlock bonus rewards.',
    reward: 0.5,
    difficulty: 'Hard',
    category: 'Challenge',
    estimatedTime: '30 min',
    participants: 23,
    completed: false,
    proofRequired: false,
    taskType: 'challenge',
  },
  {
    id: '12',
    title: 'Platform Review',
    description: 'Write a detailed review about your experience with our platform.',
    reward: 0.3,
    difficulty: 'Medium',
    category: 'Content',
    estimatedTime: '20 min',
    participants: 34,
    completed: false,
    proofRequired: true,
    taskType: 'content',
  },
  {
    id: '13',
    title: 'Security Quiz',
    description: 'Complete a security awareness quiz about crypto wallet safety.',
    reward: 0.1,
    difficulty: 'Easy',
    category: 'Quiz',
    estimatedTime: '6 min',
    participants: 156,
    completed: false,
    proofRequired: false,
    taskType: 'quiz',
  },
  {
    id: '14',
    title: 'Profile Picture Upload',
    description: 'Upload a profile picture to complete your account setup.',
    reward: 0.03,
    difficulty: 'Easy',
    category: 'Profile',
    estimatedTime: '2 min',
    participants: 789,
    completed: false,
    proofRequired: false,
    taskType: 'profile',
  },
  {
    id: '15',
    title: 'Verify Discord Account',
    description: 'Connect your Discord account to join our community.',
    reward: 0.04,
    difficulty: 'Easy',
    category: 'Social',
    estimatedTime: '3 min',
    participants: 234,
    completed: false,
    proofRequired: false,
    taskType: 'social',
  },
];

export default function TasksPage() {
  const { connected } = useWallet();
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCompleting, setIsCompleting] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { totalBalance, addEarnedBalance, isProcessing, refreshBalance } = useBalance();

  const categories = ['All', 'Quiz', 'Verification', 'Profile', 'Survey', 'Daily', 'Social', 'Education', 'Referral', 'Testing', 'Feedback', 'Challenge', 'Content'];

  const handleTaskStart = (task: Task) => {
    setActiveTask(task);
    setShowTaskModal(true);
  };

  const handleTaskComplete = async (taskId: string, taskSuccess: boolean = true) => {
    if (isCompleting || isProcessing) return; // Prevent multiple clicks
    
    setIsCompleting(taskId);
    setShowTaskModal(false);
    setActiveTask(null);
    
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (!taskSuccess) {
        toast.error('Task not completed. Please try again.');
        return;
      }

      // Show processing state
      toast.loading(`Processing task completion and sending ${task.reward} SOL from platform wallet...`);
      
      // Simulate task review and approval
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update task status
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, completed: true } : t
      ));
      
      // Send real SOL using platform wallet
      const success = await addEarnedBalance(task.reward);
      
      if (success) {
        toast.success(`Task completed! ${task.reward} SOL sent to your wallet from platform!`);
        
        // Show transaction details
        if (totalBalance !== null) {
          const newBalance = totalBalance + task.reward;
          toast.info(`Platform Transfer: +${task.reward} SOL | New Balance: ${newBalance.toFixed(4)} SOL`);
        }
      } else {
        toast.error('Failed to send SOL. Please try again.');
      }
      
    } catch {
      toast.error('Task completion failed. Please try again.');
    } finally {
      setIsCompleting(null);
    }
  };

  const handleTaskClose = () => {
    setShowTaskModal(false);
    setActiveTask(null);
  };

  const renderTaskModal = () => {
    if (!activeTask) return null;

    switch (activeTask.taskType) {
      case 'quiz':
        return (
          <QuizTask 
            onComplete={(success) => handleTaskComplete(activeTask.id, success)}
            onClose={handleTaskClose}
          />
        );
      case 'social':
        // Check if it's Twitter or Discord based on task title
        if (activeTask.title.toLowerCase().includes('twitter')) {
          return (
            <TwitterVerificationTask 
              onComplete={(success) => handleTaskComplete(activeTask.id, success)}
              onClose={handleTaskClose}
            />
          );
        } else if (activeTask.title.toLowerCase().includes('discord')) {
          return (
            <DiscordVerificationTask 
              onComplete={(success) => handleTaskComplete(activeTask.id, success)}
              onClose={handleTaskClose}
            />
          );
        }
        // Fallback for other social tasks
        break;
      default:
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{activeTask.title}</CardTitle>
              <CardDescription>{activeTask.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  This task requires manual completion. Please complete the task and then click the button below.
                </p>
                <div className="flex space-x-2">
                  <Button onClick={handleTaskClose} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleTaskComplete(activeTask.id)}
                    className="flex-1"
                  >
                    Mark as Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
    }
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

          {/* Balance Display */}
          <div className="mb-8">
            <Card className="solana-card border-0 max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2">
                  <Wallet className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-muted-foreground">Current Balance:</span>
                  <span className="text-xl font-bold solana-gradient-text">{totalBalance !== null ? totalBalance.toFixed(4) : 'Loading...'} SOL</span>
                  <Button 
                    onClick={() => refreshBalance()} 
                    size="sm" 
                    variant="outline"
                    className="ml-2"
                    disabled={isProcessing}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </Button>
                </div>
                {isProcessing && (
                  <div className="text-center mt-2">
                    <div className="text-xs text-muted-foreground">Processing transaction...</div>
                  </div>
                )}
              </CardContent>
            </Card>
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
                      onClick={() => handleTaskStart(task)}
                      disabled={isCompleting === task.id || isProcessing}
                      className="w-full solana-gradient text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {isCompleting === task.id || isProcessing ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          {isProcessing ? 'Sending from Platform Wallet...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          {task.proofRequired ? 'Submit Proof' : 'Start Task'}
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Task Modal */}
          <Dialog open={showTaskModal} onOpenChange={setShowTaskModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{activeTask?.title}</DialogTitle>
              </DialogHeader>
              {renderTaskModal()}
            </DialogContent>
          </Dialog>

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