import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function main() {
    const key = process.env.GOOGLE_API_KEY || '';
    console.log('Testing Gemini Key:', key.substring(0, 10) + '...');

    if (!key) {
        console.error('No GOOGLE_API_KEY found');
        return;
    }

    const genAI = new GoogleGenerativeAI(key);

    // List of models to try
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-pro", "gemini-1.5-pro"];

    for (const modelName of models) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello!");
            const response = await result.response;
            console.log(`✅ Success with ${modelName}:`, response.text());
            break; // Found one that works, stop testing
        } catch (error: any) {
            console.log(`❌ Failed with ${modelName}:`, error.status || error.message);
        }
    }
}

main();
