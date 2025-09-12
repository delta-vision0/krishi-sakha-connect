import React, { useState } from 'react';
import { Sprout, ChevronDown } from 'lucide-react';

export const FertilizerAdvisor = () => {
  const [cropType, setCropType] = useState('');
  const [soilType, setSoilType] = useState('');
  const [showResult, setShowResult] = useState(false);

  const cropOptions = [
    'Maize (Corn)',
    'Cotton', 
    'Soybean',
    'Wheat',
    'Rice',
    'Tomato',
    'Onion',
    'Sugarcane'
  ];

  const soilOptions = [
    'Black Soil (Regur)',
    'Red Soil',
    'Loamy Soil',
    'Sandy Soil',
    'Clay Soil',
    'Alluvial Soil'
  ];

  const handleFindFertilizer = () => {
    if (cropType && soilType) {
      setShowResult(true);
    }
  };

  return (
    <div id="fert-rec" className="space-y-6 fade-in">
      <div className="krishi-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Sprout className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="heading-3">Fertilizer Advisor</h2>
            <p className="caption">Get personalized fertilizer recommendations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Select Crop Type</label>
            <div className="relative">
              <select 
                value={cropType} 
                onChange={(e) => setCropType(e.target.value)}
                className="farm-select appearance-none pr-10"
              >
                <option value="">Choose your crop</option>
                {cropOptions.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Select Soil Type</label>
            <div className="relative">
              <select 
                value={soilType} 
                onChange={(e) => setSoilType(e.target.value)}
                className="farm-select appearance-none pr-10"
              >
                <option value="">Choose your soil type</option>
                {soilOptions.map(soil => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <button 
            onClick={handleFindFertilizer}
            disabled={!cropType || !soilType}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find Best Fertilizer
          </button>
        </div>
      </div>

      {showResult && (
        <div className="krishi-card slide-up">
          <h3 className="heading-3 mb-4">Recommended Fertilizer</h3>
          
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-4">
            <h4 className="font-bold text-lg text-primary mb-2">DAP (Diammonium Phosphate) 18-46-0</h4>
            <p className="body-text text-muted-foreground mb-4">
              Perfect for {cropType.toLowerCase()} cultivation in {soilType.toLowerCase()}
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="font-bold text-primary">18%</div>
                <div className="caption">Nitrogen</div>
              </div>
              <div>
                <div className="font-bold text-primary">46%</div>
                <div className="caption">Phosphorus</div>
              </div>
              <div>
                <div className="font-bold text-primary">0%</div>
                <div className="caption">Potassium</div>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-4">
            <h5 className="font-semibold mb-2">Application Guidelines:</h5>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Apply 50 kg per acre as basal dose</li>
              <li>• Mix well with soil during field preparation</li>
              <li>• Apply 15-20 days before sowing</li>
              <li>• Ensure adequate soil moisture during application</li>
            </ul>
          </div>

          <button 
            onClick={() => setShowResult(false)}
            className="w-full mt-4 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            Get Another Recommendation
          </button>
        </div>
      )}
    </div>
  );
};