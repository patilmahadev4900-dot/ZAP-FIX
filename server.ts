import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Helper to get GoogleGenAI client with user runtime key or env key
function getGeminiClient(customApiKey?: string) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

// 1. Gemini Safety Guardian Triage Endpoint
app.post('/api/triage', async (req, res) => {
  try {
    const { category, description, customApiKey, urgency = 'high' } = req.body;
    const ai = getGeminiClient(customApiKey);

    if (!ai) {
      // Return high quality structured fallback instructions if no API key is available
      return res.json({
        success: true,
        source: 'built-in-protocols',
        triage: getFallbackTriage(category, description),
      });
    }

    const systemPrompt = `You are the ZapFix Global Emergency Safety Guardian AI.
Your mission: Provide immediate, life-and-property-saving triage instructions to a resident who just dispatched an emergency trade professional for a hazardous situation.
The user is stressed and waiting for the technician to arrive.

Respond strictly in valid JSON format matching this schema:
{
  "severityLevel": "CRITICAL" | "HIGH" | "MODERATE",
  "estimatedResponsePriority": string,
  "immediateActionTitle": string,
  "stepByStepContainment": string[],
  "criticalWarnings": string[],
  "doNotTouchList": string[],
  "transitPrepChecklist": string[],
  "summaryGuidance": string
}`;

    const userPrompt = `Emergency Category: ${category}
User Description: ${description || 'Unspecified active hazard'}
Reported Urgency: ${urgency}

Generate immediate containment instructions for the resident while the technician travels.`;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out after 4000ms')), 4000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    const text = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = getFallbackTriage(category, description);
    }

    return res.json({
      success: true,
      source: 'gemini-ai',
      triage: parsed,
    });
  } catch (error: any) {
    console.error('Triage error:', error);
    return res.json({
      success: true,
      source: 'fallback-on-error',
      triage: getFallbackTriage(req.body.category, req.body.description),
      warning: error?.message || 'Error executing AI model call',
    });
  }
});

// 2. Banner Ad Generator Endpoint (Product Description & URL -> High-Quality Banner Ads)
app.post('/api/generate-banner', async (req, res) => {
  try {
    const { productDescription, productUrl, category, bannerType, aspectRatio, resolution, customApiKey } = req.body;
    const ai = getGeminiClient(customApiKey);

    const prompt = `You are a world-class performance marketing creative director for digital advertising.
Analyze this product/service and generate high-impact banner ad copy and creative direction for standard ad sizes.
Product/Service: ${productDescription || 'ZapFix Emergency Repair'}
Target URL: ${productUrl || 'https://zapfix.global'}
Trade/Category: ${category || 'Emergency Trade Services'}
Target Aspect Ratio: ${aspectRatio || '1:1'}
Target Size: ${bannerType || 'Medium Rectangle 300x250'}

Generate a JSON object with:
{
  "headline": string (punchy, high-converting, max 6 words),
  "subheadline": string (value prop, max 12 words),
  "ctaText": string (action-oriented, e.g. "Get Pro in 15 Min", "Book Emergency Dispatch"),
  "badgeText": string (e.g. "24/7 Verified", "Licensed & Insured", "4.9★ Rated"),
  "accentColor": string (hex color like "#00D2FF" or "#9B51E0"),
  "gradient": { "from": string, "to": string },
  "keyBenefitPoints": string[] (3 short bullet points),
  "imageCreativePrompt": string (detailed prompt for generating background imagery),
  "designStyle": string
}`;

    if (!ai) {
      return res.json({
        success: true,
        source: 'smart-template',
        banner: getFallbackBanner(productDescription, productUrl, category, bannerType),
      });
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out after 4000ms')), 4000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const response: any = await Promise.race([generatePromise, timeoutPromise]);

    let bannerData;
    try {
      bannerData = JSON.parse(response.text || '{}');
    } catch {
      bannerData = getFallbackBanner(productDescription, productUrl, category, bannerType);
    }

    return res.json({
      success: true,
      source: 'gemini-ai',
      banner: bannerData,
    });
  } catch (err: any) {
    console.error('Banner generation error:', err);
    return res.json({
      success: true,
      source: 'fallback-on-error',
      banner: getFallbackBanner(req.body.productDescription, req.body.productUrl, req.body.category, req.body.bannerType),
    });
  }
});

function getFallbackTriage(category = 'General', description = '') {
  const cat = (category || '').toLowerCase();
  if (cat.includes('electric') || cat.includes('arc') || cat.includes('spark')) {
    return {
      severityLevel: 'CRITICAL',
      estimatedResponsePriority: 'Immediate Code Red (<12 mins)',
      immediateActionTitle: 'Electrical Isolation Protocol',
      stepByStepContainment: [
        'Locate your main electrical breaker panel and switch the main circuit breaker to OFF.',
        'Do not touch any sparking outlet, exposed wiring, or water pooling near electrical feeds.',
        'Unplug sensitive nearby appliances ONLY if safe to approach without touching cables.',
        'Keep children, family, and pets at least 15 feet away from the affected room.'
      ],
      criticalWarnings: [
        'NEVER use water or standard fire extinguishers on energized electrical equipment.',
        'Do not attempt to reset a tripped breaker repeatedly if burning odors are present.'
      ],
      doNotTouchList: [
        'Metallic conduit or panel casings if damp',
        'Smoldering wiring harnesses',
        'Surrounding wet flooring'
      ],
      transitPrepChecklist: [
        'Clear hallway path to the main breaker board',
        'Have a flashlight or mobile torch handy',
        'Unlock exterior gate or share passcode'
      ],
      summaryGuidance: 'Your certified master electrician is dispatched. Follow isolation steps and wait outside the immediate room.'
    };
  }
  if (cat.includes('plumb') || cat.includes('water') || cat.includes('pipe') || cat.includes('flood')) {
    return {
      severityLevel: 'CRITICAL',
      estimatedResponsePriority: 'Priority Code Red (<15 mins)',
      immediateActionTitle: 'Main Water Shutoff & Flood Control',
      stepByStepContainment: [
        'Immediately shut off your main water valve (usually near street meter or under kitchen sink).',
        'Turn on the lowest garden hose or outdoor faucet to relieve hydraulic line pressure.',
        'Place heavy towels or containment buckets around the active leak area.',
        'If water is pooling near electrical floor outlets, switch off breaker immediately.'
      ],
      criticalWarnings: [
        'Do not step into deep standing water if electrical cords or baseboard outlets are submerged.',
        'Avoid soldering or DIY tape on pressurized copper or PEX lines.'
      ],
      doNotTouchList: [
        'Burst pressurized pipe segments while main is open',
        'Submerged power strips or cords'
      ],
      transitPrepChecklist: [
        'Move rugs and valuable furniture away from water flow',
        'Keep exterior door clear for industrial extraction pumps',
        'Confirm gate access code'
      ],
      summaryGuidance: 'Emergency plumber in transit with hydro-diagnostic rig. Maintain main valve closure until arrival.'
    };
  }
  return {
    severityLevel: 'HIGH',
    estimatedResponsePriority: 'Express Dispatch (<18 mins)',
    immediateActionTitle: 'Emergency Perimeter Containment',
    stepByStepContainment: [
      'Isolate the impacted area and secure perimeter doors.',
      'Ensure family members and domestic pets are in a safe, ventilated room.',
      'Document additional hazard progression if safe to do so.',
      'Keep your phone off silent to receive arrival telemetry and gate SMS alerts.'
    ],
    criticalWarnings: [
      'Do not attempt unverified disassembly or makeshift repairs.',
      'Ensure ventilation if any fumes, exhaust, or chemical odors are present.'
    ],
    doNotTouchList: [
      'Unidentified leaking fluids',
      'Damaged mechanical linkages or pressure vessels'
    ],
    transitPrepChecklist: [
      'Verify service address and contact number',
      'Check gate passcode visibility',
      'Secure domestic animals'
    ],
    summaryGuidance: 'Verified trade technician is actively moving towards your verified location. Real-time telemetry is live.'
  };
}

function getFallbackBanner(desc = '', url = '', cat = 'Emergency Repair', bannerType = '300x250') {
  return {
    headline: 'Emergency Repair in 15 Minutes',
    subheadline: 'Certified Master Pros • 24/7 Rapid Response • Escrow Protected',
    ctaText: 'Dispatch Pro Now',
    badgeText: '5.0 ★ Rated • Verified',
    accentColor: '#00D2FF',
    gradient: { from: '#00D2FF', to: '#9B51E0' },
    keyBenefitPoints: [
      'Guaranteed 15-Minute Response',
      'Fixed Upfront Transparent Pricing',
      'Live GPS Telemetry & Arrival Alerts'
    ],
    imageCreativePrompt: '3D glossy luxury geometric emblem glowing with cyan and purple laser neon accents on obsidian slate surface, high dynamic range cinematic studio lighting',
    designStyle: 'Ultra-Modern High Gloss Commercial'
  };
}

// Development vs Production serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZapFix Global Server running on port ${PORT}`);
  });
}

setupServer();
