'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface TextareaFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
}

/**
 * Textarea Field Renderer (long_text)
 *
 * SECURITY: All displayed content is escaped
 */
export const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  value,
  onChange,
  error,
  autoFocus = false,
}) => {
  return (
    <div className="w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'Type your answer here...'}
        autoFocus={autoFocus}
        rows={6}
        className={`
          w-full px-6 py-4 text-xl border-2 rounded-lg bg-white resize-none
          focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all
          ${error ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
        `}
        maxLength={field.maxLength}
        minLength={field.minLength}
      />
      <div className="mt-2 flex justify-between items-center">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {field.maxLength && (
          <p className="text-gray-400 text-sm ml-auto">
            {value.length} / {field.maxLength}
          </p>
        )}
      </div>
    </div>
  );
};
