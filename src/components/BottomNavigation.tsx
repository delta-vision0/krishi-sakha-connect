import React from 'react';
import { Home, Sprout, Camera, TrendingUp, Bot } from 'lucide-react';

interface BottomNavigationProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

export const BottomNavigation = ({ activeView, onNavigate }: BottomNavigationProps) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'fertilizer', icon: Sprout, label: 'Fertilizer' },
    { id: 'scanner', icon: Camera, label: 'Scanner' },
    { id: 'prices', icon: TrendingUp, label: 'Prices' },
    { id: 'ai', icon: Bot, label: 'Ask AI' },
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