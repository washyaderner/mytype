'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface DropdownFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
}

/**
 * Dropdown Field Renderer
 */
export const DropdownField: React.FC<DropdownFieldProps> = ({
  field,
  value,
  onChange,
  error,
  autoFocus = false,
}) => {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        className={`
          w-full px-6 py-4 text-xl border-2 rounded-lg bg-white
          focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
        `}
      >
        <option value="">Select an option...</option>
        {field.choices?.map((choice) => (
          <option key={choice.id} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
