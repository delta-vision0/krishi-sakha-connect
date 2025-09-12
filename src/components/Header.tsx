import React from 'react';
import { MapPin } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="heading-2 text-primary font-bold">Krishi Sakha</h1>
            <p className="caption">Your Smart Farming Assistant</p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>Ichalkaranji, MH</span>
          </div>
        </div>
      </div>
    </header>
  );
};