import React, { useState } from 'react';
import { Camera, Upload, Zap, Leaf, Shield } from 'lucide-react';

interface PestDetectionProps {
  onOpenGemini: () => void;
}

export const PestDetection = ({ onOpenGemini }: PestDetectionProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState('organic');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        // Simulate detection after image upload
        setTimeout(() => setShowResult(true), 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const organicSolutions = [
    "Spray neem oil solution (2-3ml per liter water)",
    "Apply copper fungicide early morning",
    "Remove affected leaves and destroy them",
    "Improve air circulation around plants",
    "Avoid overhead watering"
  ];

  const chemicalSolutions = [
    "Apply Mancozeb 75% WP @ 2g/liter",
    "Use Copper Oxychloride 50% WP @ 3g/liter", 
    "Spray Metalaxyl + Mancozeb @ 2.5g/liter",
    "Apply in evening hours for better effectiveness",
    "Repeat application after 10-15 days if needed"
  ];

  return (
    <div id="pest-detect" className="space-y-6 fade-in">
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
          <div>
            <div className="relative mb-4">
              <img 
                src={selectedImage} 
                alt="Uploaded leaf" 
                className="w-full h-64 object-cover rounded-xl"
              />
              {!showResult && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p>Analyzing image...</p>
                  </div>
                </div>
              )}
            </div>

            {showResult && (
              <div className="space-y-4 slide-up">
                <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">Tomato Late Blight</h3>
                    <span className="status-warning">98% Confident</span>
                  </div>
                  <p className="caption">
                    Fungal disease caused by Phytophthora infestans. Requires immediate attention.
                  </p>
                </div>

                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="flex border-b border-border">
                    <button 
                      onClick={() => setActiveTab('organic')}
                      className={`flex-1 px-4 py-3 font-medium transition-colors ${
                        activeTab === 'organic' 
                          ? 'bg-primary text-white' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Leaf className="w-4 h-4 inline mr-2" />
                      Organic Solutions
                    </button>
                    <button 
                      onClick={() => setActiveTab('chemical')}
                      className={`flex-1 px-4 py-3 font-medium transition-colors ${
                        activeTab === 'chemical' 
                          ? 'bg-primary text-white' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Shield className="w-4 h-4 inline mr-2" />
                      Chemical Solutions
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <ol className="space-y-2">
                      {(activeTab === 'organic' ? organicSolutions : chemicalSolutions).map((solution, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="body-text">{solution}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <button 
                  onClick={onOpenGemini}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Zap size={20} />
                  Ask Gemini for More Details
                </button>

                <button 
                  onClick={() => {
                    setSelectedImage(null);
                    setShowResult(false);
                  }}
                  className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Scan Another Plant
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};