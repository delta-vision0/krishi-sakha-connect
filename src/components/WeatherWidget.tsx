import React from 'react';
import { Cloud, Droplets, Wind } from 'lucide-react';

export const WeatherWidget = () => {
  return (
    <div className="weather-widget">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">Today's Weather</h3>
          <p className="text-sm text-gray-600">Ichalkaranji, Maharashtra</p>
        </div>
        <Cloud className="w-8 h-8 text-blue-500" />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-4xl font-bold text-gray-800">28°C</div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600">Humidity: 65%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">Wind: 12 km/h</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Partly cloudy with light winds. Good conditions for field work.
      </div>
    </div>
  );
};