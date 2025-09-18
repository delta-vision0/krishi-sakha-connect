import React, { useState, useMemo } from 'react';
import { Search, X, Check, ChevronDown, ChevronUp, Crop } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { getCropsByCategory, searchCrops } from '@/services/cropData';
import { useLanguage } from '@/contexts/LanguageContext';

interface CropSelectorProps {
  onClose?: () => void;
  className?: string;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ onClose, className = '' }) => {
  const { t } = useLanguage();
  const { 
    preferences, 
    addPreferredCrop, 
    removePreferredCrop, 
    isCropPreferred,
    clearPreferredCrops 
  } = useUserPreferences();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const cropsByCategory = useMemo(() => {
    try {
      return getCropsByCategory();
    } catch (error) {
      console.error('Error loading crops by category:', error);
      return [];
    }
  }, []);
  
  const filteredCrops = useMemo(() => {
    if (searchQuery.trim()) {
      return searchCrops(searchQuery);
    }
    return [];
  }, [searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const handleCropToggle = (cropName: string) => {
    if (isCropPreferred(cropName)) {
      removePreferredCrop(cropName);
    } else {
      addPreferredCrop(cropName);
    }
  };

  const handleSelectAll = () => {
    const allCrops = cropsByCategory.flatMap(category => category.crops);
    allCrops.forEach(crop => {
      if (!isCropPreferred(crop.name)) {
        addPreferredCrop(crop.name);
      }
    });
  };

  const handleClearAll = () => {
    clearPreferredCrops();
  };

  const selectedCropsCount = preferences.preferredCrops.length;

  return (
    <div className={`bg-background rounded-lg shadow-lg max-h-[85vh] overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Crop className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {t('preferences.selectCrops') || 'Select Your Crops'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('preferences.selectCropsDesc') || 'Choose the crops you grow or are interested in'}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder={t('preferences.searchCrops') || 'Search crops...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t('preferences.selectAll') || 'Select All'}
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              {t('preferences.clearAll') || 'Clear All'}
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showSelectedOnly}
                onChange={(e) => setShowSelectedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary"
              />
              {t('preferences.showSelectedOnly') || 'Show selected only'}
            </label>
            
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {selectedCropsCount} {t('preferences.cropsSelected') || 'selected'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() ? (
          // Search results
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">
                {t('preferences.searchResults') || 'Search Results'}
              </h4>
              <span className="text-sm text-muted-foreground">
                ({filteredCrops.length} found)
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredCrops.map((crop) => (
                <div
                  key={crop.name}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    isCropPreferred(crop.name)
                      ? 'bg-primary/10 border-primary text-primary shadow-sm'
                      : 'bg-muted/30 border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleCropToggle(crop.name)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-base">{crop.name}</div>
                    <div className="text-sm text-muted-foreground">{crop.category}</div>
                  </div>
                  {isCropPreferred(crop.name) && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="text-primary-foreground" size={16} />
                    </div>
                  )}
                </div>
              ))}
              {filteredCrops.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h4 className="font-medium text-foreground mb-2">
                    {t('preferences.noResults') || 'No crops found'}
                  </h4>
                  <p className="text-muted-foreground">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Categories view
          <div className="p-6">
            {cropsByCategory.length === 0 ? (
              <div className="text-center py-12">
                <Crop className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h4 className="font-medium text-foreground mb-2">
                  {t('preferences.noCropsAvailable') || 'No crops available'}
                </h4>
                <p className="text-muted-foreground">
                  {t('preferences.tryRefreshing') || 'Try refreshing the page'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cropsByCategory.map((category) => {
                const categoryCrops = showSelectedOnly 
                  ? category.crops.filter(crop => isCropPreferred(crop.name))
                  : category.crops;
                
                if (showSelectedOnly && categoryCrops.length === 0) return null;
                
                const isExpanded = expandedCategories.has(category.name);
                const selectedInCategory = category.crops.filter(crop => isCropPreferred(crop.name)).length;
                
                return (
                  <div key={category.name} className="bg-muted/30 rounded-lg border border-border">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Crop className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-foreground">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {categoryCrops.length} crops
                            {selectedInCategory > 0 && (
                              <span className="ml-2 text-primary font-medium">
                                • {selectedInCategory} selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2">
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                          {categoryCrops.map((crop) => (
                            <div
                              key={crop.name}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                                isCropPreferred(crop.name)
                                  ? 'bg-primary/10 text-primary border border-primary/20'
                                  : 'bg-background hover:bg-muted/50 border border-transparent'
                              }`}
                              onClick={() => handleCropToggle(crop.name)}
                            >
                              <span className="font-medium text-sm">{crop.name}</span>
                              {isCropPreferred(crop.name) && (
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                  <Check className="text-primary-foreground" size={12} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
