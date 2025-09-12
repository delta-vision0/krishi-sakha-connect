import React, { useState } from 'react';
import { Sparkles, TrendingUp, Eye, ArrowLeft } from 'lucide-react';

interface CropRecommendationProps {
  onBack: () => void;
}

export const CropRecommendation = ({ onBack }: CropRecommendationProps) => {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations = [
    {
      crop: 'Maize 🌽',
      suitability: 'Highly Suitable',
      revenue: '₹45,000 per hectare',
      season: 'Kharif',
      confidence: 95
    },
    {
      crop: 'Cotton 🌿',
      suitability: 'Suitable',
      revenue: '₹38,000 per hectare', 
      season: 'Kharif',
      confidence: 88
    },
    {
      crop: 'Soybean 🌱',
      suitability: 'Moderately Suitable',
      revenue: '₹32,000 per hectare',
      season: 'Kharif',
      confidence: 75
    }
  ];

  return (
    <div className="fade-in">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="mr-3 p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="heading-2">Crop Recommendation</h1>
      </div>

      <div id="crop-rec" className="space-y-6">
        {!showRecommendations ? (
        <div className="krishi-card text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="heading-3 mb-4">Get Smart Crop Recommendations</h2>
          <p className="body-text text-muted-foreground mb-6">
            Based on your location, soil type, and weather patterns, we'll recommend the best crops for maximum yield.
          </p>
          <button 
            onClick={() => setShowRecommendations(true)}
            className="btn-primary w-full"
          >
            🌿 Get Crop Recommendation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="krishi-card">
            <h2 className="heading-3 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Recommended Crops for Your Region
            </h2>
            <p className="caption mb-6">Based on Ichalkaranji, Maharashtra conditions</p>
            
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-border rounded-xl p-4 mb-4 last:mb-0 hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{rec.crop}</h3>
                    <span className="status-success">{rec.suitability}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{rec.revenue}</div>
                    <div className="caption">Expected Revenue</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="caption">Season: {rec.season}</span>
                    <span className="caption">Confidence: {rec.confidence}%</span>
                  </div>
                  <button className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors">
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={() => setShowRecommendations(false)}
              className="w-full mt-6 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Get New Recommendations
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};