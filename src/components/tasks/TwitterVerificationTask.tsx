'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Twitter, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface TwitterVerificationTaskProps {
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

export function TwitterVerificationTask({ onComplete, onClose }: TwitterVerificationTaskProps) {
  const [username, setUsername] = useState('');
  const [verificationTweet, setVerificationTweet] = useState('');
  const [step, setStep] = useState<'input' | 'tweet' | 'verify' | 'success'>('input');
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate verification code
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Generate verification tweet text
  const tweetText = `I'm earning SOL rewards on @SolanaRewards! 🚀\n\nVerification code: ${verificationCode}\n\nJoin me: https://solana-rewards.vercel.app #SolanaRewards #Web3`;

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      toast.error('Please enter your Twitter username');
      return;
    }
    
    // Remove @ if user included it
    const cleanUsername = username.replace('@', '');
    setUsername(cleanUsername);
    setVerificationTweet(tweetText);
    setStep('tweet');
  };

  const handleCopyTweet = () => {
    navigator.clipboard.writeText(verificationTweet);
    toast.success('Tweet copied to clipboard!');
  };

  const handleOpenTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(verificationTweet)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleVerifyTweet = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate API call to verify tweet
      // In a real app, you would call Twitter API to check if the tweet exists
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll simulate successful verification
      // In production, you'd verify the tweet actually exists with the code
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setStep('success');
        toast.success('Twitter verification successful!');
      } else {
        toast.error('Tweet not found. Please make sure you posted the verification tweet.');
      }
    } catch {
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleComplete = () => {
    onComplete(true);
  };

  if (step === 'success') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span>Twitter Verification Successful!</span>
          </CardTitle>
          <CardDescription className="text-center">
            Your Twitter account has been verified successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Twitter className="w-8 h-8 text-blue-400" />
              <span className="text-lg font-semibold">@{username}</span>
            </div>
            <p className="text-muted-foreground">
              Your Twitter account is now connected to your rewards profile.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button onClick={handleComplete} className="flex-1">
              Claim Reward
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verify Your Tweet</CardTitle>
          <CardDescription>
            We&apos;re checking if you posted the verification tweet...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Verifying your tweet on Twitter...
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setStep('tweet')} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleVerifyTweet} disabled={isVerifying} className="flex-1">
              {isVerifying ? 'Verifying...' : 'Check Again'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'tweet') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Post Verification Tweet</CardTitle>
          <CardDescription>
            Copy and post this tweet to verify your Twitter account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Twitter Username</Label>
            <div className="flex items-center space-x-2">
              <Twitter className="w-5 h-5 text-blue-400" />
              <span className="font-medium">@{username}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Verification Tweet</Label>
            <div className="relative">
              <Textarea 
                value={verificationTweet}
                readOnly
                className="min-h-[120px] bg-gray-50"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyTweet}
                className="absolute top-2 right-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This tweet contains a unique verification code that we&apos;ll use to verify your account.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Steps to verify:</h4>
            <ol className="text-sm space-y-1">
              <li>1. Copy the tweet above</li>
              <li>2. Post it on your Twitter account</li>
              <li>3. Make sure the tweet is public</li>
              <li>4. Click &quot;Verify Tweet&quot; below</li>
            </ol>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setStep('input')} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleOpenTwitter} className="flex-1">
              <Twitter className="w-4 h-4 mr-2" />
              Open Twitter
            </Button>
            <Button onClick={() => setStep('verify')} className="flex-1">
              Verify Tweet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Twitter className="w-6 h-6 text-blue-400" />
          <span>Connect Twitter Account</span>
        </CardTitle>
        <CardDescription>
          Verify your Twitter account to earn social media rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Twitter Username</Label>
          <div className="relative">
            <Twitter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="username"
              placeholder="Enter your Twitter username (without @)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your Twitter username without the @ symbol
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="text-sm space-y-1">
            <li>• You&apos;ll need to post a verification tweet</li>
            <li>• We&apos;ll verify the tweet exists</li>
            <li>• Your account will be connected</li>
            <li>• You&apos;ll receive SOL rewards</li>
          </ul>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleUsernameSubmit} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 