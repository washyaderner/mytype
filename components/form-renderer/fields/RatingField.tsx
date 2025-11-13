'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface RatingFieldProps {
  field: FieldConfig;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
}

/**
 * Rating Field Renderer
 */
export const RatingField: React.FC<RatingFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const steps = field.steps || 5;
  const shape = field.shape || 'star';

  const getIcon = (index: number, filled: boolean) => {
    const baseClass = 'w-12 h-12 transition-all cursor-pointer';
    const filledClass = filled ? 'text-yellow-400 scale-110' : 'text-gray-300 hover:text-yellow-300 hover:scale-105';

    if (shape === 'star') {
      return (
        <svg
          className={`${baseClass} ${filledClass}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (shape === 'heart') {
      return (
        <svg
          className={`${baseClass} ${filledClass}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    // Default to numbers
    return (
      <span
        className={`
          ${baseClass} flex items-center justify-center text-2xl font-bold
          w-16 h-16 rounded-full border-2
          ${
            filled
              ? 'border-blue-500 bg-blue-500 text-white scale-110'
              : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-400 hover:scale-105'
          }
        `}
      >
        {index + 1}
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-center">
        {Array.from({ length: steps }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index + 1)}
            className="focus:outline-none"
          >
            {getIcon(index, value !== null && value > index)}
          </button>
        ))}
      </div>
      {error && (
        <p className="mt-4 text-center text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
