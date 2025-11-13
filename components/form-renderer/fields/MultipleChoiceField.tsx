'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface MultipleChoiceFieldProps {
  field: FieldConfig;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}

/**
 * Multiple Choice Field Renderer
 */
export const MultipleChoiceField: React.FC<MultipleChoiceFieldProps> = ({
  field,
  value,
  onChange,
  error,
}) => {
  const isMultiple = field.allowMultiple || false;
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleSelect = (choiceValue: string) => {
    if (isMultiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (currentValues.includes(choiceValue)) {
        onChange(currentValues.filter((v) => v !== choiceValue));
      } else {
        onChange([...currentValues, choiceValue]);
      }
    } else {
      onChange(choiceValue);
    }
  };

  return (
    <div className="w-full space-y-3">
      {field.choices?.map((choice, index) => {
        const isSelected = selectedValues.includes(choice.value);
        return (
          <button
            key={choice.id}
            type="button"
            onClick={() => handleSelect(choice.value)}
            className={`
              w-full px-6 py-4 text-left text-lg rounded-lg border-2 transition-all
              hover:border-blue-400 hover:bg-blue-50
              ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-200'
                  : 'border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center gap-4">
              <span
                className={`
                  flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0
                  ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
                `}
              >
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>
              <span className="flex-1">
                <span className="text-gray-400 mr-2">{String.fromCharCode(65 + index)}</span>
                {choice.label}
              </span>
            </div>
          </button>
        );
      })}
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};
