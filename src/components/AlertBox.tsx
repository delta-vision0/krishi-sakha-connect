import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AlertBoxProps {
  message: string;
  type: 'success' | 'warning' | 'info';
}

export const AlertBox = ({ message, type }: AlertBoxProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'farm-alert';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className={`${getStyles()} rounded-lg p-4 flex items-center gap-3`}>
      {getIcon()}
      <span className="body-text font-medium">{message}</span>
    </div>
  );
};