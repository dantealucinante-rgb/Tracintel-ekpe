import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function main() {
    const key = process.env.GOOGLE_API_KEY || '';
    console.log('Testing Gemini Key:', key.substring(0, 10) + '...');

    if (!key) {
        console.error('No GOOGLE_API_KEY found');
        return;
    }

    // Unfortunately the Node SDK doesn't expose listModels easily in v0.1.
    // Wait, let's try a direct fetch to the API endpoint to list models.

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Failed to list models: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log('Available Models:');
        if (data.models) {
            data.models.forEach((m: any) => console.log(`- ${m.name}`));
        } else {
            console.log('No models found in response:', data);
        }

    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

main();
