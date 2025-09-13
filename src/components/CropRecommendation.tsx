import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Eye, ArrowLeft, Loader2, AlertCircle, MapPin, Thermometer, Droplets, CloudRain } from 'lucide-react';
import { CropRecommendationService, WeatherData, CropRecommendation as CropRec, CropRecommendationResponse } from '@/services/cropRecommendation';
import { useLocationContext } from '@/hooks/useLocation';

interface CropRecommendationProps {
  onBack: () => void;
}

export const CropRecommendation = ({ onBack }: CropRecommendationProps) => {
  const { coords, label } = useLocationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendationResponse | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropRec | null>(null);
  const [cropDetails, setCropDetails] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    cropType: 'all' as 'cereals' | 'vegetables' | 'fruits' | 'pulses' | 'oilseeds' | 'spices' | 'all',
    farmSize: 'medium' as 'small' | 'medium' | 'large',
    marketFocus: 'local' as 'local' | 'export' | 'processing',
    budget: 'medium' as 'low' | 'medium' | 'high'
  });

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    if (month >= 6 && month <= 10) return 'Kharif (Monsoon)';
    if (month >= 11 || month <= 2) return 'Rabi (Winter)';
    return 'Zaid (Summer)';
  };

  const getWeatherData = (): WeatherData => ({
    temperature: 28, // Default temperature - in real app, get from weather API
    humidity: 65,    // Default humidity
    rainfall: 1200,  // Default annual rainfall
    season: getCurrentSeason(),
    location: label || 'Unknown Location',
    coordinates: coords || undefined
  });

  const handleGetRecommendations = async () => {
    if (!coords) {
      setError('Please select a location first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const weatherData = getWeatherData();
      const result = await CropRecommendationService.getCropRecommendations(weatherData, undefined, preferences);
      setRecommendations(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get crop recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (crop: CropRec) => {
    setSelectedCrop(crop);
    setShowDetails(true);
    setIsLoading(true);

    try {
      const weatherData = getWeatherData();
      const details = await CropRecommendationService.getCropDetails(crop.cropName, weatherData);
      setCropDetails(details);
    } catch (err: unknown) {
      setCropDetails('Details not available at the moment. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="heading-2">AI Crop Recommendation</h1>
      </div>

      <div id="crop-rec" className="space-y-6">
        {!recommendations ? (
          <div className="space-y-6">
            {/* Location Info */}
            <div className="krishi-card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Current Location & Weather
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">{label || 'Select Location'}</div>
                    <div className="text-xs text-muted-foreground">Location</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">28°C</div>
                    <div className="text-xs text-muted-foreground">Temperature</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">65%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">1200mm</div>
                    <div className="text-xs text-muted-foreground">Rainfall</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="krishi-card">
              <h3 className="font-semibold mb-4">Farming Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Crop Type</label>
                  <select 
                    value={preferences.cropType}
                    onChange={(e) => setPreferences(prev => ({ ...prev, cropType: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="all">All Crops</option>
                    <option value="cereals">Cereals</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="pulses">Pulses</option>
                    <option value="oilseeds">Oilseeds</option>
                    <option value="spices">Spices</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Farm Size</label>
                  <select 
                    value={preferences.farmSize}
                    onChange={(e) => setPreferences(prev => ({ ...prev, farmSize: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="small">Small (&lt; 2 acres)</option>
                    <option value="medium">Medium (2-10 acres)</option>
                    <option value="large">Large (&gt; 10 acres)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Market Focus</label>
                  <select 
                    value={preferences.marketFocus}
                    onChange={(e) => setPreferences(prev => ({ ...prev, marketFocus: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="local">Local Market</option>
                    <option value="export">Export</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Budget</label>
                  <select 
                    value={preferences.budget}
                    onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value as any }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Get Recommendations Button */}
            <div className="krishi-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="heading-3 mb-4">Get AI-Powered Crop Recommendations</h2>
              <p className="body-text text-muted-foreground mb-6">
                Our AI analyzes your location, weather conditions, and preferences to recommend the best crops for maximum yield and profit.
              </p>
              <button 
                onClick={handleGetRecommendations}
                disabled={isLoading || !coords}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  '🌿 Get AI Recommendations'
                )}
              </button>
              {!coords && (
                <p className="text-sm text-red-600 mt-2">Please select a location first</p>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="krishi-card">
              <h2 className="heading-3 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                AI Crop Recommendations
              </h2>
              <p className="caption mb-4">{recommendations.summary}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Best Season: {recommendations.bestSeason}</h4>
                <p className="text-blue-700 text-sm">{recommendations.generalAdvice}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="krishi-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl">{rec.cropName}</h3>
                      <p className="text-sm text-muted-foreground">{rec.scientificName} • {rec.family}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.suitabilityScore >= 80 ? 'bg-green-100 text-green-800' :
                          rec.suitabilityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rec.suitabilityScore}% Suitable
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary text-lg">{rec.marketValue}</div>
                      <div className="text-sm text-muted-foreground">Market Value</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Planting Time</h4>
                      <p className="text-sm text-muted-foreground">{rec.plantingTime}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Harvest Time</h4>
                      <p className="text-sm text-muted-foreground">{rec.harvestTime}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Yield Expectation</h4>
                      <p className="text-sm text-muted-foreground">{rec.yieldExpectation}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Why This Crop?</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {rec.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Water: {rec.waterRequirements}</span>
                      <span>Soil: {rec.soilRequirements}</span>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(rec)}
                      className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setRecommendations(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Get New Recommendations
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="krishi-card bg-red-50 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-800">Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Crop Details Modal */}
        {showDetails && selectedCrop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedCrop.cropName} Details</h2>
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: cropDetails.replace(/\n/g, '<br>') }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};