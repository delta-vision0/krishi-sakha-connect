import React, { useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';
import { useLocationContext } from '@/hooks/useLocation';

export const Header = () => {
	const { label, isResolving, useGPS, setCityByName, error } = useLocationContext();
	const [cityInput, setCityInput] = useState('');

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!cityInput.trim()) return;
		await setCityByName(cityInput.trim());
		setCityInput('');
	};

	return (
		<header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between gap-4">
					<div>
						<h1 className="heading-2 text-primary font-bold">Krishi Sakha</h1>
						<p className="caption">Your Smart Farming Assistant</p>
					</div>

					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<MapPin size={16} />
						<span className="hidden sm:inline">{label || 'Select location'}</span>
					</div>
				</div>

				<form onSubmit={onSubmit} className="mt-3 flex items-center gap-2">
					<input
						type="text"
						value={cityInput}
						onChange={(e) => setCityInput(e.target.value)}
						placeholder="Search city or village"
						className="w-full sm:w-auto flex-1 sm:flex-none sm:min-w-[260px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
					/>
					<button
						type="submit"
						className="px-3 py-2 rounded-md bg-primary text-white disabled:opacity-50"
						disabled={isResolving}
					>
						{isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set'}
					</button>
					<button
						type="button"
						onClick={useGPS}
						className="px-3 py-2 rounded-md border flex items-center gap-1"
						disabled={isResolving}
					>
						<Crosshair className="w-4 h-4" />
						Use GPS
					</button>
				</form>
				{error && <div className="text-xs text-red-600 mt-1">{error}</div>}
			</div>
		</header>
	);
};