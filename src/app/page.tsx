'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PromptInput from '@/components/PromptInput';
import GenerationProgress from '@/components/GenerationProgress';
import CodeViewer from '@/components/CodeViewer';
import { GeneratedFile } from '@/types/generation';
import { testAIConnection } from '@/lib/ai-client';

const DEFAULT_SYSTEM_PROMPT = `You are an expert full-stack developer specializing in Next.js applications. 
When given a user prompt, generate a complete, production-ready Next.js application.

CRITICAL REQUIREMENTS:
1. Generate COMPLETE, working code - no placeholders or TODOs
2. Use TypeScript for all files
3. Use Tailwind CSS for styling
4. Use Next.js App Router (app directory)
5. Include proper error handling
6. Make it responsive and accessible
7. Use shadcn/ui components when appropriate
8. Include proper TypeScript types

RESPONSE FORMAT: Return a JSON object with this structure:
{
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "// Complete file content here",
      "type": "page"
    }
  ],
  "dependencies": ["package-name@version"],
  "instructions": "Setup and usage instructions"
}

Generate a complete, working application based on the user's request.`;

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentInstructions, setCurrentInstructions] = useState('');
  const [currentDependencies, setCurrentDependencies] = useState<string[]>([]);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [error, setError] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Test AI connection on component mount
  useState(() => {
    testAIConnection().then(connected => {
      setConnectionStatus(connected ? 'connected' : 'error');
    });
  });

  const handleGenerate = async (prompt: string, customSystemPrompt?: string) => {
    setIsGenerating(true);
    setError('');
    setCurrentPrompt(prompt);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          systemPrompt: customSystemPrompt || systemPrompt
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setGeneratedFiles(data.files || []);
      setCurrentInstructions(data.instructions || '');
      setCurrentDependencies(data.dependencies || []);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during generation');
      setGeneratedFiles([]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI App Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your ideas into complete Next.js applications using AI. 
            Simply describe what you want to build, and watch it come to life.
          </p>
          
          {/* Connection Status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' 
              ? 'bg-green-100 text-green-800' 
              : connectionStatus === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' 
                ? 'bg-green-500' 
                : connectionStatus === 'error'
                ? 'bg-red-500'
                : 'bg-yellow-500 animate-pulse'
            }`} />
            {connectionStatus === 'connected' ? 'AI Connected' : 
             connectionStatus === 'error' ? 'AI Connection Error' : 
             'Checking AI Connection...'}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <PromptInput 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
            
            {isGenerating && (
              <GenerationProgress isGenerating={isGenerating} />
            )}

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="font-medium">Generation Error</p>
                      <p className="text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Output */}
          <div className="space-y-6">
            <CodeViewer 
              files={generatedFiles}
              prompt={currentPrompt}
              instructions={currentInstructions}
              dependencies={currentDependencies}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>AI App Builder - Powered by Claude Sonnet 4 via OpenRouter</p>
          <p className="mt-1">Generate complete Next.js applications with AI assistance</p>
        </div>
      </div>
    </div>
  );
}