import React from 'react';
import { sanitizeTextInput, MAX_LENGTHS } from '@/utils/security';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  sanitize?: boolean;
  maxSanitizedLength?: number;
}

/**
 * Input Component
 *
 * SECURITY: Optionally sanitizes input to prevent XSS
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      onChange,
      sanitize = true,
      maxSanitizedLength = MAX_LENGTHS.LONG_TEXT,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value;

      // SECURITY: Sanitize input if enabled
      if (sanitize) {
        value = sanitizeTextInput(value, maxSanitizedLength);
      }

      onChange?.(value);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
