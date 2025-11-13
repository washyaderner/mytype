import React from 'react';
import { sanitizeTextInput, MAX_LENGTHS } from '@/utils/security';

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
  sanitize?: boolean;
  maxSanitizedLength?: number;
}

/**
 * Textarea Component
 *
 * SECURITY: Optionally sanitizes input to prevent XSS
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2)}`;

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg resize-none
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
