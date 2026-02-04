import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, payload } = body;

    console.log(`🚀 Executing task: ${taskId}`);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    if (taskId === 'run-llm') {
      // Execute LLM task directly in API route
      const apiKey = process.env.GOOGLE_AI_API_KEY;

      if (!apiKey) {
        console.error('❌ GOOGLE_AI_API_KEY not found');
        return NextResponse.json(
          { error: 'GOOGLE_AI_API_KEY not configured' },
          { status: 500 }
        );
      }

      console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');

      try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Validate model name
        const modelName = payload.model || 'gemini-2.0-flash';
        console.log('🤖 Using model:', modelName);

        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        // Build prompt
        let fullPrompt = '';  

        if (payload.systemPrompt) {
          fullPrompt += `${payload.systemPrompt}\n\n`;
        }

        if (payload.userMessage) {
          fullPrompt += payload.userMessage;
        }

        if (!fullPrompt) {
          console.error('❌ No prompt provided');
          return NextResponse.json(
            { error: 'No prompt provided' },
            { status: 400 }
          );
        }

        console.log('📝 Prompt:', fullPrompt.substring(0, 100) + '...');
        console.log('🎛️ Temperature:', payload.temperature || 0.7);
        console.log('🎛️ Max tokens:', payload.maxTokens || 1000);

        // Generate content
        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: payload.temperature || 0.7,
            maxOutputTokens: payload.maxTokens || 1000,
          },
        });

        // const result = await model.generateContent({
        //   contents: [{
        //     parts: [{ text: fullPrompt }]
        //   }],
        //   generationConfig: {
        //     temperature: payload.temperature || 0.7,
        //     maxOutputTokens: payload.maxTokens || 1000,
        //   },
        // });

        const response = result.response;
        const text = response.text();

        console.log('✅ Generation successful');
        console.log('📤 Response length:', text.length);

        return NextResponse.json({
          success: true,
          runId: `run_${Date.now()}`,
          result: {
            response: text,
            model: modelName,
            tokensUsed: response.usageMetadata?.totalTokenCount,
          },
        });
      } catch (genError: any) {
        console.error('❌ Google AI Error:', genError);
        console.error('Error message:', genError.message);
        console.error('Error stack:', genError.stack);

        return NextResponse.json(
          { error: `Google AI Error: ${genError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: `Unknown task: ${taskId}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('❌ API Route Error:', error);
    console.error('Error message:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to execute task' },
      { status: 500 }
    );
  }
}