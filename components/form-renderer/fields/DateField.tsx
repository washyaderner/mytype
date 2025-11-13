'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface DateFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
}

/**
 * Date Field Renderer
 */
export const DateField: React.FC<DateFieldProps> = ({
  field,
  value,
  onChange,
  error,
  autoFocus = false,
}) => {
  return (
    <div className="w-full">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={`
          w-full px-6 py-4 text-2xl border-2 rounded-lg bg-white
          focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
        `}
      />
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
