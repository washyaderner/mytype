'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface YesNoFieldProps {
  field: FieldConfig;
  value: boolean | null;
  onChange: (value: boolean) => void;
  error?: string;
}

/**
 * Yes/No Field Renderer
 */
export const YesNoField: React.FC<YesNoFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="w-full">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            flex-1 px-8 py-6 text-xl font-semibold rounded-lg border-2 transition-all
            ${
              value === true
                ? 'border-green-500 bg-green-500 text-white ring-4 ring-green-200'
                : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">👍</span>
            <span>Yes</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`
            flex-1 px-8 py-6 text-xl font-semibold rounded-lg border-2 transition-all
            ${
              value === false
                ? 'border-red-500 bg-red-500 text-white ring-4 ring-red-200'
                : 'border-gray-300 bg-white text-gray-700 hover:border-red-400 hover:bg-red-50'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">👎</span>
            <span>No</span>
          </div>
        </button>
      </div>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
