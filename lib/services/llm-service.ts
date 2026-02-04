import { executeGeminiLLM } from '../llm-executor';
// import axios from 'axios';

export interface ExecuteLLMParams {
  nodeId: string;
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface LLMExecutionResult {
  nodeId: string;
  response: string;
  model: string;
  tokensUsed?: number;
  duration: number;
  status: 'success' | 'failed';
  error?: string;
}

export async function executeLLM(params: ExecuteLLMParams): Promise<LLMExecutionResult> {
  const startTime = Date.now();
  
  try {
    
    console.log(`🤖 Executing LLM for node ${params.nodeId}`);
    
    if (!params.userMessage) {
      throw new Error('User message is required');
    }
    
    // Call the LLM directly instead of using axios
    console.log('📦 LLM Params:', {
      model: params.model,
      hasSystemPrompt: !!params.systemPrompt,
      userMessageLength: params.userMessage?.length || 0,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
    });
    const result = await executeGeminiLLM({
      model: params.model,
      systemPrompt: params.systemPrompt,
      userMessage: params.userMessage,
      images: params.images,
      temperature: params.temperature || 0.7,
      maxTokens: params.maxTokens || 1000,
    });

    const duration = Date.now() - startTime;
    
    return {
      nodeId: params.nodeId,
      response: result.response,
      model: result.model,
      tokensUsed: result.tokensUsed,
      duration,
      status: 'success',
    };
  } catch (error: any) {
    console.error(`❌ LLM execution failed for node ${params.nodeId}:`, error);
    
    return {
      nodeId: params.nodeId,
      response: '',
      model: params.model,
      duration: Date.now() - startTime,
      status: 'failed',
      error: error.message || 'Unknown error',
    };
  }
}