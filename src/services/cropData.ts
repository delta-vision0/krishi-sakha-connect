export interface Crop {
  name: string;
  category: string;
}

export interface CropCategory {
  name: string;
  crops: Crop[];
}

// Load crop data from the CSV file
const loadCropData = (): Crop[] => {
  // This is a simplified version - in a real app, you'd load from the actual CSV file
  // For now, we'll include a representative sample of the crops from the CSV
  const cropData: Crop[] = [
    // Cereals
    { name: 'Rice', category: 'Cereals' },
    { name: 'Wheat', category: 'Cereals' },
    { name: 'Maize', category: 'Cereals' },
    { name: 'Barley', category: 'Cereals' },
    { name: 'Pearl Millet', category: 'Cereals' },
    { name: 'Sorghum', category: 'Cereals' },
    { name: 'Finger Millet', category: 'Cereals' },
    { name: 'Foxtail Millet', category: 'Cereals' },
    { name: 'Proso Millet', category: 'Cereals' },
    { name: 'Little Millet', category: 'Cereals' },
    { name: 'Kodo Millet', category: 'Cereals' },
    { name: 'Barnyard Millet', category: 'Cereals' },
    { name: 'Bajra', category: 'Cereals' },
    { name: 'Amaranth', category: 'Cereals' },
    { name: 'Buckwheat', category: 'Cereals' },
    { name: 'Oats', category: 'Cereals' },
    { name: 'Rye', category: 'Cereals' },
    { name: 'Triticale', category: 'Cereals' },
    
    // Pulses
    { name: 'Chickpea', category: 'Pulses' },
    { name: 'Pigeon Pea', category: 'Pulses' },
    { name: 'Green Gram', category: 'Pulses' },
    { name: 'Black Gram', category: 'Pulses' },
    { name: 'Lentil', category: 'Pulses' },
    { name: 'Horse Gram', category: 'Pulses' },
    { name: 'Field Pea', category: 'Pulses' },
    { name: 'Cowpea', category: 'Pulses' },
    { name: 'Broad Bean', category: 'Pulses' },
    { name: 'Moth Bean', category: 'Pulses' },
    { name: 'Soybean', category: 'Pulses' },
    { name: 'Cluster Bean', category: 'Pulses' },
    { name: 'Bambara Groundnut', category: 'Pulses' },
    { name: 'Pea', category: 'Pulses' },
    { name: 'Rajma', category: 'Pulses' },
    { name: 'Lupin', category: 'Pulses' },
    { name: 'Winged Bean', category: 'Pulses' },
    { name: 'Faba Bean', category: 'Pulses' },
    { name: 'Hyacinth Bean', category: 'Pulses' },
    
    // Oilseeds
    { name: 'Groundnut', category: 'Oilseeds' },
    { name: 'Sesame', category: 'Oilseeds' },
    { name: 'Mustard / Rapeseed', category: 'Oilseeds' },
    { name: 'Sunflower', category: 'Oilseeds' },
    { name: 'Safflower', category: 'Oilseeds' },
    { name: 'Castor', category: 'Oilseeds' },
    { name: 'Linseed', category: 'Oilseeds' },
    { name: 'Coconut', category: 'Oilseeds' },
    { name: 'Olive', category: 'Oilseeds' },
    
    // Cash Crops
    { name: 'Sugarcane', category: 'Cash Crops' },
    { name: 'Sweet Sorghum', category: 'Cash Crops' },
    { name: 'Sugar Beet', category: 'Cash Crops' },
    { name: 'Cotton', category: 'Cash Crops' },
    { name: 'Jute', category: 'Cash Crops' },
    { name: 'Kenaf', category: 'Cash Crops' },
    { name: 'Hemp', category: 'Cash Crops' },
    { name: 'Mesta', category: 'Cash Crops' },
    { name: 'Silk', category: 'Cash Crops' },
    { name: 'Mulberry', category: 'Cash Crops' },
    { name: 'Tea', category: 'Cash Crops' },
    { name: 'Coffee', category: 'Cash Crops' },
    { name: 'Rubber', category: 'Cash Crops' },
    { name: 'Arecanut', category: 'Cash Crops' },
    { name: 'Oil Palm', category: 'Cash Crops' },
    { name: 'Cashew', category: 'Cash Crops' },
    { name: 'Cocoa', category: 'Cash Crops' },
    
    // Fruits
    { name: 'Mango', category: 'Fruits' },
    { name: 'Banana', category: 'Fruits' },
    { name: 'Guava', category: 'Fruits' },
    { name: 'Pineapple', category: 'Fruits' },
    { name: 'Papaya', category: 'Fruits' },
    { name: 'Sapota', category: 'Fruits' },
    { name: 'Litchi', category: 'Fruits' },
    { name: 'Lychee', category: 'Fruits' },
    { name: 'Pomegranate', category: 'Fruits' },
    { name: 'Orange', category: 'Fruits' },
    { name: 'Sweet Lime', category: 'Fruits' },
    { name: 'Lemon', category: 'Fruits' },
    { name: 'Grapes', category: 'Fruits' },
    { name: 'Apple', category: 'Fruits' },
    { name: 'Pear', category: 'Fruits' },
    { name: 'Apricot', category: 'Fruits' },
    { name: 'Plum', category: 'Fruits' },
    { name: 'Strawberry', category: 'Fruits' },
    { name: 'Blackberry', category: 'Fruits' },
    { name: 'Blueberry', category: 'Fruits' },
    { name: 'Custard Apple', category: 'Fruits' },
    { name: 'Ber', category: 'Fruits' },
    { name: 'Jamun', category: 'Fruits' },
    { name: 'Kinnow', category: 'Fruits' },
    { name: 'Mandarin', category: 'Fruits' },
    { name: 'Tangerine', category: 'Fruits' },
    { name: 'Watermelon', category: 'Fruits' },
    { name: 'Muskmelon', category: 'Fruits' },
    { name: 'Cantaloupe', category: 'Fruits' },
    { name: 'Honeydew', category: 'Fruits' },
    { name: 'Jackfruit', category: 'Fruits' },
    { name: 'Breadfruit', category: 'Fruits' },
    { name: 'Sapodilla', category: 'Fruits' },
    { name: 'Rambutan', category: 'Fruits' },
    { name: 'Durian', category: 'Fruits' },
    { name: 'Carambola', category: 'Fruits' },
    { name: 'Longan', category: 'Fruits' },
    { name: 'Mangosteen', category: 'Fruits' },
    
    // Vegetables
    { name: 'Potato', category: 'Vegetables' },
    { name: 'Tomato', category: 'Vegetables' },
    { name: 'Onion', category: 'Vegetables' },
    { name: 'Garlic', category: 'Vegetables' },
    { name: 'Chilli', category: 'Vegetables' },
    { name: 'Brinjal', category: 'Vegetables' },
    { name: 'Okra', category: 'Vegetables' },
    { name: 'Cabbage', category: 'Vegetables' },
    { name: 'Cauliflower', category: 'Vegetables' },
    { name: 'Broccoli', category: 'Vegetables' },
    { name: 'Spinach', category: 'Vegetables' },
    { name: 'Methi', category: 'Vegetables' },
    { name: 'Celery', category: 'Vegetables' },
    { name: 'Carrot', category: 'Vegetables' },
    { name: 'Beetroot', category: 'Vegetables' },
    { name: 'Radish', category: 'Vegetables' },
    { name: 'Turnip', category: 'Vegetables' },
    { name: 'Bottle Gourd', category: 'Vegetables' },
    { name: 'Bitter Gourd', category: 'Vegetables' },
    { name: 'Ridge Gourd', category: 'Vegetables' },
    { name: 'Snake Gourd', category: 'Vegetables' },
    { name: 'Pointed Gourd', category: 'Vegetables' },
    { name: 'Sweet Potato', category: 'Vegetables' },
    { name: 'Colocasia', category: 'Vegetables' },
    { name: 'Arbi', category: 'Vegetables' },
    { name: 'Peas', category: 'Vegetables' },
    { name: 'Cluster Beans', category: 'Vegetables' },
    { name: 'Zucchini', category: 'Vegetables' },
    { name: 'Cucumber', category: 'Vegetables' },
    { name: 'Field Beans', category: 'Vegetables' },
    { name: 'Bell Pepper', category: 'Vegetables' },
    { name: 'Lettuce', category: 'Vegetables' },
    { name: 'Microgreens', category: 'Vegetables' },
    { name: 'Purslane', category: 'Vegetables' },
    { name: 'Kale', category: 'Vegetables' },
    { name: 'Collard Greens', category: 'Vegetables' },
    { name: 'Pak Choi', category: 'Vegetables' },
    { name: 'Arugula', category: 'Vegetables' },
    { name: 'Endive', category: 'Vegetables' },
    { name: 'Fiddlehead', category: 'Vegetables' },
    { name: 'Kangkong', category: 'Vegetables' },
    { name: 'Chayote', category: 'Vegetables' },
    { name: 'Perennial Vegetables', category: 'Vegetables' },
    { name: 'Ramps', category: 'Vegetables' },
    
    // Spices & Herbs
    { name: 'Turmeric', category: 'Spices & Herbs' },
    { name: 'Ginger', category: 'Spices & Herbs' },
    { name: 'Black Pepper', category: 'Spices & Herbs' },
    { name: 'Cardamom', category: 'Spices & Herbs' },
    { name: 'Cinnamon', category: 'Spices & Herbs' },
    { name: 'Clove', category: 'Spices & Herbs' },
    { name: 'Nutmeg', category: 'Spices & Herbs' },
    { name: 'Mace', category: 'Spices & Herbs' },
    { name: 'Coriander', category: 'Spices & Herbs' },
    { name: 'Cumin', category: 'Spices & Herbs' },
    { name: 'Fennel', category: 'Spices & Herbs' },
    { name: 'Fenugreek', category: 'Spices & Herbs' },
    { name: 'Ajwain', category: 'Spices & Herbs' },
    { name: 'Bay Leaf', category: 'Spices & Herbs' },
    { name: 'Saffron', category: 'Spices & Herbs' },
    { name: 'Star Anise', category: 'Spices & Herbs' },
    { name: 'Mustard', category: 'Spices & Herbs' },
    { name: 'Tamarind', category: 'Spices & Herbs' },
    { name: 'Ashwagandha', category: 'Spices & Herbs' },
    { name: 'Aloe Vera', category: 'Spices & Herbs' },
    { name: 'Tulsi', category: 'Spices & Herbs' },
    { name: 'Brahmi', category: 'Spices & Herbs' },
    { name: 'Shatavari', category: 'Spices & Herbs' },
    { name: 'Giloy', category: 'Spices & Herbs' },
    { name: 'Neem', category: 'Spices & Herbs' },
    { name: 'Artemisia', category: 'Spices & Herbs' },
    { name: 'Bhringraj', category: 'Spices & Herbs' },
    { name: 'Stevia', category: 'Spices & Herbs' },
    { name: 'Mint', category: 'Spices & Herbs' },
    { name: 'Lemongrass', category: 'Spices & Herbs' },
    { name: 'Sweet Flag', category: 'Spices & Herbs' },
    { name: 'Kalmegh', category: 'Spices & Herbs' },
    { name: 'Licorice', category: 'Spices & Herbs' },
    { name: 'Chamomile', category: 'Spices & Herbs' },
    { name: 'Curry Leaf', category: 'Spices & Herbs' },
    
    // Flowers
    { name: 'Rose', category: 'Flowers' },
    { name: 'Marigold', category: 'Flowers' },
    { name: 'Jasmine', category: 'Flowers' },
    { name: 'Tuberose', category: 'Flowers' },
    { name: 'Gladiolus', category: 'Flowers' },
    { name: 'Chrysanthemum', category: 'Flowers' },
    { name: 'Gerbera', category: 'Flowers' },
    { name: 'Carnation', category: 'Flowers' },
    { name: 'Lily', category: 'Flowers' },
    { name: 'Orchid', category: 'Flowers' },
    { name: 'Hibiscus', category: 'Flowers' },
    
    // Nuts
    { name: 'Areca Nut', category: 'Nuts' },
    { name: 'Almond', category: 'Nuts' },
    { name: 'Walnut', category: 'Nuts' },
    { name: 'Pistachio', category: 'Nuts' },
    { name: 'Chestnut', category: 'Nuts' },
    
    // Mushrooms
    { name: 'Button Mushroom', category: 'Mushrooms' },
    { name: 'Oyster Mushroom', category: 'Mushrooms' },
    { name: 'Paddy Straw Mushroom', category: 'Mushrooms' },
    { name: 'Shiitake', category: 'Mushrooms' },
    { name: 'Milky Mushroom', category: 'Mushrooms' },
    
    // Fodder Crops
    { name: 'Berseem', category: 'Fodder Crops' },
    { name: 'Lucerne', category: 'Fodder Crops' },
    { name: 'Napier Grass', category: 'Fodder Crops' },
    { name: 'Hybrid Napier', category: 'Fodder Crops' },
    { name: 'Grass pea', category: 'Fodder Crops' },
    { name: 'Sesbania', category: 'Fodder Crops' },
    { name: 'Sunhemp', category: 'Fodder Crops' },
    
    // Root Crops
    { name: 'Cassava', category: 'Root Crops' },
    { name: 'Yam', category: 'Root Crops' },
    { name: 'Elephant Foot Yam', category: 'Root Crops' },
    { name: 'Arum', category: 'Root Crops' },
    
    // Other Crops
    { name: 'Herbal Tea Crops', category: 'Other Crops' },
    { name: 'Cane Sugar', category: 'Other Crops' },
    { name: 'Niger', category: 'Other Crops' },
    { name: 'Perilla', category: 'Other Crops' },
    { name: 'Ricebean', category: 'Other Crops' },
    { name: 'Mungbean', category: 'Other Crops' },
    { name: 'Black soybean', category: 'Other Crops' },
    { name: 'Perennial legumes', category: 'Other Crops' },
    { name: 'Herb Farming', category: 'Other Crops' },
    { name: 'Hydroponic Vegetables', category: 'Other Crops' },
    { name: 'Poppy', category: 'Other Crops' },
    { name: 'Tobacco', category: 'Other Crops' },
    { name: 'Betel Vine', category: 'Other Crops' },
    { name: 'Vanilla', category: 'Other Crops' },
    { name: 'Pepper', category: 'Other Crops' },
    { name: 'Industrial Crops', category: 'Other Crops' },
    { name: 'Khesari', category: 'Other Crops' },
    { name: 'Toria', category: 'Other Crops' },
    { name: 'Sesamum', category: 'Other Crops' },
    { name: 'Korral', category: 'Other Crops' },
    { name: 'Pan', category: 'Other Crops' },
    { name: 'Kokum', category: 'Other Crops' },
    { name: 'Phalsa', category: 'Other Crops' },
    { name: 'Wood apple', category: 'Other Crops' },
    { name: 'Bael', category: 'Other Crops' },
    { name: 'Indian Gooseberry', category: 'Other Crops' },
    { name: 'Bel', category: 'Other Crops' },
    { name: 'Neemat', category: 'Other Crops' },
    { name: 'Indian Mustard', category: 'Other Crops' },
    { name: 'Silk Cotton', category: 'Other Crops' },
    { name: 'Grain Sorghum', category: 'Other Crops' },
    { name: 'Ragi', category: 'Other Crops' },
    { name: 'Kodo', category: 'Other Crops' },
    { name: 'Korale Millet', category: 'Other Crops' },
    { name: 'Field Corn', category: 'Other Crops' },
    { name: 'Sweet Corn', category: 'Other Crops' },
    { name: 'Dryland Rice Varieties', category: 'Other Crops' },
    { name: 'Irrigated Rice Varieties', category: 'Other Crops' },
    { name: 'Hybrid Rice', category: 'Other Crops' },
    { name: 'Basmati Rice', category: 'Other Crops' },
    { name: 'Non-Basmati Rice', category: 'Other Crops' },
    { name: 'Heat-resistant Tomato Varieties', category: 'Other Crops' },
    { name: 'Cold-tolerant Potato Varieties', category: 'Other Crops' },
    { name: 'High-yield Wheat Varieties', category: 'Other Crops' },
    { name: 'Organic Vegetables', category: 'Other Crops' },
    { name: 'Intercrops', category: 'Other Crops' },
    { name: 'Cover Crops', category: 'Other Crops' },
  ];

  return cropData;
};

// Get all crops
export const getAllCrops = (): Crop[] => {
  return loadCropData();
};

// Get crops grouped by category
export const getCropsByCategory = (): CropCategory[] => {
  try {
    const crops = loadCropData();
    const categoryMap = new Map<string, Crop[]>();
    
    crops.forEach(crop => {
      if (crop && crop.name && crop.category) {
        if (!categoryMap.has(crop.category)) {
          categoryMap.set(crop.category, []);
        }
        categoryMap.get(crop.category)!.push(crop);
      }
    });
    
    return Array.from(categoryMap.entries()).map(([name, crops]) => ({
      name,
      crops: crops.sort((a, b) => a.name.localeCompare(b.name))
    })).sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error in getCropsByCategory:', error);
    return [];
  }
};

// Search crops by name
export const searchCrops = (query: string): Crop[] => {
  try {
    const crops = loadCropData();
    const lowercaseQuery = query.toLowerCase();
    
    return crops.filter(crop => 
      crop && crop.name && crop.category &&
      (crop.name.toLowerCase().includes(lowercaseQuery) ||
       crop.category.toLowerCase().includes(lowercaseQuery))
    );
  } catch (error) {
    console.error('Error in searchCrops:', error);
    return [];
  }
};

// Get crop names only
export const getCropNames = (): string[] => {
  try {
    return loadCropData().filter(crop => crop && crop.name).map(crop => crop.name);
  } catch (error) {
    console.error('Error in getCropNames:', error);
    return [];
  }
};
