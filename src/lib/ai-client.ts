import { GenerationRequest, GenerationResponse } from '@/types/generation';

const AI_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const AI_MODEL = 'openrouter/anthropic/claude-sonnet-4';

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

export async function generateApp(request: GenerationRequest): Promise<GenerationResponse> {
  try {
    const systemPrompt = request.systemPrompt || DEFAULT_SYSTEM_PROMPT;
    
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'customerId': 'cus_ShmBTC3SL8jglG',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a Next.js application: ${request.prompt}\n\nTemplate context: ${request.template || 'None'}`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse AI response as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      // If not JSON, wrap in basic structure
      parsedResponse = {
        files: [
          {
            path: 'src/app/page.tsx',
            content: aiResponse,
            type: 'page'
          }
        ],
        instructions: 'Generated application code'
      };
    }

    return {
      success: true,
      files: parsedResponse.files || [],
      dependencies: parsedResponse.dependencies || [],
      instructions: parsedResponse.instructions || 'Application generated successfully'
    };

  } catch (error) {
    console.error('Generation error:', error);
    return {
      success: false,
      files: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function testAIConnection(): Promise<boolean> {
  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'customerId': 'cus_ShmBTC3SL8jglG',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          {
            role: 'user',
            content: 'Hello, respond with just "OK" if you can receive this message.'
          }
        ],
        max_tokens: 10
      })
    });

    return response.ok;
  } catch {
    return false;
  }
}