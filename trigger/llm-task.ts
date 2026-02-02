import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface LLMTaskPayload {
  model: string;
  systemPrompt?: string;
  userMessage: string;
  images?: string[];
  temperature?: number;
  maxTokens?: number;
}

export interface LLMTaskResult {
  response: string;
  model: string;
  tokensUsed?: number;
}

export const runLLMTask = task({
  id: "run-llm",
  run: async (payload: LLMTaskPayload): Promise<LLMTaskResult> => {
    console.log("🤖 Running LLM task with model:", payload.model);

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY not found in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: payload.model });

    // Build prompt
    let fullPrompt = '';
    
    if (payload.systemPrompt) {
      fullPrompt += `${payload.systemPrompt}\n\n`;
    }
    
    fullPrompt += payload.userMessage;

    // Generate content
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: payload.temperature || 0.7,
        maxOutputTokens: payload.maxTokens || 1000,
      },
    });

    const response = result.response;
    const text = response.text();

    console.log("✅ LLM task completed");

    return {
      response: text,
      model: payload.model,
      tokensUsed: response.usageMetadata?.totalTokenCount,
    };
  },
});