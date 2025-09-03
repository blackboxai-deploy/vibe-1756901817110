'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GeneratedFile } from '@/types/generation';

interface AppPreviewProps {
  files: GeneratedFile[];
  prompt: string;
}

export default function AppPreview({ files, prompt }: AppPreviewProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          Generate an app to see the preview here.
        </CardContent>
      </Card>
    );
  }

  const mainPageFile = files.find(file => 
    file.path.includes('page.tsx') && !file.path.includes('api')
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>App Preview</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? '📝 Code' : '👀 Preview'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        {isPreviewMode ? (
          <div className="p-8 bg-gray-100 h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-medium">Live Preview Coming Soon</h3>
              <p className="text-gray-600">
                In a full implementation, this would show a sandboxed preview 
                of your generated application running in real-time.
              </p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-500 mb-2">Generated App: {prompt}</p>
                <div className="text-xs text-gray-400">
                  {files.length} files • {files.reduce((acc, file) => acc + file.content.length, 0)} characters
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 h-full">
            {mainPageFile ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ App Generated Successfully</h4>
                  <p className="text-sm text-green-700">
                    Your application has been generated with {files.length} files.
                    Download the project and run it locally to see it in action.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Quick Start Guide:</h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside text-gray-700">
                    <li>Download the generated project files</li>
                    <li>Extract and navigate to the project directory</li>
                    <li>Run <code className="bg-gray-100 px-2 py-1 rounded">npm install</code></li>
                    <li>Start the dev server with <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
                    <li>Open <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code></li>
                  </ol>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">🎯 What was generated:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full" />
                        {file.path} ({file.type})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No main page file found in the generated code.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}