// src/components/ui/scroll-area.tsx
import React from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className }) => (
  <div className={`scroll-area ${className}`}>{children}</div>
);

export default ScrollArea;
