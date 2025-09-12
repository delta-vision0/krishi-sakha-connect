import React from 'react';
import { TrendingUp, Calendar, MapPin } from 'lucide-react';

export const MarketPrices = () => {
  const marketData = [
    { crop: 'Wheat', price: '₹2,150', change: '+2.3%', trend: 'up' },
    { crop: 'Rice (Basmati)', price: '₹3,800', change: '+1.8%', trend: 'up' },
    { crop: 'Maize', price: '₹1,850', change: '-0.5%', trend: 'down' },
    { crop: 'Cotton', price: '₹6,200', change: '+3.1%', trend: 'up' },
    { crop: 'Soybean', price: '₹4,500', change: '+1.2%', trend: 'up' },
    { crop: 'Onion', price: '₹1,200', change: '-2.1%', trend: 'down' },
    { crop: 'Tomato', price: '₹800', change: '+5.2%', trend: 'up' },
    { crop: 'Potato', price: '₹900', change: '-1.8%', trend: 'down' },
    { crop: 'Sugarcane', price: '₹280', change: '+0.8%', trend: 'up' },
    { crop: 'Turmeric', price: '₹8,500', change: '+2.5%', trend: 'up' },
  ];

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-500';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? '↗' : '↘';
  };

  return (
    <div id="market-prices" className="space-y-6 fade-in">
      <div className="krishi-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="heading-3">Market Prices</h2>
              <p className="caption">Latest commodity prices</p>
            </div>
          </div>
        </div>

        <div className="bg-accent/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={16} />
              <span>Kolhapur Mandi</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar size={16} />
              <span>12 Sep 2025</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {marketData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-accent/20 rounded-lg hover:bg-accent/40 transition-colors">
              <div className="font-medium">{item.crop}</div>
              <div className="flex items-center gap-4">
                <div className="font-bold text-lg">{item.price}</div>
                <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(item.trend)}`}>
                  <span>{getTrendIcon(item.trend)}</span>
                  <span>{item.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Prices are per quintal and updated daily at 6 PM. 
            Rates may vary based on quality and local market conditions.
          </p>
        </div>
      </div>
    </div>
  );
};