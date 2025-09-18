export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
}

const API_KEY = "AIzaSyAp9Qiebv1eeTXcTG6WRJmFDjKfFFpFqLs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}

export interface DiseaseDetectionResult {
  plantName: string;
  scientificName?: string;
  family?: string;
  isHealthy: boolean;
  confidence: number;
  diseases: Array<{
    name: string;
    probability: number;
    description: string;
    symptoms: string[];
    causes: string[];
    treatment: {
      organic: string[];
      chemical: string[];
    };
    prevention: string[];
  }>;
  plantDetails: {
    commonNames: string[];
    description: string;
    careInstructions: string[];
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

const getLanguageInstructions = (language: string): string => {
  const map: Record<string, string> = {
    en: 'Respond ONLY in ENGLISH. Do not include any other language.',
    hi: 'Respond ONLY in HINDI. Use farmer-friendly Indian Hindi terms. No English.',
    mr: 'Respond ONLY in MARATHI. Use farmer-friendly Marathi terms. No English.',
    bn: 'Respond ONLY in BENGALI (বাংলা). No English.',
    ta: 'Respond ONLY in TAMIL (தமிழ்). No English.',
    te: 'Respond ONLY in TELUGU (తెలుగు). No English.',
    gu: 'Respond ONLY in GUJARATI (ગુજરાતી). No English.',
    kn: 'Respond ONLY in KANNADA (ಕನ್ನಡ). No English.',
    ml: 'Respond ONLY in MALAYALAM (മലയാളം). No English.',
    pa: 'Respond ONLY in PUNJABI (ਪੰਜਾਬੀ). No English.',
    or: 'Respond ONLY in ODIA (ଓଡିଆ). No English.',
    as: 'Respond ONLY in ASSAMESE (অসমীয়া). No English.',
    ur: 'Respond ONLY in URDU (اُردُو). No English.',
    ks: 'Respond ONLY in KASHMIRI. No English.',
    kok: 'Respond ONLY in KONKANI (कोंकणी). No English.',
    sd: 'Respond ONLY in SINDHI (سنڌي). No English.',
    sa: 'Respond ONLY in SANSKRIT (संस्कृतम्). No English.',
    ne: 'Respond ONLY in NEPALI (नेपाली). No English.',
    mni: 'Respond ONLY in MANIPURI. No English.',
    mai: 'Respond ONLY in MAITHILI (मैथिली). No English.',
    doi: 'Respond ONLY in DOGRI (डोगरी). No English.',
    sat: 'Respond ONLY in SANTALI (ᱥᱟᱱᱛᱟᱲᱤ). No English.',
    brx: 'Respond ONLY in BODO. No English.',
  };
  return map[language] || map.en;
};

export class GeminiService {
  private static async makeRequest(messages: GeminiMessage[], options?: { signal?: AbortSignal }): Promise<GeminiResponse> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
      signal: options?.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  private static async generateResponse(prompt: string, context: string = '', options?: { signal?: AbortSignal }): Promise<string> {
    try {
      const messages: GeminiMessage[] = [{
        role: 'user',
        parts: [
          { 
            text: context ? `${context}\n\n${prompt}` : prompt
          }
        ]
      }];

      const response = await this.makeRequest(messages, { signal: options?.signal });
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error instanceof Error ? error : new Error('Failed to generate response');
    }
  }

  static async getDiseaseAdvice(diseaseName: string, plantName?: string, additionalContext?: string, language: string = 'en', options?: { signal?: AbortSignal }): Promise<string> {
    const currentLanguage = localStorage.getItem('farmingAppLanguage') || language;
    const context = `A plant has been identified with the disease: "${diseaseName}"${plantName ? ` on ${plantName}` : ''}. ${additionalContext || ''}`;
    
    const languageInstruction = getLanguageInstructions(currentLanguage);
    const prompt = `${languageInstruction}

You MUST write 100% of the response in the specified language. Do NOT mix languages.

Please provide comprehensive advice for treating and managing this plant disease. Include:
1. Disease description and symptoms
2. Causes and conditions that favor the disease
3. Immediate treatment steps (both organic and chemical options)
4. Prevention measures
5. Long-term management strategies
6. When to seek professional help
7. Expected recovery timeline

Be specific and practical for farmers.`;

    return this.generateResponse(prompt, context, { signal: options?.signal });
  }

  static async getGeneralFarmingAdvice(question: string, language: string = 'en', options?: { signal?: AbortSignal }): Promise<string> {
    const currentLanguage = localStorage.getItem('farmingAppLanguage') || language;
    const languageInstruction = getLanguageInstructions(currentLanguage);
    const enhancedQuestion = `${languageInstruction}\n\nUser Question: ${question}\n\nProvide practical farming advice considering Indian agricultural conditions.`;
    return this.generateResponse(enhancedQuestion, '', { signal: options?.signal });
  }

  static async detectPlantDisease(imageBase64: string, plantName: string, mimeType: string = 'image/jpeg', language: string = 'en', options?: { signal?: AbortSignal }): Promise<DiseaseDetectionResult> {
    try {
      const currentLanguage = localStorage.getItem('farmingAppLanguage') || language;
      const languageInstructions = getLanguageInstructions(currentLanguage);
      // Modified prompt to request shorter responses
      const prompt = `Analyze this ${plantName} plant image for diseases. Provide a BRIEF analysis in this exact JSON format (keep descriptions under 50 words each):

${languageInstructions}

{
  "plantName": "${plantName}",
  "scientificName": "scientific name",
  "family": "plant family",
  "isHealthy": boolean,
  "confidence": number between 0-100,
  "diseases": [{
    "name": "disease name",
    "probability": number between 0-100,
    "description": "SHORT description (max 50 words)",
    "symptoms": ["3-4 key symptoms only"],
    "causes": ["2-3 main causes only"],
    "treatment": {
      "organic": ["2-3 key organic solutions"],
      "chemical": ["1-2 key chemical solutions"]
    },
    "prevention": ["3-4 key prevention steps"]
  }],
  "plantDetails": {
    "commonNames": ["1-2 common names only"],
    "description": "BRIEF description (max 25 words)",
    "careInstructions": ["3-4 essential care steps"]
  }
}

IMPORTANT: Keep all text fields brief and concise. Do not exceed the specified word limits.`;

      const messages: GeminiMessage[] = [{
        role: 'user',
        parts: [
          { text: prompt },
          { 
            inlineData: {
              mimeType: mimeType,
              data: imageBase64
            }
          }
        ]
      }];

      const response = await this.makeRequest(messages, { signal: options?.signal });
      
      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error('Invalid response format from Gemini API');
      }

      // Clean and extract JSON
      const cleanedText = responseText
        .replace(/```json\s*|\s*```/g, '')
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2018\u2019]/g, "'")
        .trim();

      // Extract the JSON object, handling potential truncation
      let jsonText = cleanedText;
      const startBrace = jsonText.indexOf('{');
      if (startBrace === -1) {
        throw new Error('No JSON object found in response');
      }
      
      // Count braces to ensure we have a complete JSON object
      let braceCount = 0;
      let endIndex = -1;
      
      for (let i = startBrace; i < jsonText.length; i++) {
        if (jsonText[i] === '{') braceCount++;
        if (jsonText[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }

      if (braceCount !== 0 || endIndex === -1) {
        // If JSON is truncated, try to fix it
        jsonText = jsonText.substring(startBrace);
        jsonText = jsonText.replace(/[^}]*$/, '') + '}}}'; // Close any open objects
      } else {
        jsonText = jsonText.substring(startBrace, endIndex);
      }

      try {
        const result = JSON.parse(jsonText) as DiseaseDetectionResult;
        
        // Validate and normalize the result
        return {
          plantName: result.plantName || plantName,
          scientificName: result.scientificName || 'Not specified',
          family: result.family || 'Not specified',
          isHealthy: Boolean(result.isHealthy),
          confidence: Number(result.confidence) || 70,
          diseases: (result.diseases || []).map(disease => ({
            name: disease.name || 'Unknown Disease',
            probability: Number(disease.probability) || 70,
            description: disease.description?.substring(0, 200) || 'No description available',
            symptoms: (disease.symptoms || []).slice(0, 4),
            causes: (disease.causes || []).slice(0, 3),
            treatment: {
              organic: (disease.treatment?.organic || []).slice(0, 3),
              chemical: (disease.treatment?.chemical || []).slice(0, 2)
            },
            prevention: (disease.prevention || []).slice(0, 4)
          })),
          plantDetails: {
            commonNames: (result.plantDetails?.commonNames || [plantName]).slice(0, 2),
            description: result.plantDetails?.description?.substring(0, 100) || 'Description not available',
            careInstructions: (result.plantDetails?.careInstructions || ['Basic care recommended']).slice(0, 4)
          }
        };

      } catch (parseError) {
        console.error('Parse Error. Attempted to parse:', jsonText);
        throw parseError;
      }

    } catch (error) {
      console.error('Error in plant disease detection:', error);
      // Return fallback result as before
      return {
        plantName,
        scientificName: 'Unknown',
        family: 'Unknown',
        isHealthy: false,
        confidence: 0,
        diseases: [{
          name: 'Analysis Failed',
          probability: 0,
          description: 'Unable to complete analysis',
          symptoms: ['Analysis failed'],
          causes: ['Processing error'],
          treatment: {
            organic: ['Try again with a clearer image'],
            chemical: []
          },
          prevention: ['Ensure good image quality']
        }],
        plantDetails: {
          commonNames: [plantName],
          description: 'Analysis failed',
          careInstructions: ['Please try again']
        }
      };
    }
  }
  async getFarmingAdvice(question: string, language: string = 'en'): Promise<string> {
    const languagePrompts = {
      'en': 'You are a helpful farming assistant. Answer questions about agriculture, crops, pests, weather, and farming techniques. Provide practical, actionable advice. Be concise and farmer-friendly.',
      'hi': 'आप एक सहायक कृषि सलाहकार हैं। कृषि, फसलों, कीट-पतंगों, मौसम और खेती की तकनीकों के बारे में सवालों के जवाब दें। व्यावहारिक, कार्य-उन्मुख सलाह प्रदान करें। हिंदी में स्थानीय कृषि शब्दावली का उपयोग करके संक्षिप्त उत्तर दें।',
      'mr': 'तुम्ही एक उपयुक्त शेती सल्लागार आहात। शेती, पिके, कीड-पतंग, हवामान आणि शेतीच्या तंत्रांबद्दल प्रश्नांची उत्तरे द्या। व्यावहारिक, कृती-केंद्रित सल्ला द्या. मराठीत स्थानिक शेतकी शब्दावली वापरून संक्षिप्त उत्तर द्या.'
    };

    const systemPrompt = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nQuestion: ${question}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not provide an answer at this time.';
    } catch (error) {
      console.error('Error getting farming advice:', error);
      throw error;
    }
  }
}
