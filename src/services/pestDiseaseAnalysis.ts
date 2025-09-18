// Route analysis through backend to keep API keys server-side

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

export async function analyzePlantDisease(
  file: File,
  plantName: string,
  location = 'Ichalkaranji, Maharashtra, India',
  options?: { signal?: AbortSignal }
): Promise<DiseaseAnalysisResult> {
  // Get the current language from localStorage
  const currentLanguage = localStorage.getItem('farmingAppLanguage') || 'en';
  
  if (!file) throw new Error('No image file provided');
  if (!plantName) throw new Error('Plant name is required');
  if (!file.type.startsWith('image/')) throw new Error('Invalid file type. Please upload an image file.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image too large. Please use an image under 5MB.');

  try {
    // Send file to backend for analysis
    const form = new FormData();
    form.append('image', file);
    form.append('plantName', plantName);
    form.append('location', location);

    const response = await fetch('/api/analyze', { method: 'POST', body: form, signal: options?.signal });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.error || `Analysis failed: ${response.status}`);
    }
    const data = await response.json();
    const analysis = data?.analysis;
    if (!analysis?.identification || !analysis?.solutionTabs) {
      throw new Error('Invalid analysis response');
    }
    return analysis as DiseaseAnalysisResult;
  } catch (err) {
    console.error('Error in plant disease analysis:', err);
    throw err instanceof Error ? err : new Error('Unknown error during analysis');
  }
}