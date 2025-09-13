const FERTILIZER_AI_API_KEY = 'AIzaSyCzSt0-_ZD1WTXpb8b15yX5i9YqZepq62w';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-1.5-pro';

export interface FertilizerData {
  cropName: string;
  growthStage: 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity';
  soilPh: number;
  soilType: 'sandy' | 'clay' | 'loam' | 'silt';
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
  };
  weatherConditions: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  farmSize: 'small' | 'medium' | 'large';
  budget: 'low' | 'medium' | 'high';
  preference: 'organic' | 'chemical' | 'mixed';
}

export interface FertilizerRecommendation {
  fertilizerName: string;
  type: 'organic' | 'chemical' | 'biofertilizer';
  npkRatio: string;
  applicationRate: string;
  applicationMethod: string;
  timing: string;
  frequency: string;
  cost: string;
  benefits: string[];
  precautions: string[];
  alternatives: string[];
  expectedResults: string;
  soilImprovement: string;
}

export interface FertilizerSchedule {
  stage: string;
  fertilizers: FertilizerRecommendation[];
  totalCost: string;
  applicationNotes: string;
}

export interface FertilizerResponse {
  recommendations: FertilizerRecommendation[];
  schedule: FertilizerSchedule[];
  soilAnalysis: string;
  generalAdvice: string;
  costEstimate: string;
  expectedYield: string;
  warnings: string[];
}

export class FertilizerRecommendationService {
  private static async makeGeminiRequest(prompt: string): Promise<string> {
    const response = await fetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent?key=${FERTILIZER_AI_API_KEY}`, {
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
      throw new Error(`Fertilizer AI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
        return candidate.content.parts[0].text;
      }
    }
    
    throw new Error('No valid response from Fertilizer AI API');
  }

  static async getFertilizerRecommendations(
    fertilizerData: FertilizerData,
    additionalInfo?: {
      previousCrop?: string;
      irrigationType?: 'drip' | 'flood' | 'sprinkler' | 'rainfed';
      pestIssues?: string[];
      diseaseHistory?: string[];
    }
  ): Promise<FertilizerResponse> {
    try {
      const prompt = `You are an expert agricultural scientist and soil fertility specialist. Provide comprehensive fertilizer recommendations for the following crop and conditions:

**Crop Information:**
- Crop: ${fertilizerData.cropName}
- Growth Stage: ${fertilizerData.growthStage}
- Farm Size: ${fertilizerData.farmSize}
- Budget: ${fertilizerData.budget}
- Preference: ${fertilizerData.preference}

**Soil Analysis:**
- pH: ${fertilizerData.soilPh}
- Soil Type: ${fertilizerData.soilType}
- Nitrogen: ${fertilizerData.nutrients.nitrogen} ppm
- Phosphorus: ${fertilizerData.nutrients.phosphorus} ppm
- Potassium: ${fertilizerData.nutrients.potassium} ppm
- Organic Matter: ${fertilizerData.nutrients.organicMatter}%

**Weather Conditions:**
- Temperature: ${fertilizerData.weatherConditions.temperature}°C
- Humidity: ${fertilizerData.weatherConditions.humidity}%
- Rainfall: ${fertilizerData.weatherConditions.rainfall}mm

${additionalInfo ? `**Additional Information:**
- Previous Crop: ${additionalInfo.previousCrop || 'Not specified'}
- Irrigation: ${additionalInfo.irrigationType || 'Not specified'}
- Pest Issues: ${additionalInfo.pestIssues?.join(', ') || 'None reported'}
- Disease History: ${additionalInfo.diseaseHistory?.join(', ') || 'None reported'}` : ''}

Provide detailed fertilizer recommendations including:

1. **Specific fertilizer recommendations** for each growth stage
2. **NPK ratios and application rates**
3. **Application methods and timing**
4. **Cost estimates** based on budget
5. **Organic and chemical options** based on preference
6. **Soil improvement strategies**
7. **Expected yield improvements**
8. **Precautions and warnings**
9. **Alternative options** for different budgets
10. **Seasonal application schedule**

Format your response as a JSON object with this exact structure:
{
  "recommendations": [
    {
      "fertilizerName": "string",
      "type": "organic|chemical|biofertilizer",
      "npkRatio": "string",
      "applicationRate": "string",
      "applicationMethod": "string",
      "timing": "string",
      "frequency": "string",
      "cost": "string",
      "benefits": ["string array"],
      "precautions": ["string array"],
      "alternatives": ["string array"],
      "expectedResults": "string",
      "soilImprovement": "string"
    }
  ],
  "schedule": [
    {
      "stage": "string",
      "fertilizers": [/* fertilizer objects */],
      "totalCost": "string",
      "applicationNotes": "string"
    }
  ],
  "soilAnalysis": "string",
  "generalAdvice": "string",
  "costEstimate": "string",
  "expectedYield": "string",
  "warnings": ["string array"]
}

Focus on:
- Practical, cost-effective solutions
- Indian market availability and prices
- Weather-appropriate timing
- Soil-specific requirements
- Sustainable farming practices
- Yield optimization strategies`;

      const response = await this.makeGeminiRequest(prompt);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const result = JSON.parse(jsonStr) as FertilizerResponse;
        return result;
      } else {
        throw new Error('Could not parse structured response from Fertilizer AI');
      }
    } catch (error: unknown) {
      console.error('Fertilizer Recommendation Error:', error);
      
      // Return fallback recommendations
      return {
        recommendations: [{
          fertilizerName: 'NPK 19:19:19',
          type: 'chemical',
          npkRatio: '19:19:19',
          applicationRate: '50-75 kg per hectare',
          applicationMethod: 'Broadcast or band placement',
          timing: 'At planting and 30 days after',
          frequency: '2-3 times per season',
          cost: '₹2,500-3,500 per 50kg bag',
          benefits: ['Balanced nutrition', 'Easy application', 'Quick results'],
          precautions: ['Don\'t over-apply', 'Keep away from children', 'Store in dry place'],
          alternatives: ['Organic compost', 'Vermicompost', 'Farmyard manure'],
          expectedResults: '20-30% yield increase',
          soilImprovement: 'Maintains soil fertility'
        }],
        schedule: [{
          stage: 'Planting',
          fertilizers: [],
          totalCost: '₹5,000-7,500 per hectare',
          applicationNotes: 'Apply at time of planting'
        }],
        soilAnalysis: 'Soil needs balanced nutrition for optimal growth',
        generalAdvice: 'Regular soil testing recommended',
        costEstimate: '₹5,000-10,000 per hectare',
        expectedYield: '15-25% improvement',
        warnings: ['Follow recommended rates', 'Test soil regularly']
      };
    }
  }

  static async getFertilizerDetails(fertilizerName: string, cropName: string): Promise<string> {
    const prompt = `Provide detailed information about ${fertilizerName} for ${cropName} cultivation:

1. **Fertilizer Composition**: NPK ratio, micronutrients, organic matter
2. **Application Guidelines**: Rate, method, timing, frequency
3. **Benefits**: Specific advantages for the crop
4. **Precautions**: Safety measures, storage, handling
5. **Cost Analysis**: Price per unit, cost per hectare
6. **Availability**: Where to buy, brands, alternatives
7. **Mixing Instructions**: Compatibility with other inputs
8. **Environmental Impact**: Sustainability aspects
9. **Results Timeline**: When to expect results
10. **Troubleshooting**: Common issues and solutions

Provide practical advice for Indian farmers with specific brand recommendations and local market prices.`;

    try {
      return await this.makeGeminiRequest(prompt);
    } catch (error: unknown) {
      console.error('Fertilizer Details Error:', error);
      return `Detailed information about ${fertilizerName} is currently unavailable. Please try again later.`;
    }
  }
}

