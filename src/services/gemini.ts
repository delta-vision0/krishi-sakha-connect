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
      const prompt = `Analyze this image of a ${plantName} plant and provide a detailed analysis in JSON format. The plant image shows potential disease symptoms or pest damage.

Format your response EXACTLY as this JSON structure (no additional text or formatting):
{
  "plantName": "${plantName}",
  "scientificName": "string",
  "family": "string",
  "isHealthy": boolean,
  "confidence": number (0-100),
  "diseases": [{
    "name": "string",
    "probability": number (0-100),
    "description": "string",
    "symptoms": ["string"],
    "causes": ["string"],
    "treatment": {
      "organic": ["string"],
      "chemical": ["string"]
    },
    "prevention": ["string"]
  }],
  "plantDetails": {
    "commonNames": ["string"],
    "description": "string",
    "careInstructions": ["string"]
  }
}

Provide detailed disease information if detected, or indicate plant health with isHealthy=true if no issues found.`;

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
      
      if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }

      const responseText = response.candidates[0].content.parts[0].text;
      
      // Clean the response and extract JSON
      const cleanText = responseText.replace(/```json\s*|\s*```/g, '').trim();
      const match = cleanText.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error('Invalid JSON response format');
      }

      const result = JSON.parse(match[0]) as DiseaseDetectionResult;

      // Ensure required fields have default values
      return {
        plantName: result.plantName || plantName,
        scientificName: result.scientificName || '',
        family: result.family || '',
        isHealthy: result.isHealthy ?? false,
        confidence: result.confidence || 0,
        diseases: result.diseases || [],
        plantDetails: {
          commonNames: result.plantDetails?.commonNames || [],
          description: result.plantDetails?.description || '',
          careInstructions: result.plantDetails?.careInstructions || []
        }
      };

    } catch (error) {
      console.error('Error in plant disease detection:', error);
      
      // Return a fallback result if API fails
      return {
        plantName: 'Unknown Plant',
        isHealthy: false,
        confidence: 0,
        diseases: [{
          name: 'Analysis Failed',
          probability: 0,
          description: 'Unable to analyze the image. Please try again with a clearer photo.',
          symptoms: [],
          causes: [],
          treatment: {
            organic: ['Try taking a clearer photo with better lighting'],
            chemical: []
          },
          prevention: []
        }],
        plantDetails: {
          commonNames: [],
          description: 'Unable to identify plant due to analysis error.',
          careInstructions: ['Please try uploading a clearer image']
        }
      };
    }
  }
}