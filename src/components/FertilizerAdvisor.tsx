import React, { useState } from 'react';
import { Sprout, ChevronDown, Loader2, AlertCircle, Eye, DollarSign, Calendar, Droplets } from 'lucide-react';
import { FertilizerRecommendationService, FertilizerData, FertilizerResponse } from '@/services/fertilizerRecommendation';
import { useLocationContext } from '@/hooks/useLocation';

export const FertilizerAdvisor = () => {
  const { coords, label } = useLocationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<FertilizerResponse | null>(null);
  const [selectedFertilizer, setSelectedFertilizer] = useState<string>('');
  const [fertilizerDetails, setFertilizerDetails] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  
  const [formData, setFormData] = useState<FertilizerData>({
    cropName: '',
    growthStage: 'vegetative',
    soilPh: 6.5,
    soilType: 'loam',
    nutrients: {
      nitrogen: 50,
      phosphorus: 30,
      potassium: 40,
      organicMatter: 2.5
    },
    weatherConditions: {
      temperature: 28,
      humidity: 65,
      rainfall: 1200
    },
    farmSize: 'medium',
    budget: 'medium',
    preference: 'mixed'
  });

  const cropOptions = [
    'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Soybean', 'Groundnut',
    'Tomato', 'Onion', 'Potato', 'Chili', 'Brinjal', 'Okra', 'Cabbage',
    'Mango', 'Banana', 'Citrus', 'Grapes', 'Pomegranate', 'Papaya'
  ];

  const handleGetRecommendations = async () => {
    if (!formData.cropName) {
      setError('Please select a crop');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await FertilizerRecommendationService.getFertilizerRecommendations(formData);
      setRecommendations(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to get fertilizer recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (fertilizerName: string) => {
    setSelectedFertilizer(fertilizerName);
    setShowDetails(true);
    setIsLoading(true);

    try {
      const details = await FertilizerRecommendationService.getFertilizerDetails(fertilizerName, formData.cropName);
      setFertilizerDetails(details);
    } catch (err: unknown) {
      setFertilizerDetails('Details not available at the moment. Please try again later.');
    } finally {
      setIsLoading(false);
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
            <h2 className="heading-3">AI Fertilizer Advisor</h2>
            <p className="caption">Get personalized fertilizer recommendations based on your crop and soil conditions</p>
          </div>
        </div>

        {!recommendations ? (
          <div className="space-y-6">
            {/* Crop Selection */}
            <div>
              <label className="block font-medium mb-2">Select Crop</label>
              <div className="relative">
                <select 
                  value={formData.cropName} 
                  onChange={(e) => setFormData(prev => ({ ...prev, cropName: e.target.value }))}
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

            {/* Growth Stage */}
            <div>
              <label className="block font-medium mb-2">Growth Stage</label>
              <div className="relative">
                <select 
                  value={formData.growthStage} 
                  onChange={(e) => setFormData(prev => ({ ...prev, growthStage: e.target.value as any }))}
                  className="farm-select appearance-none pr-10"
                >
                  <option value="seedling">Seedling</option>
                  <option value="vegetative">Vegetative</option>
                  <option value="flowering">Flowering</option>
                  <option value="fruiting">Fruiting</option>
                  <option value="maturity">Maturity</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Soil Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Soil Type</label>
                <div className="relative">
                  <select 
                    value={formData.soilType} 
                    onChange={(e) => setFormData(prev => ({ ...prev, soilType: e.target.value as any }))}
                    className="farm-select appearance-none pr-10"
                  >
                    <option value="sandy">Sandy</option>
                    <option value="clay">Clay</option>
                    <option value="loam">Loam</option>
                    <option value="silt">Silt</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Soil pH</label>
                <input 
                  type="number" 
                  step="0.1"
                  min="4" 
                  max="9"
                  value={formData.soilPh} 
                  onChange={(e) => setFormData(prev => ({ ...prev, soilPh: parseFloat(e.target.value) }))}
                  className="farm-input"
                  placeholder="6.5"
                />
              </div>
            </div>

            {/* Nutrient Levels */}
            <div>
              <label className="block font-medium mb-2">Soil Nutrient Levels (ppm)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Nitrogen</label>
                  <input 
                    type="number" 
                    value={formData.nutrients.nitrogen} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      nutrients: { ...prev.nutrients, nitrogen: parseInt(e.target.value) }
                    }))}
                    className="farm-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phosphorus</label>
                  <input 
                    type="number" 
                    value={formData.nutrients.phosphorus} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      nutrients: { ...prev.nutrients, phosphorus: parseInt(e.target.value) }
                    }))}
                    className="farm-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Potassium</label>
                  <input 
                    type="number" 
                    value={formData.nutrients.potassium} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      nutrients: { ...prev.nutrients, potassium: parseInt(e.target.value) }
                    }))}
                    className="farm-input"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Organic Matter %</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.nutrients.organicMatter} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      nutrients: { ...prev.nutrients, organicMatter: parseFloat(e.target.value) }
                    }))}
                    className="farm-input"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-2">Farm Size</label>
                <div className="relative">
                  <select 
                    value={formData.farmSize} 
                    onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value as any }))}
                    className="farm-select appearance-none pr-10"
                  >
                    <option value="small">Small (&lt; 2 acres)</option>
                    <option value="medium">Medium (2-10 acres)</option>
                    <option value="large">Large (&gt; 10 acres)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Budget</label>
                <div className="relative">
                  <select 
                    value={formData.budget} 
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value as any }))}
                    className="farm-select appearance-none pr-10"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-2">Preference</label>
                <div className="relative">
                  <select 
                    value={formData.preference} 
                    onChange={(e) => setFormData(prev => ({ ...prev, preference: e.target.value as any }))}
                    className="farm-select appearance-none pr-10"
                  >
                    <option value="organic">Organic</option>
                    <option value="chemical">Chemical</option>
                    <option value="mixed">Mixed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <button 
              onClick={handleGetRecommendations}
              disabled={!formData.cropName || isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                '🌱 Get AI Fertilizer Recommendations'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">AI Analysis Summary</h3>
              <p className="text-blue-700 text-sm mb-2">{recommendations.soilAnalysis}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-blue-800">Cost Estimate</div>
                  <div className="text-blue-700">{recommendations.costEstimate}</div>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Expected Yield</div>
                  <div className="text-blue-700">{recommendations.expectedYield}</div>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Farm Size</div>
                  <div className="text-blue-700">{formData.farmSize}</div>
                </div>
                <div>
                  <div className="font-medium text-blue-800">Preference</div>
                  <div className="text-blue-700">{formData.preference}</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Recommended Fertilizers</h3>
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{rec.fertilizerName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rec.type === 'organic' ? 'bg-green-100 text-green-800' :
                          rec.type === 'chemical' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {rec.type}
                        </span>
                        <span className="text-sm text-muted-foreground">{rec.npkRatio}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{rec.cost}</div>
                      <div className="text-sm text-muted-foreground">Cost</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="font-medium text-sm">Application Rate</div>
                      <div className="text-sm text-muted-foreground">{rec.applicationRate}</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Timing</div>
                      <div className="text-sm text-muted-foreground">{rec.timing}</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Method</div>
                      <div className="text-sm text-muted-foreground">{rec.applicationMethod}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="font-medium text-sm mb-1">Benefits:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {rec.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Expected: {rec.expectedResults}
                    </div>
                    <button 
                      onClick={() => handleViewDetails(rec.fertilizerName)}
                      className="flex items-center gap-2 text-primary font-medium hover:text-primary-dark transition-colors"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Schedule */}
            {recommendations.schedule.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Application Schedule</h3>
                {recommendations.schedule.map((schedule, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{schedule.stage}</h4>
                      <span className="text-sm font-medium text-primary">{schedule.totalCost}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{schedule.applicationNotes}</p>
                    <div className="space-y-2">
                      {schedule.fertilizers.map((fert, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{fert.fertilizerName}</span>
                          <span className="text-muted-foreground">{fert.applicationRate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {recommendations.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Warnings</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {recommendations.warnings.map((warning, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-red-800">Error</h3>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Fertilizer Details Modal */}
        {showDetails && selectedFertilizer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedFertilizer} Details</h2>
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
                    <div dangerouslySetInnerHTML={{ __html: fertilizerDetails.replace(/\n/g, '<br>') }} />
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