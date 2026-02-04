import { GoogleGenerativeAI } from "@google/generative-ai";

export async function executeGeminiLLM(payload: any) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
        throw new Error('GOOGLE_AI_API_KEY not configured');
    }
    console.log('🔑 KEY LENGTH:', apiKey.length, '| START:', apiKey.substring(0, 8), '| END:', apiKey.slice(-6));
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = payload.model || 'gemini-2.0-flash';

    console.log('🤖 Using model:', modelName);

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