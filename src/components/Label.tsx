import React from 'react';
import { Label as LabelType } from '../types';

interface LabelProps {
  label: LabelType;
  size?: 'sm' | 'md';
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ label, size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`
        ${sizeClasses[size]}
        rounded-full
        text-white
        font-medium
        shadow-sm
        ${className}
      `}
      style={{ backgroundColor: label.color }}
    >
      {label.name}
    </span>
  );
};