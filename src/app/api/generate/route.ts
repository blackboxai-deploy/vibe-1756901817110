import { NextRequest, NextResponse } from 'next/server';
import { generateApp } from '@/lib/ai-client';
import { GenerationRequest } from '@/types/generation';

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    
    // Validate request
    if (!body.prompt || body.prompt.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Prompt must be at least 10 characters long' },
        { status: 400 }
      );
    }

    // Generate the application
    const result = await generateApp(body);
    
    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error during generation' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'AI App Builder API is running',
    endpoints: [
      'POST /api/generate - Generate a new application',
    ]
  });
}