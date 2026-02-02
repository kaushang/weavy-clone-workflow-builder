import { GoogleGenerativeAI } from "@google/generative-ai";

export async function executeGeminiLLM(payload: any) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = payload.model || 'gemini-1.5-pro'; // ✅ FIXED: Use valid model name

    const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            temperature: payload.temperature || 0.7,
            maxOutputTokens: payload.maxTokens || 1000,
        },
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
        throw new Error('No prompt provided');
    }

    console.log('🤖 Using model:', modelName);
    console.log('📝 Generating with prompt length:', fullPrompt.length);

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return {
        response: text,
        model: modelName,
        tokensUsed: response.usageMetadata?.totalTokenCount,
    };
}