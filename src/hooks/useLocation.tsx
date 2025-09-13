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

	const useGPS = useCallback(() => {
		if (!('geolocation' in navigator)) {
			setError('Geolocation not supported by this browser');
			return;
		}
		setIsResolving(true);
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				const { latitude, longitude } = pos.coords;
				setCoords({ latitude, longitude });
				setLabel('My Location');
				localStorage.setItem('location:coords', JSON.stringify({ latitude, longitude }));
				localStorage.setItem('location:label', 'My Location');
				setIsResolving(false);
			},
			(err) => {
				setIsResolving(false);
				setError(err.message || 'Unable to get current location');
			}
		);
	}, []);

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
					setCoords({ latitude, longitude });
					setLabel('My Location');
					localStorage.setItem('location:coords', JSON.stringify({ latitude, longitude }));
					localStorage.setItem('location:label', 'My Location');
					setIsResolving(false);
				},
				(err) => {
					setIsResolving(false);
					setError(err.message || 'Unable to get current location');
				}
			);
		}
	}, []);

	const value = useMemo<LocationState>(() => ({
		label,
		coords,
		isResolving,
		error,
		useGPS,
		setCityByName,
		setCoordsManually,
	}), [label, coords, isResolving, error, useGPS, setCityByName, setCoordsManually]);

	return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocationContext = (): LocationState => {
	const ctx = useContext(LocationContext);
	if (!ctx) throw new Error('useLocationContext must be used within LocationProvider');
	return ctx;
};
