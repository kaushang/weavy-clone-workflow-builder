import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'GOOGLE_AI_API_KEY not configured' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // List all available models
        const models = await genAI.listModels();

        // Format the output
        const modelList = models.map(model => ({
            name: model.name,
            displayName: model.displayName,
            description: model.description,
            supportedMethods: model.supportedGenerationMethods,
            inputTokenLimit: model.inputTokenLimit,
            outputTokenLimit: model.outputTokenLimit,
        }));

        console.log('📋 Available Models:', JSON.stringify(modelList, null, 2));

        return NextResponse.json({
            success: true,
            models: modelList,
            count: modelList.length,
        });
    } catch (error: any) {
        console.error('❌ Error listing models:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}