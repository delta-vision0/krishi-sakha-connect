import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cloud, Droplets, Wind, MapPin, Loader2 } from 'lucide-react';
import { useLocationContext } from '@/hooks/useLocation';
import { AlertBox } from './AlertBox';

interface WeatherData {
	tempCelsius: number;
	humidityPercent: number;
	windSpeedKmh: number;
	description: string;
	icon: string | null;
	city: string;
	country: string | null;
}

interface ForecastItem {
	date: string; // YYYY-MM-DD
	min: number;
	max: number;
	icon: string | null;
	description: string;
	rainLikely: boolean;
}

const OPENWEATHER_API_KEY = (import.meta as { env?: { VITE_OPENWEATHER_API_KEY?: string } })?.env?.VITE_OPENWEATHER_API_KEY || '550d5df798ec07825372f430151ec5ab';

const formatWindSpeedToKmh = (metersPerSecond: number) => Math.round(metersPerSecond * 3.6);

export const WeatherWidget = () => {
	const { t } = useLanguage();
	const { coords, label, isResolving } = useLocationContext();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [showForecast, setShowForecast] = useState(false);
	const [forecast, setForecast] = useState<ForecastItem[] | null>(null);

	const apiBase = useMemo(() => 'https://api.openweathermap.org', []);

	useEffect(() => {
		const fetchCurrent = async () => {
			if (!coords) return;
			setIsLoading(true);
			setError(null);
			try {
				const resp = await fetch(`${apiBase}/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
				if (!resp.ok) throw new Error('Failed to fetch weather');
				const data = await resp.json();
				const w: WeatherData = {
					tempCelsius: Math.round(data.main.temp),
					humidityPercent: data.main.humidity,
					windSpeedKmh: formatWindSpeedToKmh(data.wind.speed),
					description: data.weather?.[0]?.description ?? '—',
					icon: data.weather?.[0]?.icon ?? null,
					city: data.name ?? 'Unknown',
					country: data.sys?.country ?? null,
				};
				setWeather(w);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Error fetching weather');
			} finally {
				setIsLoading(false);
			}
		};
		fetchCurrent();
	}, [coords, apiBase]);

	const loadForecast = async () => {
		if (!coords) return;
		setError(null);
		try {
			const resp = await fetch(`${apiBase}/data/2.5/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`);
			if (!resp.ok) throw new Error('Failed to fetch forecast');
			const data = await resp.json();
			// Group by date
			const byDate: Record<string, ForecastItem> = {};
			for (const item of data.list as Array<{
				dt_txt: string;
				main: { temp_min: number; temp_max: number };
				weather: Array<{ main: string; icon: string; description: string }>;
				rain?: unknown;
			}>) {
				const dtTxt: string = item.dt_txt; // "YYYY-MM-DD HH:mm:ss"
				const date = dtTxt.slice(0, 10);
				const tempMin = item.main.temp_min;
				const tempMax = item.main.temp_max;
				const icon: string | null = item.weather?.[0]?.icon ?? null;
				const description: string = item.weather?.[0]?.description ?? '—';
				const hasRainFlag = Boolean(item.rain) || ['Rain', 'Drizzle', 'Thunderstorm'].includes(item.weather?.[0]?.main);
				if (!byDate[date]) {
					byDate[date] = {
						date,
						min: tempMin,
						max: tempMax,
						icon,
						description,
						rainLikely: hasRainFlag,
					};
				} else {
					byDate[date].min = Math.min(byDate[date].min, tempMin);
					byDate[date].max = Math.max(byDate[date].max, tempMax);
					if (!byDate[date].icon && icon) byDate[date].icon = icon;
					if (hasRainFlag) byDate[date].rainLikely = true;
				}
			}
			const items = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
			setForecast(items);
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Error fetching forecast');
		}
	};

	useEffect(() => {
		if (showForecast && !forecast && coords) {
			loadForecast();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [showForecast, coords]);

	const rainLikelySoon = useMemo(() => {
		if (!forecast) return false;
		// Check today or tomorrow for rain likelihood
		const today = new Date().toISOString().slice(0, 10);
		const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
		return forecast.some((f) => (f.date === today || f.date === tomorrow) && f.rainLikely);
	}, [forecast]);

	return (
		<div className="krishi-card">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h3 className="font-semibold text-gray-800">{t('weather.title')}</h3>
					<p className="text-sm text-gray-600 flex items-center gap-1">
						<MapPin className="w-4 h-4" />
						{label || t('weather.selectLocation')}
					</p>
				</div>
				{(isLoading || isResolving) ? (
					<Loader2 className="w-5 h-5 animate-spin text-blue-500" />
				) : (
					<Cloud className="w-8 h-8 text-blue-500" />
				)}
			</div>

			{error && (
				<div className="text-sm text-red-600 mb-2">{error}</div>
			)}

			{weather ? (
				<>
					<div className="flex items-center justify-between">
						<div className="text-4xl font-bold text-gray-800">
							{weather.tempCelsius}°C
						</div>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div className="flex items-center gap-2">
								<Droplets className="w-4 h-4 text-blue-500" />
								<span className="text-gray-600">{t('weather.humidity')}: {weather.humidityPercent}%</span>
							</div>
							<div className="flex items-center gap-2">
								<Wind className="w-4 h-4 text-gray-500" />
								<span className="text-gray-600">{t('weather.wind')}: {weather.windSpeedKmh} km/h</span>
							</div>
						</div>
					</div>
					<div className="mt-4 text-sm text-gray-600 capitalize">
						{weather.description}
					</div>

					<div className="mt-4 flex items-center gap-2">
						<button
							onClick={() => setShowForecast((v) => !v)}
							className="px-3 py-2 rounded-md border"
						>
							{showForecast ? t('weather.hideForecast') : t('weather.showForecast')}
						</button>
					</div>

					{showForecast && (
						<div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
							{forecast ? (
								forecast.slice(0, 5).map((f) => (
									<div key={f.date} className="p-3 border rounded-md text-center">
										<div className="text-xs text-muted-foreground">{f.date}</div>
										<div className="text-sm capitalize">{f.description}</div>
										<div className="font-semibold">{Math.round(f.min)}° / {Math.round(f.max)}°C</div>
									</div>
								))
							) : (
								<div className="text-sm text-muted-foreground">{t('common.loading')} forecast...</div>
							)}
						</div>
					)}

					{rainLikelySoon && (
						<div className="mt-4">
							<AlertBox message={t('weather.rainWarning')} type="warning" />
						</div>
					)}
				</>
			) : (
				<div className="text-sm text-muted-foreground">
					{(isLoading || isResolving) ? t('weather.loadingWeather') : t('weather.selectLocation')}
				</div>
			)}
		</div>
	);
};