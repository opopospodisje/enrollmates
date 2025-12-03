import { useId } from 'react';

interface PlaceholderPatternProps {
  className?: string;
  variant?: 'lines' | 'dots';
  corner?: 'none' | 'top-right' | 'bottom-left';
  dotRadius?: number;
  spacing?: number;
}

export function PlaceholderPattern({
  className,
  variant = 'lines',
  corner = 'none',
  dotRadius = 2,
  spacing = 10,
}: PlaceholderPatternProps) {
  const id = useId();
  const patternId = `${id}-pattern`;
  const clipId = `${id}-clip`;

  const viewBox = '0 0 120 120';

  return (
    <svg className={className} viewBox={viewBox} preserveAspectRatio="none">
      <defs>
        {variant === 'dots' ? (
          <pattern id={patternId} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
            <circle cx={spacing / 2} cy={spacing / 2} r={dotRadius} fill="currentColor" />
          </pattern>
        ) : (
          <pattern id={patternId} x="0" y="0" width={10} height={10} patternUnits="userSpaceOnUse">
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" stroke="currentColor" />
          </pattern>
        )}

        {corner !== 'none' && (
          <clipPath id={clipId}>
            {corner === 'bottom-left' && <polygon points="0,120 0,0 120,120" />}
            {corner === 'top-right' && <polygon points="120,0 120,120 0,0" />}
          </clipPath>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} clipPath={corner !== 'none' ? `url(#${clipId})` : undefined} />
    </svg>
  );
}
