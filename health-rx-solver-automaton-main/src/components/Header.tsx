
import { ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <header className="w-full">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-health-900">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          
          <div className="flex items-center text-sm text-health-700">
            <span>API Request</span>
            <ArrowRight className="h-3 w-3 mx-1" />
            <span>Process Data</span>
            <ArrowRight className="h-3 w-3 mx-1" />
            <span>Submit Results</span>
          </div>
        </div>
      </div>
      <Separator />
    </header>
  );
};

export default Header;
