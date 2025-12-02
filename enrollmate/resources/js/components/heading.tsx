import { CornerDownRight } from 'lucide-react';
import {type ComponentType } from 'react';

type HeadingProps = {
  title: string;
  description?: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
};

export default function Heading({ title, description, icon: Icon }: HeadingProps) {
  return (
    <header className="flex items-start gap-2 bg-sidebar-accent p-4 rounded-md">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-semibold text-neutral-950">{title}</span>
        </div>
        {description && 
          <div className='flex items-center text-muted-foreground'>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>        
        }
      </div>
    </header>
  );
}
