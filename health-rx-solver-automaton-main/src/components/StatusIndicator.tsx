
import React from 'react';
import { cn } from '@/lib/utils';
import { ProcessingStatus } from '@/types/api';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface StatusIndicatorProps {
  status: ProcessingStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.step) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'init':
        return 'bg-gray-400';
      default:
        return 'bg-health-500';
    }
  };

  const isProcessing = ['fetching', 'processing', 'submitting'].includes(status.step);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative flex items-center justify-center">
        <div 
          className={cn(
            "w-4 h-4 rounded-full",
            getStatusColor()
          )}
        />
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-8 h-8 rounded-full",
              getStatusColor(),
              "opacity-50 animate-pulse-ring"
            )}></div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
        {status.step === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
        {status.step === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
        <span 
          className={cn(
            "text-sm font-medium",
            status.step === 'error' ? "text-red-500" : 
            status.step === 'completed' ? "text-green-500" : 
            "text-gray-700"
          )}
        >
          {status.message}
        </span>
      </div>
      {status.details && (
        <div className="text-xs text-gray-500 max-w-md">
          {status.details}
        </div>
      )}
    </div>
  );
};

export default StatusIndicator;
