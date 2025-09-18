import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserPreferences {
  preferredCrops: string[];
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  farmingExperience: 'beginner' | 'intermediate' | 'advanced';
  farmSize: 'small' | 'medium' | 'large';
  farmingType: 'organic' | 'conventional' | 'mixed';
  language: string;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  addPreferredCrop: (cropName: string) => void;
  removePreferredCrop: (cropName: string) => void;
  clearPreferredCrops: () => void;
  isCropPreferred: (cropName: string) => boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const STORAGE_KEY = 'userPreferences';

const defaultPreferences: UserPreferences = {
  preferredCrops: [],
  farmingExperience: 'beginner',
  farmSize: 'medium',
  farmingType: 'mixed',
  language: 'en'
};

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider = ({ children }: UserPreferencesProviderProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const addPreferredCrop = (cropName: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCrops: [...prev.preferredCrops.filter(crop => crop !== cropName), cropName]
    }));
  };

  const removePreferredCrop = (cropName: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCrops: prev.preferredCrops.filter(crop => crop !== cropName)
    }));
  };

  const clearPreferredCrops = () => {
    setPreferences(prev => ({
      ...prev,
      preferredCrops: []
    }));
  };

  const isCropPreferred = (cropName: string) => {
    return preferences.preferredCrops.includes(cropName);
  };

  const value: UserPreferencesContextType = {
    preferences,
    updatePreferences,
    addPreferredCrop,
    removePreferredCrop,
    clearPreferredCrops,
    isCropPreferred
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
