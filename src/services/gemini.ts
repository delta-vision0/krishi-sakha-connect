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

const API_KEY = "AIzaSyCLBKeyt3NGyoL4JxNfYoo_mlgUGcOvqzU";
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

export class GeminiService {
  private static async makeRequest(messages: GeminiMessage[]): Promise<GeminiResponse> {
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
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  private static async generateResponse(prompt: string, context: string = ''): Promise<string> {
    try {
      const messages: GeminiMessage[] = [{
        role: 'user',
        parts: [
          { 
            text: context ? `${context}\n\n${prompt}` : prompt
          }
        ]
      }];

      const response = await this.makeRequest(messages);
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Error generating response:', error);
      throw error instanceof Error ? error : new Error('Failed to generate response');
    }
  }

  static async getDiseaseAdvice(diseaseName: string, plantName?: string, additionalContext?: string): Promise<string> {
    const context = `A plant has been identified with the disease: "${diseaseName}"${plantName ? ` on ${plantName}` : ''}. ${additionalContext || ''}`;
    
    const prompt = `Please provide comprehensive advice for treating and managing this plant disease. Include:
1. Disease description and symptoms
2. Causes and conditions that favor the disease
3. Immediate treatment steps (both organic and chemical options)
4. Prevention measures
5. Long-term management strategies
6. When to seek professional help
7. Expected recovery timeline

Be specific and practical for farmers.`;

    return this.generateResponse(prompt, context);
  }

  static async getGeneralFarmingAdvice(question: string): Promise<string> {
    return this.generateResponse(question);
  }

  static async detectPlantDisease(imageBase64: string, plantName: string, mimeType: string = 'image/jpeg'): Promise<DiseaseDetectionResult> {
    try {
      // Modified prompt to request shorter responses
      const prompt = `Analyze this ${plantName} plant image for diseases. Provide a BRIEF analysis in this exact JSON format (keep descriptions under 50 words each):

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

      const response = await this.makeRequest(messages);
      
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
}