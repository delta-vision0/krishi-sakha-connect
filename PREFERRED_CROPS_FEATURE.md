# Preferred Crops Feature

This document describes the new preferred crops feature that has been added to the Krishi Sakha Connect application.

## Overview

The preferred crops feature allows users to select and manage their preferred crops from a comprehensive list of 200+ crops organized by categories. This information is used to personalize the user experience and provide more relevant recommendations.

## Features

### 1. Crop Data Management (`src/services/cropData.ts`)
- Comprehensive crop database with 200+ crops from the `india_recommended_crops.csv` file
- Crops organized by categories: Cereals, Pulses, Oilseeds, Cash Crops, Fruits, Vegetables, Spices & Herbs, Flowers, Nuts, Mushrooms, Fodder Crops, Root Crops, and Other Crops
- Search functionality to find crops by name or category
- Utility functions to get crops by category and search crops

### 2. User Preferences Context (`src/contexts/UserPreferencesContext.tsx`)
- React context for managing user preferences
- Persistent storage using localStorage
- Functions to add, remove, and manage preferred crops
- Additional user preferences: farming experience, farm size, farming type, and location

### 3. Crop Selection Component (`src/components/CropSelector.tsx`)
- Multi-select interface for choosing preferred crops
- Search functionality with real-time filtering
- Category-based organization with expandable sections
- "Select All" and "Clear All" functionality
- "Show selected only" toggle for easy management
- Responsive design with proper accessibility

### 4. User Preferences Component (`src/components/UserPreferences.tsx`)
- Main preferences interface accessible from the dashboard
- Displays selected crops with visual indicators
- Settings for farming experience, farm size, and farming type
- Modal interface for crop selection

### 5. Dashboard Integration
- Settings button in the dashboard header
- Modal overlay for preferences management
- Clean, intuitive user interface

### 6. Fertilizer Advisor Integration
- Preferred crops are prioritized in the crop selection dropdown
- All available crops are still accessible
- Improved user experience with personalized defaults

## Usage

1. **Accessing Preferences**: Click the settings icon in the dashboard header
2. **Selecting Crops**: Click "Manage Crops" to open the crop selector
3. **Searching Crops**: Use the search bar to find specific crops
4. **Browsing by Category**: Expand categories to see all crops in that group
5. **Managing Selection**: Use "Select All" or "Clear All" for bulk operations
6. **Viewing Selected**: Toggle "Show selected only" to see only chosen crops

## Technical Implementation

### Data Structure
```typescript
interface Crop {
  name: string;
  category: string;
}

interface UserPreferences {
  preferredCrops: string[];
  farmingExperience: 'beginner' | 'intermediate' | 'advanced';
  farmSize: 'small' | 'medium' | 'large';
  farmingType: 'organic' | 'conventional' | 'mixed';
  location?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  language: string;
}
```

### Key Components
- **CropSelector**: Multi-select component with search and category filtering
- **UserPreferences**: Main preferences management interface
- **UserPreferencesContext**: React context for state management
- **cropData service**: Data management and utility functions

### Storage
- User preferences are automatically saved to localStorage
- Data persists across browser sessions
- Graceful error handling for storage failures

## Future Enhancements

This feature provides a foundation for future enhancements:

1. **Personalized Recommendations**: Use preferred crops to customize crop recommendations
2. **Weather Alerts**: Send specific alerts for preferred crops
3. **Market Price Tracking**: Track prices for selected crops
4. **Fertilizer Recommendations**: Prioritize recommendations for preferred crops
5. **Disease Alerts**: Monitor disease risks for selected crops
6. **Seasonal Planning**: Provide planting calendars for preferred crops

## Localization

The feature includes full localization support with translation keys for:
- All UI text and labels
- Error messages and notifications
- Help text and descriptions

Translation keys are prefixed with `preferences.` for easy identification and management.
