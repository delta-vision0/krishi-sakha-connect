import React from 'react';
import { Home, Sprout, Camera, TrendingUp, Bot } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavigationProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const BottomNavigation = ({ activeView, onNavigate }: BottomNavigationProps) => {
  const { t } = useLanguage();
  const navItems = [
    { id: 'dashboard', icon: Home, label: t('nav.dashboard') },
    { id: 'fertilizer', icon: Sprout, label: t('nav.fertilizer') },
    { id: 'scanner', icon: Camera, label: t('nav.scanner') },
    { id: 'prices', icon: TrendingUp, label: t('nav.prices') },
    { id: 'ai', icon: Bot, label: t('nav.ai') },
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex items-center">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-item ${activeView === id ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};