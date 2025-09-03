'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedFile } from '@/types/generation';
import { downloadProject } from '@/lib/code-generator';

interface CodeViewerProps {
  files: GeneratedFile[];
  prompt: string;
  instructions: string;
  dependencies?: string[];
}

export default function CodeViewer({ files, prompt, instructions, dependencies = [] }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState(0);

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No files generated yet. Enter a prompt above to get started!
        </CardContent>
      </Card>
    );
  }

  const groupedFiles = files.reduce((acc, file, index) => {
    const type = file.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push({ ...file, index });
    return acc;
  }, {} as Record<string, (GeneratedFile & { index: number })[]>);

  const handleDownload = () => {
    downloadProject(files, prompt, instructions, dependencies);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Generated Code</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              ⬇️ Download Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="flex h-full">
          {/* File Explorer */}
          <div className="w-1/3 border-r bg-gray-50">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {Object.entries(groupedFiles).map(([type, typeFiles]) => (
                  <div key={type} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-600 uppercase tracking-wide">
                      {type}s
                    </h4>
                    <div className="space-y-1">
                      {(typeFiles as (GeneratedFile & { index: number })[]).map((file) => (
                        <button
                          key={file.index}
                          onClick={() => setSelectedFile(file.index)}
                          className={`w-full text-left p-2 rounded text-sm transition-colors ${
                            selectedFile === file.index
                              ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="truncate">{file.path}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {file.content.split('\n').length} lines
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Code Display */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-mono text-sm text-gray-800">
                {files[selectedFile]?.path}
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <pre className="p-4 text-sm font-mono bg-white overflow-x-auto">
                <code className="language-typescript">
                  {files[selectedFile]?.content}
                </code>
              </pre>
            </ScrollArea>
          </div>
        </div>

        {/* Instructions Panel */}
        {instructions && (
          <div className="border-t bg-blue-50 p-4">
            <h4 className="font-medium text-blue-800 mb-2">Setup Instructions</h4>
            <div className="text-sm text-blue-700 whitespace-pre-line">
              {instructions}
            </div>
          </div>
        )}

        {/* Dependencies */}
        {dependencies.length > 0 && (
          <div className="border-t bg-green-50 p-4">
            <h4 className="font-medium text-green-800 mb-2">Additional Dependencies</h4>
            <div className="flex flex-wrap gap-2">
              {dependencies.map((dep, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-mono"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}