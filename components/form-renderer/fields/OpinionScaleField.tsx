'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface OpinionScaleFieldProps {
  field: FieldConfig;
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
}

/**
 * Opinion Scale Field Renderer
 */
export const OpinionScaleField: React.FC<OpinionScaleFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const min = field.min || 1;
  const max = field.max || 10;
  const steps = max - min + 1;

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Scale buttons */}
        <div className="flex gap-2 justify-center flex-wrap">
          {Array.from({ length: steps }).map((_, index) => {
            const scaleValue = min + index;
            const isSelected = value === scaleValue;
            return (
              <button
                key={scaleValue}
                type="button"
                onClick={() => onChange(scaleValue)}
                className={`
                  w-12 h-12 rounded-lg text-lg font-semibold transition-all
                  ${
                    isSelected
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200 scale-110'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                {scaleValue}
              </button>
            );
          })}
        </div>

        {/* Labels */}
        {(field.startLabel || field.endLabel) && (
          <div className="flex justify-between text-sm text-gray-600">
            <span>{field.startLabel || ''}</span>
            <span>{field.endLabel || ''}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-4 text-center text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
