import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { executeLLM } from '@/lib/services/llm-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.error('❌ Unauthorized: No user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📥 Received workflow run request:', JSON.stringify(body, null, 2)); // 11
    
    const { nodeId, nodeType, nodeData, connectedInputs } = body;

    if (!nodeId || !nodeType) {
      console.error('❌ Missing nodeId or nodeType');
      return NextResponse.json({ 
        error: 'Missing required fields: nodeId or nodeType' 
      }, { status: 400 });
    }

    let result: any = null;

    // Execute based on node type
    switch (nodeType) {
      case 'llmNode':
        console.log('🤖 Executing LLM node...'); // 12
        
        const userMessage = connectedInputs?.userMessage || nodeData?.userMessage || "Write a poem about elephant";
        
        if (!userMessage) {
          console.error('❌ No user message provided');
          return NextResponse.json({ 
            error: 'LLM node requires a user message input' 
          }, { status: 400 });
        }

        result = await executeLLM({
          nodeId,
          // model: nodeData?.selectedModel || 'gemini-pro',
          model: 'gemini-pro',
          systemPrompt: nodeData?.systemPromptOverride || connectedInputs?.systemPrompt,
          userMessage: userMessage,
          images: connectedInputs?.images ? [connectedInputs.images] : undefined,
          temperature: nodeData?.temperature || 0.7,
          maxTokens: nodeData?.maxTokens || 1000,
        });
        
        console.log('✅ LLM execution result:', result); // 17
        break;
        
      case 'textNode':
      case 'uploadImage':
      case 'uploadVideo':
        // These nodes don't execute, they just provide data
        console.log(`ℹ️ ${nodeType} doesn't require execution`);
        result = {
          nodeId,
          status: 'success',
          message: 'Node provides data only',
        };
        break;
        
      default:
        console.error(`❌ Node type ${nodeType} not implemented`);
        return NextResponse.json(
          { error: `Node type ${nodeType} not yet implemented` },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('❌ Error running workflow node:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to run workflow node' },
      { status: 500 }
    );
  }
}