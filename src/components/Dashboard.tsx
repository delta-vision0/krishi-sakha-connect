import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { WeatherWidget } from './WeatherWidget';
import { AlertBox } from './AlertBox';
import { Sprout, Droplets, TrendingUp, Camera } from 'lucide-react';
import heroImage from '@/assets/hero-farming.jpg';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Section with Hero Image and Language Selector */}
      <div className="krishi-card relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Farming landscape"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        </div>
        <div className="relative z-10">
          <div>
            <h2 className="heading-3 text-primary mb-2">{t('dashboard.title')}</h2>
            <p className="body-text text-muted-foreground mb-4">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Alert Box removed: now shown conditionally inside WeatherWidget based on forecast */}

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate('crop-recommendation')}
          className="krishi-card text-left group hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('dashboard.cropRecommendation')}</h3>
              <p className="caption">{t('dashboard.cards.crop.caption')}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('fertilizer')}
          className="krishi-card text-left group hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Droplets className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('dashboard.fertilizer')}</h3>
              <p className="caption">{t('dashboard.cards.fertilizer.caption')}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('scanner')}
          className="krishi-card text-left group hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('dashboard.pestDetection')}</h3>
              <p className="caption">{t('dashboard.cards.scanner.caption')}</p>
            </div>
          </div>
        </button>

        <button 
          onClick={() => onNavigate('prices')}
          className="krishi-card text-left group hover:bg-primary/5 border-2 border-transparent hover:border-primary/20 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t('dashboard.marketPrices')}</h3>
              <p className="caption">{t('dashboard.cards.prices.caption')}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};