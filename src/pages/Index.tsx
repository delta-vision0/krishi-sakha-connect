import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { CropRecommendation } from '@/components/CropRecommendation';
import { FertilizerAdvisor } from '@/components/FertilizerAdvisor';
import { PestDetection } from '@/components/PestDetection';
import { MarketPrices } from '@/components/MarketPrices';
import { BottomNavigation } from '@/components/BottomNavigation';
import { GeminiModal } from '@/components/GeminiModal';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiContext, setGeminiContext] = useState<{
    diseaseName: string;
    plantName: string;
    confidence: number;
  } | undefined>(undefined);
 
  useEffect(() => {
    if (activeView === 'ai') {
      setIsGeminiOpen(true);
      setActiveView('dashboard');
    }
  }, [activeView]);
 
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveView} />;
      case 'crop-recommendation':
        return <CropRecommendation onBack={() => setActiveView('dashboard')} />;
      case 'fertilizer':
        return <FertilizerAdvisor />;
      case 'scanner':
        return <PestDetection onOpenGemini={(context) => {
          setGeminiContext(context);
          setIsGeminiOpen(true);
        }} />;
      case 'prices':
        return <MarketPrices />;
      case 'ai':
        return <Dashboard onNavigate={setActiveView} />;
      default:
        return <Dashboard onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {renderActiveView()}
      </main>

      <BottomNavigation activeView={activeView} onNavigate={setActiveView} />
      
      {isGeminiOpen && (
        <GeminiModal 
          onClose={() => {
            setIsGeminiOpen(false);
            setGeminiContext(undefined);
          }} 
          diseaseContext={geminiContext}
        />
      )}
    </div>
  );
};

export default Index;