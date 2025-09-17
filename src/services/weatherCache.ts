export type CachedForecast = {
  key: string; // lat,lon rounded
  locationLabel?: string | null;
  current: {
    tempCelsius: number;
    humidityPercent: number;
    windSpeedKmh: number;
    description: string;
    icon: string | null;
    city: string;
    country: string | null;
    timestamp: number;
  } | null;
  forecast: Array<{
    date: string;
    min: number;
    max: number;
    icon: string | null;
    description: string;
    rainLikely: boolean;
  }> | null;
  savedAt: number; // epoch ms
};

const STORAGE_KEY = 'ks-weather-cache-v1';

type CacheIndex = Record<string, CachedForecast>; // key -> entry

const readIndex = (): CacheIndex => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CacheIndex;
  } catch {
    return {};
  }
};

const writeIndex = (index: CacheIndex) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(index));
  } catch {
    // ignore quota errors
  }
};

export const buildKey = (lat: number, lon: number) => `${lat.toFixed(3)},${lon.toFixed(3)}`;

export const saveForecast = (entry: CachedForecast) => {
  const index = readIndex();
  index[entry.key] = { ...entry, savedAt: Date.now() };
  writeIndex(index);
};

export const loadForecast = (key: string): CachedForecast | null => {
  const index = readIndex();
  return index[key] ?? null;
};

export const isStale = (entry: CachedForecast | null, maxAgeMs: number): boolean => {
  if (!entry) return true;
  return Date.now() - entry.savedAt > maxAgeMs;
};


