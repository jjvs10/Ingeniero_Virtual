// src/components/ui/button.tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick }) => (
  <button className={`button ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;
