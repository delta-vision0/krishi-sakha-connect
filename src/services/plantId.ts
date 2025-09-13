const PLANT_ID_API_KEY = (import.meta as { env?: { VITE_PLANT_ID_API_KEY?: string } })?.env?.VITE_PLANT_ID_API_KEY || 'kEpvJxvzqp4S4LOBeg9jz09bd1aeCPKguUy6QigUAy1VhMFnki';
const PLANT_ID_BASE_URL = 'https://api.plant.id/v3';

export interface PlantIdIdentification {
  id: number;
  plant_name: string;
  plant_details: {
    common_names: string[];
    scientific_name: string;
    other_name: string[];
    family: string;
    origin: string[];
    type: string;
    dimension: string;
    dimensions: {
      type: string;
      min: number;
      max: number;
      unit: string;
    };
    attracts: string[];
    propagated_by: string[];
    hardiness: {
      min: number;
      max: number;
    };
    flowers: boolean;
    flowering_season: string;
    flower_color: string[];
    cones: boolean;
    fruits: boolean;
    edible_fruit: boolean;
    edible_fruit_taste_profile: string;
    edible_fruit_nutritional_value: string;
    cuisine: boolean;
    medicinal: boolean;
    poisonous_to_humans: number;
    poisonous_to_pets: number;
    description: string;
    default_image: {
      license: number;
      license_name: string;
      license_url: string;
      original_url: string;
      regular_url: string;
      medium_url: string;
      small_url: string;
      thumbnail: string;
    };
  };
  probability: number;
  confirmed: boolean;
  similar_images: Array<{
    id: string;
    url: string;
    license_name: string;
    license_url: string;
    citation: string;
    similar_images: Array<{
      id: string;
      url: string;
      similarity: number;
    }>;
  }>;
}

export interface PlantIdHealthAssessment {
  id: number;
  plant_name: string;
  plant_details: {
    common_names: string[];
    scientific_name: string;
    other_name: string[];
    family: string;
    origin: string[];
    type: string;
    dimension: string;
    dimensions: {
      type: string;
      min: number;
      max: number;
      unit: string;
    };
    attracts: string[];
    propagated_by: string[];
    hardiness: {
      min: number;
      max: number;
    };
    flowers: boolean;
    flowering_season: string;
    flower_color: string[];
    cones: boolean;
    fruits: boolean;
    edible_fruit: boolean;
    edible_fruit_taste_profile: string;
    edible_fruit_nutritional_value: string;
    cuisine: boolean;
    medicinal: boolean;
    poisonous_to_humans: number;
    poisonous_to_pets: number;
    description: string;
    default_image: {
      license: number;
      license_name: string;
      license_url: string;
      original_url: string;
      regular_url: string;
      medium_url: string;
      small_url: string;
      thumbnail: string;
    };
  };
  probability: number;
  confirmed: boolean;
  is_plant: {
    probability: number;
    threshold: number;
    binary: boolean;
  };
  is_healthy: {
    probability: number;
    threshold: number;
    binary: boolean;
  };
  disease: {
    suggestions: Array<{
      id: number;
      plant_name: string;
      plant_details: {
        common_names: string[];
        scientific_name: string;
        other_name: string[];
        family: string;
        origin: string[];
        type: string;
        dimension: string;
        dimensions: {
          type: string;
          min: number;
          max: number;
          unit: string;
        };
        attracts: string[];
        propagated_by: string[];
        hardiness: {
          min: number;
          max: number;
        };
        flowers: boolean;
        flowering_season: string;
        flower_color: string[];
        cones: boolean;
        fruits: boolean;
        edible_fruit: boolean;
        edible_fruit_taste_profile: string;
        edible_fruit_nutritional_value: string;
        cuisine: boolean;
        medicinal: boolean;
        poisonous_to_humans: number;
        poisonous_to_pets: number;
        description: string;
        default_image: {
          license: number;
          license_name: string;
          license_url: string;
          original_url: string;
          regular_url: string;
          medium_url: string;
          small_url: string;
          thumbnail: string;
        };
      };
      probability: number;
      confirmed: boolean;
      similar_images: Array<{
        id: string;
        url: string;
        license_name: string;
        license_url: string;
        citation: string;
        similar_images: Array<{
          id: string;
          url: string;
          similarity: number;
        }>;
      }>;
    }>;
  };
  similar_images: Array<{
    id: string;
    url: string;
    license_name: string;
    license_url: string;
    citation: string;
    similar_images: Array<{
      id: string;
      url: string;
      similarity: number;
    }>;
  }>;
}

export interface PlantIdResponse {
  id: number;
  custom_id: string | null;
  plant_id: number | null;
  plant_name: string | null;
  plant_details: unknown;
  plant_net_id: number | null;
  plant_net_name: string | null;
  plant_net_details: unknown;
  is_plant: {
    probability: number;
    threshold: number;
    binary: boolean;
  };
  is_healthy: {
    probability: number;
    threshold: number;
    binary: boolean;
  };
  disease: {
    suggestions: PlantIdHealthAssessment['disease']['suggestions'];
  };
  similar_images: Array<{
    id: string;
    url: string;
    license_name: string;
    license_url: string;
    citation: string;
    similar_images: Array<{
      id: string;
      url: string;
      similarity: number;
    }>;
  }>;
  meta_data: {
    latitude: number | null;
    longitude: number | null;
    date: string;
    datetime: string;
  };
  uploaded_datetime: number;
  finished_datetime: number;
  images: Array<{
    file_name: string;
    url: string;
  }>;
  suggestions: PlantIdIdentification[];
  modifiers: string[];
  secret: string;
  fail_cause: string | null;
  countable: boolean;
  feedback: string | null;
  is_plant_probability: number;
  is_healthy_probability: number;
}

export class PlantIdService {
  private static async makeRequest(endpoint: string, data: any) {
    const response = await fetch(`${PLANT_ID_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANT_ID_API_KEY,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Plant.id API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async identifyPlant(imageBase64: string, modifiers: string[] = []): Promise<PlantIdResponse> {
    return this.makeRequest('/identification', {
      images: [imageBase64],
      modifiers,
      plant_details: [
        'common_names',
        'url',
        'name_authority',
        'wiki_description',
        'taxonomy',
        'synonyms',
        'image',
        'edible_parts',
        'watering',
        'propagation_methods',
        'treatment',
        'diseases',
        'pests',
        'harvesting',
        'season',
        'planting',
        'other_names',
        'family',
        'origin',
        'dimensions',
        'attracts',
        'propagated_by',
        'hardiness',
        'flowers',
        'flowering_season',
        'flower_color',
        'cones',
        'fruits',
        'edible_fruit',
        'edible_fruit_taste_profile',
        'edible_fruit_nutritional_value',
        'cuisine',
        'medicinal',
        'poisonous_to_humans',
        'poisonous_to_pets',
        'description',
        'default_image'
      ],
      plant_net_id: true,
      plant_net_name: true,
      plant_net_details: [
        'common_names',
        'url',
        'name_authority',
        'wiki_description',
        'taxonomy',
        'synonyms',
        'image',
        'edible_parts',
        'watering',
        'propagation_methods',
        'treatment',
        'diseases',
        'pests',
        'harvesting',
        'season',
        'planting',
        'other_names',
        'family',
        'origin',
        'dimensions',
        'attracts',
        'propagated_by',
        'hardiness',
        'flowers',
        'flowering_season',
        'flower_color',
        'cones',
        'fruits',
        'edible_fruit',
        'edible_fruit_taste_profile',
        'edible_fruit_nutritional_value',
        'cuisine',
        'medicinal',
        'poisonous_to_humans',
        'poisonous_to_pets',
        'description',
        'default_image'
      ]
    });
  }

  static async assessHealth(imageBase64: string, modifiers: string[] = []): Promise<PlantIdResponse> {
    return this.makeRequest('/health_assessment', {
      images: [imageBase64],
      modifiers,
      plant_details: [
        'common_names',
        'url',
        'name_authority',
        'wiki_description',
        'taxonomy',
        'synonyms',
        'image',
        'edible_parts',
        'watering',
        'propagation_methods',
        'treatment',
        'diseases',
        'pests',
        'harvesting',
        'season',
        'planting',
        'other_names',
        'family',
        'origin',
        'dimensions',
        'attracts',
        'propagated_by',
        'hardiness',
        'flowers',
        'flowering_season',
        'flower_color',
        'cones',
        'fruits',
        'edible_fruit',
        'edible_fruit_taste_profile',
        'edible_fruit_nutritional_value',
        'cuisine',
        'medicinal',
        'poisonous_to_humans',
        'poisonous_to_pets',
        'description',
        'default_image'
      ],
      plant_net_id: true,
      plant_net_name: true,
      plant_net_details: [
        'common_names',
        'url',
        'name_authority',
        'wiki_description',
        'taxonomy',
        'synonyms',
        'image',
        'edible_parts',
        'watering',
        'propagation_methods',
        'treatment',
        'diseases',
        'pests',
        'harvesting',
        'season',
        'planting',
        'other_names',
        'family',
        'origin',
        'dimensions',
        'attracts',
        'propagated_by',
        'hardiness',
        'flowers',
        'flowering_season',
        'flower_color',
        'cones',
        'fruits',
        'edible_fruit',
        'edible_fruit_taste_profile',
        'edible_fruit_nutritional_value',
        'cuisine',
        'medicinal',
        'poisonous_to_humans',
        'poisonous_to_pets',
        'description',
        'default_image'
      ]
    });
  }

  static async getIdentificationResult(id: number): Promise<PlantIdResponse> {
    const response = await fetch(`${PLANT_ID_BASE_URL}/identification/${id}`, {
      headers: {
        'Api-Key': PLANT_ID_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Plant.id API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  static async getHealthAssessmentResult(id: number): Promise<PlantIdResponse> {
    const response = await fetch(`${PLANT_ID_BASE_URL}/health_assessment/${id}`, {
      headers: {
        'Api-Key': PLANT_ID_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Plant.id API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Helper function to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error: ProgressEvent<FileReader>) => reject(error);
  });
};
