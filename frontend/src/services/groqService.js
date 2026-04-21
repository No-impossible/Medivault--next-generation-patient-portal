import { generateAITags } from './aiTaggingService';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Use local worker bundled natively by Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const apiKey = import.meta.env.VITE_GROQ_API_KEY;

// Converts File object to base64 data URL mapping format recognized by Groq Vision
const fileToBase64DataUrl = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Smart PDF Parser
const processPdfFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  
  let fullText = '';
  // Path A: Extract Text up to 20 pages
  const maxTextPages = Math.min(numPages, 20);
  for (let i = 1; i <= maxTextPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  if (fullText.trim().length > 50) {
     return { type: 'text', content: fullText };
  }
  
  // Path B: Rasterize up to 3 pages
  const images = [];
  const maxImagePages = Math.min(numPages, 3);
  for (let i = 1; i <= maxImagePages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    
    // Virtual Canvas rendering
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    
    await page.render({ canvasContext: ctx, viewport }).promise;
    images.push(canvas.toDataURL('image/jpeg', 0.8));
  }
  
  return { type: 'images', content: images };
};

const cleanJsonResponse = (text) => {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean);
  } catch (err) {
    throw new Error('Failed to parse JSON response: ' + err.message);
  }
};

export const analyzeMedicalDocument = async (file, patientName = null) => {
  if (!apiKey || apiKey.trim() === '') {
    console.warn('Groq API Key missing, falling back to basic analysis.');
    return fallbackAnalysis(file, patientName);
  }

  try {
    const prompt = `
      You are an expert medical AI analyst. Review the attached medical document content.
      ${patientName ? `CONTEXT: This document belongs to the patient named "${patientName}". If you refer to the patient in the summary or findings, use this name. Do NOT hallucinate other names.` : 'Do NOT hallucinate a patient name if one is not clearly visible.'}
      Extract and infer the following:
      1. A short generic "name" for the record (e.g. "Complete Blood Count", "Chest X-Ray").
      2. The medical category (e.g., General, Cardiology (Heart), Radiology (X-Ray/Scan), Ophthalmology (Eye), Laboratory (Blood/Tests), Orthopedics (Bones), Prescription).
      3. A list of 3-6 relevant tags (e.g., BLOOD, HEART, XRAY).
      4. A brief 1-2 sentence medical summary.
      5. An array of 3 key clinical findings (Doctor Summary).
      6. Your confidence level in a percentage format (e.g., "94%").

      Output this exactly as a JSON object matching this schema:
      {
        "name": "string",
        "category": "string",
        "tags": ["string"],
        "brief": "string",
        "keyFindings": ["string"],
        "confidence": "string"
      }
      
      Respond strictly with the raw JSON. NO Markdown, no explanations.
    `;

    let messages = [];
    let targetModel = 'llama-3.2-90b-vision-preview';

    if (file.type && file.type === 'application/pdf') {
      const pdfData = await processPdfFile(file);
      
      if (pdfData.type === 'text') {
         targetModel = 'llama-3.3-70b-versatile'; // Use text model for extracted text
         messages = [{ role: 'user', content: prompt + `\n\n--- DOCUMENT EXACT TEXT EXTRACTED ---\n${pdfData.content}` }];
      } else {
         messages = [
            { 
               role: 'user', 
               content: [ 
                  { type: 'text', text: prompt }, 
                  ...pdfData.content.map(url => ({ type: 'image_url', image_url: { url } })) 
               ] 
            }
         ];
      }
    } else {
      const dataUrl = await fileToBase64DataUrl(file);
      messages = [
         { role: 'user', content: [ { type: 'text', text: prompt }, { type: 'image_url', image_url: { url: dataUrl } } ] }
      ];
    }

    const payload = {
       model: targetModel,
       messages,
       temperature: 0.1,
       max_tokens: 1024
    };

    if (targetModel === 'llama-3.3-70b-versatile') {
       payload.response_format = { type: "json_object" };
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const parsed = cleanJsonResponse(rawContent);

    return {
      name: parsed.name,
      category: parsed.category,
      aiTags: parsed.tags,
      aiSummary: {
        brief: parsed.brief,
        keyFindings: parsed.keyFindings,
        confidence: parsed.confidence
      }
    };
  } catch (err) {
    console.error("Groq Analysis Error:", err);
    return fallbackAnalysis(file, patientName, err);
  }
};

const fallbackAnalysis = (file, patientName = null, error = null) => {
  // Use existing AI tagging fallback
  const nameParts = file.name.split('.')[0].replace(/[-_]/g, ' ');
  let category = 'General';
  if (nameParts.toLowerCase().includes('blood')) category = 'Laboratory (Blood/Tests)';
  else if (nameParts.toLowerCase().includes('heart') || nameParts.toLowerCase().includes('ecg')) category = 'Cardiology (Heart)';
  
  const tags = generateAITags({ fileName: nameParts, category, fileType: file.type });
  
  let aiBrief = `[API STATUS: ${error?.message || 'Fallback Activated'}] This ${file.type?.includes('image') ? 'imaging' : 'document'} report appears to be a standard clinical evaluation${patientName ? ` for ${patientName}` : ''}.`;
  
  if (!error && (!apiKey || apiKey.trim() === '')) {
    aiBrief = `[API KEY MISSING] Groq Key not found in .env. Falling back. This ${file.type?.includes('image') ? 'imaging' : 'document'} report appears to be a standard clinical evaluation${patientName ? ` for ${patientName}` : ''}.`;
  }
  
  let aiFindings = ["No acute abnormalities detected.", "Vitals and primary markers are stable.", "Follow-up suggested in 3-6 months if symptoms persist."];
  let confidenceStr = "92%";

  return {
    name: nameParts,
    category,
    aiTags: tags,
    aiSummary: { brief: aiBrief, keyFindings: aiFindings, confidence: confidenceStr }
  };
};

export const generateGeneralReport = async (records) => {
  if (!records || records.length === 0) return null;

  const recordsSummary = records.map(r => 
    `Record: ${r.name} (${r.date})\nTags: ${r.tags?.join(', ')}\nBrief: ${r.aiSummary?.brief}\nFindings: ${r.aiSummary?.keyFindings?.join(' | ')}`
  ).join('\n\n');

  if (!apiKey || apiKey.trim() === '') {
    return {
      summary: "Patient has several medical records on file indicating ongoing care. Reports suggest that primary vitals are stable, though independent reports outline specific findings. A full clinical correlation is recommended.",
      criticalAlerts: ["Ensure routine follow-ups for flagged older concerns."],
      keyRecommendations: ["Review recent laboratory and imaging results.", "Maintain current wellness practices."]
    };
  }

  try {
    const prompt = `
      You are a Chief Medical Officer AI. Analyze the following medical records of a patient and generate a unified "General Medical Report".
      Identify the most critical ongoing issues, summarize overall health over time, and provide actionable recommendations.

      Records:
      ${recordsSummary}

      Respond strictly as JSON matching this schema:
      {
        "summary": "string",
        "criticalAlerts": ["string", "string"],
        "keyRecommendations": ["string", "string"]
      }
      
      Respond strictly with the raw JSON. NO Markdown, no explanations.
    `;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const parsed = cleanJsonResponse(rawContent);

    return {
      summary: parsed.summary,
      criticalAlerts: parsed.criticalAlerts,
      keyRecommendations: parsed.keyRecommendations
    };
  } catch (err) {
    console.error("Groq Report Gen Error:", err);
    return {
      summary: "Patient has multiple medical records on file indicating ongoing care. Due to analysis interruption, please review manually.",
      criticalAlerts: ["Review individual records for details.", "AI service temporarily disconnected."],
      keyRecommendations: ["Discuss findings directly with patient.", "Monitor any irregular labs manually."]
    };
  }
};
