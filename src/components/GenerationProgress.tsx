'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GenerationProgressProps {
  isGenerating: boolean;
}

export default function GenerationProgress({ isGenerating }: GenerationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { name: 'Analyzing', message: 'Understanding your requirements...' },
    { name: 'Planning', message: 'Creating application architecture...' },
    { name: 'Generating', message: 'Writing code and components...' },
    { name: 'Finalizing', message: 'Adding finishing touches...' }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // Simulate progress
    const updateProgress = () => {
      const stepProgress = (progress % 25);
      if (stepProgress >= 24) {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        if (currentStep < steps.length - 1) {
          setProgress(prev => prev + 1);
        }
      } else {
        setProgress(prev => Math.min(prev + 1, 99));
      }
    };

    const progressTimer = setInterval(updateProgress, 200);

    return () => {
      clearInterval(progressTimer);
    };
  }, [isGenerating, progress, currentStep, steps.length]);

  if (!isGenerating) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          Generating Your App
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{steps[currentStep]?.name}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-sm text-gray-600">
          {steps[currentStep]?.message}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div
              key={step.name}
              className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-colors ${
                index <= currentStep
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  index < currentStep
                    ? 'bg-green-500'
                    : index === currentStep
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-gray-300'
                }`}
              />
              {step.name}
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          💡 Tip: The AI is creating a complete, production-ready application for you. 
          This includes all necessary components, styling, and functionality.
        </div>
      </CardContent>
    </Card>
  );
}