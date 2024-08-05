// src/components/ui/input.tsx
import React from 'react';

interface InputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, value, onChange, className }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    className={`input ${className}`}
  />
);

export default Input;
