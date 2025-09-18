import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { CropSelector } from './CropSelector';
import { Settings, Crop, X, User, MapPin, Sprout } from 'lucide-react';

interface UserPreferencesProps {
  onClose?: () => void;
}

type TabType = 'crops' | 'profile' | 'location';

export const UserPreferences: React.FC<UserPreferencesProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  const [activeTab, setActiveTab] = useState<TabType>('crops');
  const [showCropSelector, setShowCropSelector] = useState(false);

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    updatePreferences({ [key]: value });
  };

  const tabs = [
    {
      id: 'crops' as TabType,
      label: t('preferences.tabs.crops') || 'My Crops',
      icon: Crop,
      description: t('preferences.tabs.cropsDesc') || 'Select your preferred crops'
    },
    {
      id: 'profile' as TabType,
      label: t('preferences.tabs.profile') || 'Profile',
      icon: User,
      description: t('preferences.tabs.profileDesc') || 'Your farming profile'
    },
    {
      id: 'location' as TabType,
      label: t('preferences.tabs.location') || 'Location',
      icon: MapPin,
      description: t('preferences.tabs.locationDesc') || 'Your farm location'
    }
  ];

  return (
    <>
      <div className="bg-background rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {t('preferences.title') || 'User Preferences'}
            </h2>
            <p className="text-muted-foreground">
              {t('preferences.subtitle') || 'Customize your farming experience'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center gap-3 p-4 text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary/5 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <Icon size={20} />
              <div>
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Crops Tab */}
        {activeTab === 'crops' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crop className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('preferences.preferredCrops') || 'Your Preferred Crops'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('preferences.preferredCropsDesc') || 'Select the crops you grow or are interested in. This helps us provide better recommendations for you.'}
              </p>
            </div>

            {/* Selected Crops Display */}
            <div className="bg-muted/30 rounded-lg p-6">
              {preferences.preferredCrops.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">
                        {preferences.preferredCrops.length} {t('preferences.cropsSelected') || 'crops selected'}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowCropSelector(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      {t('preferences.manageCrops') || 'Manage Crops'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preferences.preferredCrops.slice(0, 12).map((crop) => (
                      <span
                        key={crop}
                        className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {crop}
                      </span>
                    ))}
                    {preferences.preferredCrops.length > 12 && (
                      <span className="px-3 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                        +{preferences.preferredCrops.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crop className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">
                    {t('preferences.noCropsSelected') || 'No crops selected yet'}
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    {t('preferences.clickManageCrops') || 'Start by selecting your preferred crops'}
                  </p>
                  <button
                    onClick={() => setShowCropSelector(true)}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    {t('preferences.selectCrops') || 'Select Crops'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('preferences.farmingProfile') || 'Your Farming Profile'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('preferences.farmingProfileDesc') || 'Tell us about your farming experience to get personalized recommendations.'}
              </p>
            </div>

            {/* Farming Experience */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t('preferences.farmingExperience') || 'Farming Experience'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => handlePreferenceChange('farmingExperience', level)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      preferences.farmingExperience === level
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium mb-1">
                      {t(`preferences.experience.${level}`) || level.charAt(0).toUpperCase() + level.slice(1)}
                    </div>
                    <div className="text-xs opacity-75">
                      {t(`preferences.experience.${level}Desc`) || 
                        level === 'beginner' ? 'New to farming' :
                        level === 'intermediate' ? 'Some farming experience' :
                        'Experienced farmer'
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Size */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t('preferences.farmSize') || 'Farm Size'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePreferenceChange('farmSize', size)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      preferences.farmSize === size
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium mb-1">
                      {t(`preferences.size.${size}`) || size.charAt(0).toUpperCase() + size.slice(1)}
                    </div>
                    <div className="text-xs opacity-75">
                      {t(`preferences.size.${size}Desc`) || 
                        size === 'small' ? 'Less than 2 acres' :
                        size === 'medium' ? '2-10 acres' :
                        'More than 10 acres'
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Farming Type */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">
                {t('preferences.farmingType') || 'Farming Type'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['organic', 'conventional', 'mixed'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handlePreferenceChange('farmingType', type)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      preferences.farmingType === type
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <div className="font-medium mb-1">
                      {t(`preferences.type.${type}`) || type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                    <div className="text-xs opacity-75">
                      {t(`preferences.type.${type}Desc`) || 
                        type === 'organic' ? 'Natural farming methods' :
                        type === 'conventional' ? 'Traditional farming with chemicals' :
                        'Mix of both methods'
                      }
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Location Tab */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('preferences.farmLocation') || 'Your Farm Location'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('preferences.farmLocationDesc') || 'Set your farm location to get location-specific recommendations and weather alerts.'}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium text-foreground mb-2">
                {t('preferences.locationNotSet') || 'Location not set'}
              </h4>
              <p className="text-muted-foreground mb-4">
                {t('preferences.locationNotSetDesc') || 'Your location is automatically detected from the weather widget. You can change it there.'}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {t('preferences.goToWeather') || 'Go to Weather Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Crop Selector Modal */}
      {showCropSelector && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-5xl max-h-[90vh] bg-background rounded-lg shadow-2xl">
            <CropSelector onClose={() => setShowCropSelector(false)} />
          </div>
        </div>
      )}
    </div>
    </>
  );
};
