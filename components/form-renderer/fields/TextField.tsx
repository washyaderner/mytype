'use client';

import React from 'react';
import type { FieldConfig } from '@/types';
import { escapeHtml } from '@/utils/security';

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoFocus?: boolean;
}

/**
 * Text Field Renderer (short_text, email, phone, url, number)
 *
 * SECURITY: All displayed content is escaped
 */
export const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  onChange,
  error,
  autoFocus = false,
}) => {
  const getInputType = () => {
    switch (field.type) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'url':
        return 'url';
      case 'number':
        return 'number';
      default:
        return 'text';
    }
  };

  const getInputMode = () => {
    switch (field.type) {
      case 'email':
        return 'email';
      case 'phone':
        return 'tel';
      case 'url':
        return 'url';
      case 'number':
        return 'numeric';
      default:
        return 'text';
    }
  };

  return (
    <div className="w-full">
      <input
        type={getInputType()}
        inputMode={getInputMode()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder || 'Type your answer here...'}
        autoFocus={autoFocus}
        className={`
          w-full px-6 py-4 text-2xl border-b-4 bg-transparent
          focus:outline-none transition-colors
          ${error ? 'border-red-500' : 'border-blue-500 focus:border-blue-600'}
        `}
        maxLength={field.maxLength}
        minLength={field.minLength}
        min={field.type === 'number' ? field.min : undefined}
        max={field.type === 'number' ? field.max : undefined}
        step={field.type === 'number' ? field.step : undefined}
      />
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
