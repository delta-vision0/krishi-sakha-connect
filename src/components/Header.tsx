import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { useLocationContext } from '@/hooks/useLocation';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

export const Header = () => {
	const { t } = useLanguage();
	const { label, isResolving, useGPS, setCityByName, error, suggestCities, selectPlace } = useLocationContext();
	const [cityInput, setCityInput] = useState('');
	const [suggestions, setSuggestions] = useState<Array<{ name: string; state?: string; country?: string; lat: number; lon: number }>>([]);
	const [open, setOpen] = useState(false);
	const formRef = useRef<HTMLFormElement | null>(null);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cityInput.trim()) return;
		await setCityByName(cityInput.trim());
		setCityInput('');
	};

	useEffect(() => {
		const onDocClick = (e: MouseEvent) => {
			if (!formRef.current) return;
			if (!formRef.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', onDocClick);
		return () => document.removeEventListener('mousedown', onDocClick);
	}, []);

	useEffect(() => {
		const id = setTimeout(async () => {
			if (cityInput.trim().length < 2) {
				setSuggestions([]);
				return;
			}
			const res = await suggestCities(cityInput.trim());
			setSuggestions(res);
			setOpen(res.length > 0);
		}, 250);
		return () => clearTimeout(id);
	}, [cityInput, suggestCities]);

	const onPick = (s: { name: string; state?: string; country?: string; lat: number; lon: number }) => {
		selectPlace(s);
		setOpen(false);
		setCityInput('');
	};

	return (
		<header className="sticky top-0 z-40 bg-background border-b border-border shadow-sm">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="heading-2 text-primary font-bold">Krishi Sakha</h1>
						<p className="caption">Your Smart Farming Assistant</p>
					</div>

					<div className="flex items-center gap-2 sm:gap-4">
						<LanguageSelector />
						<ThemeToggle />
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin size={16} />
							<span className="hidden sm:inline">{label || t('common.selectLocation')}</span>
						</div>
					</div>
				</div>

				<form onSubmit={onSubmit} ref={formRef} className="mt-3 flex items-center gap-2 relative">
					<input
						type="text"
						value={cityInput}
						onChange={(e) => setCityInput(e.target.value)}
						placeholder={t('common.searchLocation')}
						className="w-full sm:w-auto flex-1 sm:flex-none sm:min-w-[260px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
					/>
					<button
						type="submit"
						className="px-3 py-2 rounded-md bg-primary text-white disabled:opacity-50"
						disabled={isResolving}
					>
						{isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : t('common.set')}
					</button>
					<button
						type="button"
						onClick={useGPS}
						className="px-3 py-2 rounded-md border flex items-center gap-1"
						disabled={isResolving}
					>
						<Crosshair className="w-4 h-4" />
						{t('common.useGPS')}
					</button>

					{open && suggestions.length > 0 && (
						<div className="absolute left-0 top-full mt-1 w-full sm:w-[420px] bg-card border rounded-md shadow-md max-h-72 overflow-auto z-50">
							{suggestions.map((s, idx) => (
								<button
									key={`${s.name}-${s.lat}-${s.lon}-${idx}`}
									type="button"
									onClick={() => onPick(s)}
									className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
								>
									<div className="font-medium">{s.name}</div>
									<div className="text-xs text-muted-foreground">{[s.state, s.country].filter(Boolean).join(', ')}</div>
								</button>
							))}
						</div>
					)}
				</form>
				{error && <div className="text-xs text-red-600 mt-1">{error}</div>}
			</div>
		</header>
	);
};