import fs from 'fs';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const base64Data = Buffer.from('test').toString('base64');
    const resultPart = {
      inlineData: {
        data: base64Data,
        mimeType: 'text/plain'
      }
    };
    
    console.log("Generating content...");
    const prompt = 'Analyze this text.';
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [prompt, resultPart],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            brief: { type: Type.STRING },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.STRING }
          },
          required: ["name", "category", "tags", "brief", "keyFindings", "confidence"]
        }
      }
    });
    console.log("Response:", response.text);
    console.log("Parsed:", JSON.parse(response.text));
  } catch (e) {
    console.error('ERROR', e);
  }
}

test();
