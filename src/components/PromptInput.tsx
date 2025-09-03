'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface PromptInputProps {
  onGenerate: (prompt: string, systemPrompt?: string) => void;
  isGenerating: boolean;
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
}

export default function PromptInput({ 
  onGenerate, 
  isGenerating, 
  systemPrompt, 
  onSystemPromptChange 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim(), systemPrompt);
    }
  };

  const examplePrompts = [
    "A task management app with drag-and-drop functionality",
    "A weather dashboard with location search and 5-day forecast",
    "A personal expense tracker with charts and categories",
    "A recipe sharing platform with search and ratings",
    "A habit tracker with streaks and progress visualization"
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Describe your app idea
              </label>
              <Textarea
                id="prompt"
                placeholder="I want to build a..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] text-lg resize-none"
                disabled={isGenerating}
              />
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{prompt.length} characters</span>
                <span>{prompt.trim().length >= 10 ? '✅' : '❌'} Min 10 characters</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit}
                disabled={prompt.trim().length < 10 || isGenerating}
                className="flex-1 h-12 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </div>
                ) : (
                  'Generate App'
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                disabled={isGenerating}
              >
                ⚙️ Advanced
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSystemPrompt && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <label htmlFor="systemPrompt" className="block text-sm font-medium">
                System Prompt (Advanced)
              </label>
              <Textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={(e) => onSystemPromptChange(e.target.value)}
                className="min-h-[100px] text-sm font-mono"
                placeholder="Customize how the AI generates your app..."
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-600">
                Modify the system prompt to customize how the AI generates your application.
                Leave empty to use the default prompt.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isGenerating && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">Try these example prompts:</p>
          <div className="grid gap-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                disabled={isGenerating}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}