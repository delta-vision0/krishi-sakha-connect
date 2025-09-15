import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface Coordinates {
	latitude: number;
	longitude: number;
}

interface LocationState {
	label: string;
	coords: Coordinates | null;
	isResolving: boolean;
	error: string | null;
	useGPS: () => void;
	setCityByName: (city: string) => Promise<void>;
	setCoordsManually: (coords: Coordinates, label?: string) => void;
	suggestCities: (q: string) => Promise<Array<{ name: string; state?: string; country?: string; lat: number; lon: number }>>;
	selectPlace: (p: { name: string; state?: string; country?: string; lat: number; lon: number }) => void;
}

const OPENWEATHER_API_KEY = (import.meta as { env?: { VITE_OPENWEATHER_API_KEY?: string } })?.env?.VITE_OPENWEATHER_API_KEY || '550d5df798ec07825372f430151ec5ab';

const LocationContext = createContext<LocationState | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
	const [label, setLabel] = useState<string>('');
	const [coords, setCoords] = useState<Coordinates | null>(null);
	const [isResolving, setIsResolving] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const apiBase = useMemo(() => 'https://api.openweathermap.org', []);

	const setCoordsManually = useCallback((c: Coordinates, l?: string) => {
		setCoords(c);
		if (l) setLabel(l);
		setError(null);
		localStorage.setItem('location:coords', JSON.stringify(c));
		if (l) localStorage.setItem('location:label', l);
	}, []);

	const setCityByName = useCallback(async (city: string) => {
		if (!city.trim()) return;
		setIsResolving(true);
		setError(null);
		try {
			const resp = await fetch(`${apiBase}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`);
			if (!resp.ok) throw new Error('Location not found');
			const data = await resp.json();
			if (!Array.isArray(data) || data.length === 0) throw new Error('Location not found');
			const place = data[0];
			const newLabel = `${place.name}${place.state ? ', ' + place.state : ''}${place.country ? ', ' + place.country : ''}`;
			setLabel(newLabel);
			setCoords({ latitude: place.lat, longitude: place.lon });
			localStorage.setItem('location:coords', JSON.stringify({ latitude: place.lat, longitude: place.lon }));
			localStorage.setItem('location:label', newLabel);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Failed to resolve city');
		} finally {
			setIsResolving(false);
		}
	}, [apiBase]);

	const reverseGeocode = useCallback(async (c: Coordinates): Promise<string> => {
		try {
			const resp = await fetch(`${apiBase}/geo/1.0/reverse?lat=${c.latitude}&lon=${c.longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`);
			if (!resp.ok) return 'Unknown';
			const data = await resp.json();
			const place = Array.isArray(data) && data[0];
			if (!place) return 'Unknown';
			return `${place.name}${place.state ? ', ' + place.state : ''}${place.country ? ', ' + place.country : ''}`;
		} catch {
			return 'Unknown';
		}
	}, [apiBase]);

	const useGPS = useCallback(() => {
		if (!('geolocation' in navigator)) {
			setError('Geolocation not supported by this browser');
			return;
		}
		setIsResolving(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				const c = { latitude, longitude };
				setCoords(c);
				(async () => {
					const l = await reverseGeocode(c);
					setLabel(l);
					localStorage.setItem('location:coords', JSON.stringify(c));
					localStorage.setItem('location:label', l);
					setIsResolving(false);
				})();
			},
			(err) => {
				setIsResolving(false);
				setError(err.message || 'Unable to get current location');
			}
		);
	}, [reverseGeocode]);

	useEffect(() => {
		const storedCoords = localStorage.getItem('location:coords');
		const storedLabel = localStorage.getItem('location:label');
		if (storedCoords) {
			try {
				const parsed = JSON.parse(storedCoords);
				setCoords(parsed);
				if (storedLabel) setLabel(storedLabel);
				return;
			} catch {
				// Ignore parsing errors
			}
		}
		// Default: try GPS once
		if ('geolocation' in navigator) {
			setIsResolving(true);
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const { latitude, longitude } = pos.coords;
					const c = { latitude, longitude };
					setCoords(c);
					(async () => {
						const l = await reverseGeocode(c);
						setLabel(l);
						localStorage.setItem('location:coords', JSON.stringify(c));
						localStorage.setItem('location:label', l);
						setIsResolving(false);
					})();
				},
				(err) => {
					setIsResolving(false);
					setError(err.message || 'Unable to get current location');
				}
			);
		}
	}, [reverseGeocode]);

	const suggestCities = useCallback(async (q: string) => {
		if (!q.trim()) return [] as Array<{ name: string; state?: string; country?: string; lat: number; lon: number }>;
		try {
			const resp = await fetch(`${apiBase}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${OPENWEATHER_API_KEY}`);
			if (!resp.ok) return [];
			const data = await resp.json();
			if (!Array.isArray(data)) return [];
			return data.map((p: any) => ({ name: p.name, state: p.state, country: p.country, lat: p.lat, lon: p.lon }));
		} catch {
			return [];
		}
	}, [apiBase]);

	const selectPlace = useCallback((p: { name: string; state?: string; country?: string; lat: number; lon: number }) => {
		const newLabel = `${p.name}${p.state ? ', ' + p.state : ''}${p.country ? ', ' + p.country : ''}`;
		setLabel(newLabel);
		const c = { latitude: p.lat, longitude: p.lon };
		setCoords(c);
		localStorage.setItem('location:coords', JSON.stringify(c));
		localStorage.setItem('location:label', newLabel);
		setError(null);
	}, []);

	const value = useMemo<LocationState>(() => ({
		label,
		coords,
		isResolving,
		error,
		useGPS,
		setCityByName,
		setCoordsManually,
		suggestCities,
		selectPlace,
	}), [label, coords, isResolving, error, useGPS, setCityByName, setCoordsManually, suggestCities, selectPlace]);

	return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocationContext = (): LocationState => {
	const ctx = useContext(LocationContext);
	if (!ctx) throw new Error('useLocationContext must be used within LocationProvider');
	return ctx;
};
