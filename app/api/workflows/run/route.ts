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
    console.log('📥 Received workflow run request:', JSON.stringify(body, null, 2));
    
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
        console.log('🤖 Executing LLM node...');
        
        const userMessage = connectedInputs?.userMessage || nodeData?.userMessage;
        
        if (!userMessage) {
          console.error('❌ No user message provided');
          return NextResponse.json({ 
            error: 'LLM node requires a user message input' 
          }, { status: 400 });
        }

        result = await executeLLM({
          nodeId,
          model: nodeData?.selectedModel || 'gemini-2.0-flash',
          systemPrompt: nodeData?.systemPromptOverride || connectedInputs?.systemPrompt,
          userMessage: userMessage,
          images: connectedInputs?.images ? [connectedInputs.images] : undefined,
          temperature: nodeData?.temperature || 0.7,
          maxTokens: nodeData?.maxTokens || 1000,
        });
        
        console.log('✅ LLM execution result:', result);
        break;

      case 'cropImage':
        console.log('✂️ Executing Crop Image node...');
        
        const imageUrl = connectedInputs?.image;
        
        if (!imageUrl) {
          console.error('❌ No image provided');
          return NextResponse.json({ 
            error: 'Crop Image node requires an image input' 
          }, { status: 400 });
        }

        // Return params for client-side cropping
        result = {
          nodeId,
          status: 'success',
          response: 'Crop params ready',
          cropParams: {
            imageUrl,
            xPercent: nodeData?.xPercent || 0,
            yPercent: nodeData?.yPercent || 0,
            widthPercent: nodeData?.widthPercent || 100,
            heightPercent: nodeData?.heightPercent || 100,
          },
        };
        
        console.log('✅ Crop Image params prepared');
        break;

      case 'extractFrame':
        console.log('🎬 Executing Extract Frame node...');
        
        const videoUrl = connectedInputs?.video;
        
        if (!videoUrl) {
          console.error('❌ No video provided');
          return NextResponse.json({ 
            error: 'Extract Frame node requires a video input' 
          }, { status: 400 });
        }

        // Return params for client-side extraction
        result = {
          nodeId,
          status: 'success',
          response: 'Frame extraction params ready',
          extractParams: {
            videoUrl,
            timestamp: nodeData?.timestamp || '50%',
          },
        };
        
        console.log('✅ Extract Frame params prepared');
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