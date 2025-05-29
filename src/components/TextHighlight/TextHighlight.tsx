import { cn } from '@/lib/utils';
import { FC, ReactNode } from 'react';

export interface TextHighlightProps {
  className?: string;
  design?: 'v1' | 'v2';
  children?: ReactNode;
}

export const TextHighlight: FC<TextHighlightProps> = ({ className, design = 'v1', children }) => {
  if (design === 'v1') {
    return <span className={cn('text-sm px-1 rounded-sm bg-orange-100 text-orange-800', className)}>{children}</span>;
  }

  return '';
};
