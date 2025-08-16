'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizTaskProps {
  onComplete: (success: boolean) => void;
  onClose: () => void;
}

const solanaQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is Solana's main advantage over other blockchains?",
    options: [
      "Lower transaction fees",
      "Higher transaction speed",
      "Better privacy",
      "More decentralization"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What consensus mechanism does Solana use?",
    options: [
      "Proof of Work",
      "Proof of Stake",
      "Proof of History",
      "Delegated Proof of Stake"
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is the native token of Solana?",
    options: [
      "SOL",
      "SUN",
      "SALT",
      "SAND"
    ],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "What is the approximate TPS (Transactions Per Second) of Solana?",
    options: [
      "1,000 TPS",
      "10,000 TPS",
      "65,000 TPS",
      "100,000 TPS"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "What programming language is primarily used for Solana smart contracts?",
    options: [
      "Solidity",
      "Rust",
      "JavaScript",
      "Python"
    ],
    correctAnswer: 1
  }
];

export function QuizTask({ onComplete, onClose }: QuizTaskProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < solanaQuizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate score
    const correctAnswers = answers.filter((answer, index) => 
      answer === solanaQuizQuestions[index].correctAnswer
    ).length;
    
    const score = (correctAnswers / solanaQuizQuestions.length) * 100;
    const passed = score >= 80; // 80% or higher to pass
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    onComplete(passed);
  };

  const getScore = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === solanaQuizQuestions[index].correctAnswer
    ).length;
    return (correctAnswers / solanaQuizQuestions.length) * 100;
  };

  if (showResults) {
    const score = getScore();
    const passed = score >= 80;

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
          <CardDescription className="text-center">
            You scored {score.toFixed(0)}% on the Solana Knowledge Quiz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {passed ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                <CheckCircle className="w-8 h-8" />
                <span className="text-xl font-semibold">Congratulations! You passed!</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-red-600 mb-4">
                <XCircle className="w-8 h-8" />
                <span className="text-xl font-semibold">Try again! You need 80% to pass.</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {solanaQuizQuestions.map((question, index) => (
              <div key={question.id} className="p-3 border rounded-lg">
                <div className="font-medium mb-2">{question.question}</div>
                <div className="text-sm text-muted-foreground">
                  Your answer: {answers[index] !== undefined ? question.options[answers[index]] : 'Not answered'}
                </div>
                <div className="text-sm text-muted-foreground">
                  Correct answer: {question.options[question.correctAnswer]}
                </div>
                <div className="mt-1">
                  {answers[index] === question.correctAnswer ? (
                    <CheckCircle className="w-4 h-4 text-green-500 inline" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 inline" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || !passed}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : passed ? 'Claim Reward' : 'Retry Quiz'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = solanaQuizQuestions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solana Knowledge Quiz</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {solanaQuizQuestions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-medium mb-4">
          {currentQ.question}
        </div>
        
        <RadioGroup 
          value={answers[currentQuestion]?.toString() || ''} 
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
        >
          {currentQ.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        <div className="flex space-x-2 pt-4">
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="flex-1"
          >
            {currentQuestion === solanaQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 