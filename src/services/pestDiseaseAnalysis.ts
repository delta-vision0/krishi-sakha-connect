import { GeminiService, fileToBase64 } from './gemini';

export interface DiseaseAnalysisResult {
  identification: {
    isHealthy: boolean;
    diseaseName: string;
    scientificName: string;
    confidenceScore: number;
    shortDescription: string;
  };
  solutionTabs: {
    aboutDisease: { title: string; content: Array<{ heading: string; text: string }> };
    organicSolutions: { title: string; content: Array<{ heading: string; text: string }> };
    chemicalSolutions: { title: string; content: Array<{ heading: string; text: string }> };
    preventiveMeasures: { title: string; content: Array<{ heading: string; text: string }> };
  };
}

export async function analyzePlantDisease(file: File, plantName: string, location = 'Ichalkaranji, Maharashtra, India'): Promise<DiseaseAnalysisResult> {
  // Get the current language from localStorage
  const currentLanguage = localStorage.getItem('farmingAppLanguage') || 'en';
  
  if (!file) throw new Error('No image file provided');
  if (!plantName) throw new Error('Plant name is required');
  if (!file.type.startsWith('image/')) throw new Error('Invalid file type. Please upload an image file.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image too large. Please use an image under 5MB.');

  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);
    // Call Gemini API directly with language parameter
    const geminiResult = await GeminiService.detectPlantDisease(base64, plantName, file.type, currentLanguage);

    // Map Gemini result to DiseaseAnalysisResult
    const firstDisease = geminiResult.diseases && geminiResult.diseases[0];
    const isHealthy = geminiResult.isHealthy || !firstDisease || firstDisease.probability < 10;
    return {
      identification: {
        isHealthy,
        diseaseName: isHealthy ? 'Healthy' : (firstDisease?.name || 'Unknown'),
        scientificName: geminiResult.scientificName || '',
        confidenceScore: (firstDisease?.probability || geminiResult.confidence || 0) / 100,
        shortDescription: isHealthy
          ? 'The plant appears healthy.'
          : (firstDisease?.description || 'Possible disease detected.')
      },
      solutionTabs: {
        aboutDisease: {
          title: 'About the Disease',
          content: [
            {
              heading: 'What is it?',
              text: firstDisease?.description || 'No description available.'
            },
            {
              heading: 'Symptoms to Look For',
              text: firstDisease?.symptoms?.join(', ') || 'No symptoms listed.'
            },
            {
              heading: 'Favorable Conditions',
              text: firstDisease?.causes?.join(', ') || 'No information.'
            }
          ]
        },
        organicSolutions: {
          title: 'Organic & Cultural Solutions',
          content: [
            {
              heading: 'Cultural Practices',
              text: 'Practice crop rotation, proper spacing, and remove plant debris.'
            },
            {
              heading: 'Mechanical Control',
              text: 'Remove and destroy infected plant parts.'
            },
            {
              heading: 'Organic Sprays',
              text: (firstDisease?.treatment?.organic?.join(', ') || 'Neem oil, bio-fungicides, or horticultural oils.')
            }
          ]
        },
        chemicalSolutions: {
          title: 'Chemical Solutions',
          content: [
            {
              heading: 'Recommended Fungicides/Pesticides',
              text: (firstDisease?.treatment?.chemical?.join(', ') || 'Mancozeb, Copper Oxychloride, or Imidacloprid (as appropriate).')
            },
            {
              heading: 'Application Guide',
              text: 'Apply as per label instructions, ensuring full coverage. Use chemicals as a last resort.'
            },
            {
              heading: 'Important Disclaimer',
              text: 'IMPORTANT: Chemical treatments should be a last resort. Always follow the manufacturer\'s instructions for dosage and safety precautions, including wearing protective gear. It is highly recommended to consult the local Krishi Vigyan Kendra (KVK) or an agricultural extension officer before applying any chemical pesticides or fungicides to ensure it is appropriate for your specific crop and situation.'
            }
          ]
        },
        preventiveMeasures: {
          title: 'Prevention for Next Season',
          content: [
            {
              heading: 'Resistant Varieties',
              text: 'Use disease-resistant varieties suitable for Maharashtra.'
            },
            {
              heading: 'Field Sanitation',
              text: 'Remove and destroy crop residues after harvest.'
            },
            {
              heading: 'Water Management',
              text: 'Use drip irrigation and avoid overhead watering to minimize leaf wetness.'
            }
          ]
        }
      }
    };
  } catch (err) {
    console.error('Error in plant disease analysis:', err);
    throw err instanceof Error ? err : new Error('Unknown error during analysis');
  }
}