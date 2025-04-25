
import React from 'react';
import { Card } from '@/components/ui/card';

interface JsonDisplayProps {
  title: string;
  data: any;
}

const JsonDisplay: React.FC<JsonDisplayProps> = ({ title, data }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-health-700 text-white px-4 py-2 font-medium">
        {title}
      </div>
      <pre className="p-4 text-xs md:text-sm overflow-auto max-h-[400px] bg-gray-50">
        {JSON.stringify(data, null, 2)}
      </pre>
    </Card>
  );
};

export default JsonDisplay;
