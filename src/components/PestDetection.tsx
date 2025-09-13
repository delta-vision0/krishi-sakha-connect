import React, { useState, useEffect } from 'react';
import { Camera, Upload, Zap, Leaf, Shield, Loader2, AlertCircle } from 'lucide-react';
import { analyzePlantDisease, DiseaseAnalysisResult } from '@/services/pestDiseaseAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PestDetectionProps {
  onOpenGemini: (diseaseContext?: {
    diseaseName: string;
    plantName: string;
    confidence: number;
  }) => void;
}

export function PestDetection({ onOpenGemini }: PestDetectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [plantName, setPlantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DiseaseAnalysisResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const loadingMessages = [
    "Scanning leaf structure and patterns...",
    "Analyzing tissue health and coloration...",
    "Identifying potential disease indicators...",
    "Checking against known plant conditions...",
    "Preparing detailed health assessment...",
    "Generating treatment recommendations..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    let messageTimer: NodeJS.Timeout;

    if (isLoading) {
      const rotateMessage = () => {
        setLoadingMessage(loadingMessages[currentIndex]);
        currentIndex = (currentIndex + 1) % loadingMessages.length;
      };

      rotateMessage(); // Show first message immediately
      messageTimer = setInterval(rotateMessage, 2500); // Change message every 2.5 seconds

      return () => {
        clearInterval(messageTimer);
        setLoadingMessage('');
      };
    }
  }, [isLoading]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setAnalysisResult(null);

    // Display the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalysis = async () => {
    if (!selectedImage || !plantName) {
      setError('Please provide both an image and plant name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert dataURL back to File object
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], 'plant-image.jpg', { type: 'image/jpeg' });

      const result = await analyzePlantDisease(file, plantName);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setPlantName('');
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="krishi-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="heading-3">Pest & Disease Scanner</h2>
            <p className="caption">Upload a photo to detect plant diseases instantly</p>
          </div>
        </div>

        {!selectedImage ? (
          <div className="text-center">
            <div className="border-2 border-dashed border-border rounded-xl p-8 mb-4 hover:border-primary/50 transition-colors">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="body-text text-muted-foreground mb-4">
                Take a clear photo of the affected leaf or plant part
              </p>
              <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
                <Camera size={20} />
                Upload Leaf Photo
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Uploaded leaf" 
                className="w-full h-64 object-cover rounded-xl"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p>Analyzing image with Gemini AI...</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg text-red-800">Analysis Failed</h3>
                </div>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={resetAnalysis}
                  className="mt-4 btn-secondary"
                >
                  Try Again
                </button>
              </div>
            )}

            {!analysisResult && !error && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter plant name (e.g., Tomato, Rice, Cotton)"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={handleAnalysis}
                  disabled={!plantName || isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera size={20} />
                      Analyze Plant
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg text-red-800">Analysis Failed</h3>
                </div>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-4">
                <div className={`${
                  analysisResult.identification.isHealthy 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                } border rounded-xl p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">
                      Analysis Results
                    </h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      analysisResult.identification.isHealthy
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {Math.round(analysisResult.identification.confidenceScore * 100)}% Confident
                    </span>
                  </div>

                  <p className="text-sm mb-2">
                    <strong>Plant:</strong> {plantName}
                  </p>
                  {!analysisResult.identification.isHealthy && (
                    <>
                      <p className="text-sm mb-2">
                        <strong>Disease:</strong> {analysisResult.identification.diseaseName}
                      </p>
                      <p className="text-sm mb-2">
                        <strong>Scientific Name:</strong> {analysisResult.identification.scientificName}
                      </p>
                    </>
                  )}
                  <p className="text-sm">
                    {analysisResult.identification.shortDescription}
                  </p>
                </div>

                {!analysisResult.identification.isHealthy && (
                  <Tabs defaultValue="aboutDisease" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="aboutDisease">About</TabsTrigger>
                      <TabsTrigger value="organicSolutions">Organic</TabsTrigger>
                      <TabsTrigger value="chemicalSolutions">Chemical</TabsTrigger>
                      <TabsTrigger value="preventiveMeasures">Prevention</TabsTrigger>
                    </TabsList>

                    {Object.entries(analysisResult.solutionTabs).map(([key, tab]) => (
                      <TabsContent key={key} value={key} className="mt-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                          <h3 className="font-semibold text-lg mb-4">{tab.title}</h3>
                          <div className="space-y-4">
                            {tab.content.map((item, index) => (
                              <div key={index}>
                                <h4 className="font-medium text-sm text-primary mb-1">
                                  {item.heading}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => onOpenGemini({
                      diseaseName: analysisResult.identification.diseaseName,
                      plantName: plantName,
                      confidence: analysisResult.identification.confidenceScore
                    })}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Zap size={20} />
                    Ask Gemini for More Details
                  </button>

                  <button 
                    onClick={resetAnalysis}
                    className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Scan Another Plant
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Add this CSS to your global styles or tailwind.config.js