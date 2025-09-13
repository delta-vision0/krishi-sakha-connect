const CROP_AI_API_KEY = 'AIzaSyCLBKeyt3NGyoL4JxNfYoo_mlgUGcOvqzU';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-1.5-pro';

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface SoilData {
  ph: number;
  type: string;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  organicMatter: number;
}

export interface CropRecommendation {
  cropName: string;
  scientificName: string;
  family: string;
  suitabilityScore: number;
  reasons: string[];
  plantingTime: string;
  harvestTime: string;
  waterRequirements: string;
  soilRequirements: string;
  climateRequirements: string;
  marketValue: string;
  yieldExpectation: string;
  careInstructions: string[];
  pestManagement: string[];
  diseaseResistance: string[];
  economicBenefits: string[];
  challenges: string[];
  alternativeCrops: string[];
}

export interface CropRecommendationResponse {
  recommendations: CropRecommendation[];
  summary: string;
  bestSeason: string;
  generalAdvice: string;
}

export class CropRecommendationService {
  private static async makeGeminiRequest(prompt: string): Promise<string> {
    const response = await fetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${CROP_AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
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
      throw new Error(`Crop AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    throw new Error('No valid response from Crop AI API');
  }

  static async getCropRecommendations(
    weatherData: WeatherData,
    soilData?: SoilData,
    preferences?: {
      cropType?: 'cereals' | 'vegetables' | 'fruits' | 'pulses' | 'oilseeds' | 'spices' | 'all';
      farmSize?: 'small' | 'medium' | 'large';
      marketFocus?: 'local' | 'export' | 'processing';
      budget?: 'low' | 'medium' | 'high';
    }
  ): Promise<CropRecommendationResponse> {
    try {
      const prompt = `You are an expert agricultural scientist and agronomist specializing in crop recommendations for Indian farmers. 

Analyze the following farming conditions and provide detailed crop recommendations:

**Location & Climate:**
- Location: ${weatherData.location}
- Temperature: ${weatherData.temperature}°C
- Humidity: ${weatherData.humidity}%
- Rainfall: ${weatherData.rainfall}mm
- Season: ${weatherData.season}
${weatherData.coordinates ? `- Coordinates: ${weatherData.coordinates.latitude}, ${weatherData.coordinates.longitude}` : ''}

${soilData ? `**Soil Conditions:**
- pH: ${soilData.ph}
- Soil Type: ${soilData.type}
- Nitrogen: ${soilData.nutrients.nitrogen} ppm
- Phosphorus: ${soilData.nutrients.phosphorus} ppm
- Potassium: ${soilData.nutrients.potassium} ppm
- Organic Matter: ${soilData.organicMatter}%` : ''}

${preferences ? `**Farmer Preferences:**
- Crop Type: ${preferences.cropType || 'all'}
- Farm Size: ${preferences.farmSize || 'medium'}
- Market Focus: ${preferences.marketFocus || 'local'}
- Budget: ${preferences.budget || 'medium'}` : ''}

Provide a comprehensive analysis with:

1. **Top 5 crop recommendations** with detailed information
2. **Suitability scores** (0-100) for each crop
3. **Specific reasons** why each crop is suitable
4. **Planting and harvest timelines**
5. **Water, soil, and climate requirements**
6. **Market value and yield expectations**
7. **Care instructions and pest management**
8. **Economic benefits and potential challenges**
9. **Alternative crop options**

Format your response as a JSON object with this exact structure:
{
  "recommendations": [
    {
      "cropName": "string",
      "scientificName": "string",
      "family": "string",
      "suitabilityScore": number,
      "reasons": ["string array"],
      "plantingTime": "string",
      "harvestTime": "string",
      "waterRequirements": "string",
      "soilRequirements": "string",
      "climateRequirements": "string",
      "marketValue": "string",
      "yieldExpectation": "string",
      "careInstructions": ["string array"],
      "pestManagement": ["string array"],
      "diseaseResistance": ["string array"],
      "economicBenefits": ["string array"],
      "challenges": ["string array"],
      "alternativeCrops": ["string array"]
    }
  ],
  "summary": "string",
  "bestSeason": "string",
  "generalAdvice": "string"
}

Focus on crops that are:
- Suitable for the given climate and soil conditions
- Economically viable for the farmer's budget and market focus
- Appropriate for the farm size
- Have good disease resistance and pest management options
- Provide good yield potential

Be specific about Indian farming conditions, local market prices, and practical implementation advice.`;

      const response = await this.makeGeminiRequest(prompt);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const result = JSON.parse(jsonStr) as CropRecommendationResponse;
        return result;
      } else {
        throw new Error('Could not parse structured response from Crop AI');
      }
    } catch (error: unknown) {
      console.error('Crop Recommendation Error:', error);
      
      // Return fallback recommendations
      return {
        recommendations: [{
          cropName: 'Rice',
          scientificName: 'Oryza sativa',
          family: 'Poaceae',
          suitabilityScore: 75,
          reasons: ['Suitable for high humidity and rainfall conditions'],
          plantingTime: 'June-July',
          harvestTime: 'October-November',
          waterRequirements: 'High - requires standing water',
          soilRequirements: 'Clay loam with good water retention',
          climateRequirements: 'Warm and humid climate',
          marketValue: '₹2,000-3,000 per quintal',
          yieldExpectation: '4-6 tonnes per hectare',
          careInstructions: ['Regular water management', 'Proper spacing', 'Weed control'],
          pestManagement: ['Use resistant varieties', 'Crop rotation', 'Biological control'],
          diseaseResistance: ['Blast resistant varieties available'],
          economicBenefits: ['High market demand', 'Government support'],
          challenges: ['High water requirement', 'Labor intensive'],
          alternativeCrops: ['Wheat', 'Maize', 'Sugarcane']
        }],
        summary: 'Based on your conditions, rice cultivation is recommended',
        bestSeason: 'Kharif (Monsoon)',
        generalAdvice: 'Consider soil testing and water availability before finalizing crop selection'
      };
    }
  }

  static async getCropDetails(cropName: string, weatherData: WeatherData): Promise<string> {
    const prompt = `Provide detailed information about ${cropName} cultivation including:

1. **Crop Overview**: Scientific name, family, origin
2. **Growing Conditions**: Temperature, rainfall, soil requirements
3. **Planting Guide**: Best time, spacing, seed rate
4. **Care Instructions**: Watering, fertilizing, weeding
5. **Pest & Disease Management**: Common issues and solutions
6. **Harvesting**: Timing, methods, yield expectations
7. **Post-Harvest**: Storage, processing, marketing
8. **Economic Aspects**: Cost of cultivation, expected returns
9. **Varieties**: Recommended varieties for different conditions
10. **Challenges & Solutions**: Common problems and remedies

Current conditions:
- Location: ${weatherData.location}
- Temperature: ${weatherData.temperature}°C
- Humidity: ${weatherData.humidity}%
- Rainfall: ${weatherData.rainfall}mm
- Season: ${weatherData.season}

Provide practical, actionable advice suitable for Indian farmers.`;

    try {
      return await this.makeGeminiRequest(prompt);
    } catch (error: unknown) {
      console.error('Crop Details Error:', error);
      return `Detailed information about ${cropName} is currently unavailable. Please try again later.`;
    }
  }
}

