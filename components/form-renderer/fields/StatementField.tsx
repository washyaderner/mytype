'use client';

import React from 'react';
import type { FieldConfig } from '@/types';

interface StatementFieldProps {
  field: FieldConfig;
  onContinue: () => void;
}

/**
 * Statement Field Renderer
 */
export const StatementField: React.FC<StatementFieldProps> = ({
  field,
  onContinue,
}) => {
  return (
    <div className="w-full text-center">
      {field.description && (
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          {field.description}
        </p>
      )}
      <button
        type="button"
        onClick={onContinue}
        className="px-12 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-200"
      >
        {field.buttonText || 'Continue'}
      </button>
    </div>
  );
};
