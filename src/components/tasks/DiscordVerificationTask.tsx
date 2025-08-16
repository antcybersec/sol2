'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, MessageCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DiscordVerificationTaskProps {
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

export function DiscordVerificationTask({ onComplete, onClose }: DiscordVerificationTaskProps) {
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'input' | 'join' | 'verify' | 'success'>('input');
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate verification code
  const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Discord server invite link (you would replace this with your actual server)
  const discordInviteLink = 'https://discord.gg/solana-rewards';
  
  // Verification message
  const verificationMessage = `!verify ${verificationCode}`;

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      toast.error('Please enter your Discord username');
      return;
    }
    
    // Remove # if user included it
    const cleanUsername = username.replace('#', '');
    setUsername(cleanUsername);
    setStep('join');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(verificationMessage);
    toast.success('Verification message copied!');
  };

  const handleJoinDiscord = () => {
    window.open(discordInviteLink, '_blank');
  };

  const handleVerifyMessage = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate API call to verify message
      // In a real app, you would check if the user joined and posted the message
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demo purposes, we'll simulate successful verification
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (success) {
        setStep('success');
        toast.success('Discord verification successful!');
      } else {
        toast.error('Verification message not found. Please make sure you joined the server and posted the message.');
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
            <span>Discord Verification Successful!</span>
          </CardTitle>
          <CardDescription className="text-center">
            Your Discord account has been verified successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MessageCircle className="w-8 h-8 text-indigo-500" />
              <span className="text-lg font-semibold">{username}</span>
            </div>
            <p className="text-muted-foreground">
              Your Discord account is now connected to your rewards profile.
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
          <CardTitle>Verify Your Message</CardTitle>
          <CardDescription>
            We&apos;re checking if you joined the server and posted the verification message...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Verifying your Discord message...
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setStep('join')} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleVerifyMessage} disabled={isVerifying} className="flex-1">
              {isVerifying ? 'Verifying...' : 'Check Again'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'join') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Join Discord Server</CardTitle>
          <CardDescription>
            Join our Discord server and post a verification message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Discord Username</Label>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              <span className="font-medium">{username}</span>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Steps to verify:</h4>
            <ol className="text-sm space-y-1">
              <li>1. Click &quot;Join Discord Server&quot; below</li>
              <li>2. Join the Solana Rewards server</li>
              <li>3. Go to the #verification channel</li>
              <li>4. Post the verification message below</li>
              <li>5. Click &quot;Verify Message&quot;</li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <Label>Verification Message</Label>
            <div className="relative">
              <div className="bg-gray-100 p-3 rounded border font-mono text-sm">
                {verificationMessage}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyMessage}
                className="absolute top-2 right-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Copy and paste this message in the #verification channel
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setStep('input')} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleJoinDiscord} className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Join Discord Server
            </Button>
            <Button onClick={() => setStep('verify')} className="flex-1">
              Verify Message
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
          <MessageCircle className="w-6 h-6 text-indigo-500" />
          <span>Connect Discord Account</span>
        </CardTitle>
        <CardDescription>
          Verify your Discord account to earn community rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Discord Username</Label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              id="username"
              placeholder="Enter your Discord username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Enter your Discord username (e.g., username#1234)
          </p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">What happens next?</h4>
          <ul className="text-sm space-y-1">
            <li>• You&apos;ll join our Discord server</li>
            <li>• Post a verification message</li>
            <li>• We&apos;ll verify your membership</li>
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