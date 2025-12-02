import { CornerDownRight } from 'lucide-react';
import {type ComponentType } from 'react';

type HeadingSmallProps = {
  title: string;
  description?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
};

export default function HeadingSmall({ title, description, icon: Icon }: HeadingSmallProps) {
  return (
    <header className="flex items-start gap-2">
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-muted-foreground" />}
          <span className="text-base font-medium">{title}</span>
        </div>
        {description && 
          <div className='flex items-center text-muted-foreground gap-2 px-4'>
            <CornerDownRight size={14} />
            <p className="text-sm">{description}</p>
          </div>        
        }
      </div>
    </header>
  );
}
