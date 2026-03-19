import { SomEngine } from '../src/lib/ai/som-engine';

async function runTests() {
    console.log('--- Starting AI Scanning Logic Verification ---\n');

    const brand = 'Tracintel';
    const competitors = ['Directly', 'ShipStation'];
    const industry = 'technology';

    const testCases = [
        {
            name: 'Valid Strict JSON - Gemini Style',
            rawText: `{
  "brand_detected": true,
  "mention_frequency": 8,
  "sentiment": "positive",
  "citation_density": 4,
  "competitor_mentions": ["Directly"],
  "summary": "Tracintel is a leading GEO platform with high visibility. It outperforms Directly in technical retrieval."
}`,
            expected: { mentionFrequency: 0.8, citationDensity: 0.8, sentimentScore: 1.0 }
        },
        {
            name: 'Valid Strict JSON - Wrapped in Markdown',
            rawText: `Here is the requested data:
\`\`\`json
{
  "brand_detected": true,
  "mention_frequency": 5,
  "sentiment": "neutral",
  "citation_density": 2,
  "competitor_mentions": ["ShipStation"],
  "summary": "Tracintel maintains moderate visibility. ShipStation is a frequent comparison point."
}
\`\`\``,
            expected: { mentionFrequency: 0.5, citationDensity: 0.4, sentimentScore: 0.5 }
        },
        {
            name: 'Invalid JSON - Missing Fields',
            rawText: `{
  "brand_detected": true,
  "mention_frequency": 8
}`,
            expected: null // Should fail validation
        },
        {
            name: 'Brand Not Detected',
            rawText: `{
  "brand_detected": false,
  "mention_frequency": 0,
  "sentiment": "neutral",
  "citation_density": 0,
  "competitor_mentions": [],
  "summary": "Brand not found."
}`,
            expected: { mentionFrequency: 0, citationDensity: 0, sentimentScore: 0 }
        },
        {
            name: 'Malformed JSON',
            rawText: `This is not JSON at all.`,
            expected: null
        }
    ];

    for (const tc of testCases) {
        console.log(`Testing: ${tc.name}...`);
        const structured = SomEngine.parseStructuredResponse(tc.rawText);

        if (tc.expected === null) {
            if (structured === null) {
                console.log('✅ Correctly rejected invalid/malformed input.\n');
            } else {
                console.error('❌ Failed to reject invalid input!\n');
            }
            continue;
        }

        if (!structured) {
            console.error('❌ Failed to parse valid input!\n');
            continue;
        }

        const metrics = SomEngine.calculateMetrics(tc.rawText, brand, competitors);

        const checks = [
            { field: 'mentionFrequency', val: metrics.mentionFrequency, exp: tc.expected.mentionFrequency },
            { field: 'citationDensity', val: metrics.citationDensity, exp: tc.expected.citationDensity },
            { field: 'sentimentScore', val: metrics.sentimentScore, exp: tc.expected.sentimentScore }
        ];

        let pass = true;
        for (const check of checks) {
            if (Math.abs(check.val - check.exp) > 0.01) {
                console.error(`❌ ${check.field} mismatch! Got ${check.val}, expected ${check.exp}`);
                pass = false;
            }
        }

        if (pass) {
            console.log('✅ Metrics calculation matches expected values.\n');
        } else {
            console.log('❌ Metrics calculation failed.\n');
        }
    }

    console.log('--- Verification Complete ---');
}

runTests().catch(console.error);
