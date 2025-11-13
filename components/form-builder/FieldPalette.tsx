'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { FieldType } from '@/types';
import { getFieldTypeLabel } from '@/utils/form-helpers';
import { Card } from '@/components/ui';

/**
 * Field types grouped by category for better organization
 */
const FIELD_CATEGORIES = [
  {
    name: 'Text Inputs',
    fields: ['short_text', 'long_text', 'email', 'phone', 'url'] as FieldType[],
  },
  {
    name: 'Numbers & Dates',
    fields: ['number', 'date'] as FieldType[],
  },
  {
    name: 'Choices',
    fields: ['multiple_choice', 'dropdown', 'yes_no'] as FieldType[],
  },
  {
    name: 'Ratings',
    fields: ['rating', 'opinion_scale'] as FieldType[],
  },
  {
    name: 'Media & Content',
    fields: ['file_upload', 'statement'] as FieldType[],
  },
];

/**
 * Icons for each field type
 */
const FIELD_ICONS: Record<FieldType, string> = {
  short_text: '📝',
  long_text: '📄',
  email: '📧',
  phone: '📞',
  url: '🔗',
  number: '🔢',
  date: '📅',
  multiple_choice: '☑️',
  dropdown: '📋',
  yes_no: '✓✗',
  rating: '⭐',
  opinion_scale: '📊',
  file_upload: '📎',
  statement: '💬',
};

interface DraggableFieldItemProps {
  fieldType: FieldType;
}

/**
 * Draggable field item in the palette
 */
const DraggableFieldItem: React.FC<DraggableFieldItemProps> = ({ fieldType }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${fieldType}`,
    data: {
      type: 'new-field',
      fieldType,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200
        bg-white hover:bg-purple-50 hover:border-purple-300
        cursor-move transition-all
        ${isDragging ? 'opacity-50' : 'opacity-100'}
      `}
    >
      <span className="text-2xl" aria-hidden="true">
        {FIELD_ICONS[fieldType]}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {getFieldTypeLabel(fieldType)}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
        />
      </svg>
    </div>
  );
};

/**
 * Field Palette Component
 *
 * Displays all available field types that can be dragged to the canvas
 */
export const FieldPalette: React.FC = () => {
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add Fields
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Drag and drop fields to your form
        </p>

        <div className="space-y-6">
          {FIELD_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.fields.map((fieldType) => (
                  <DraggableFieldItem key={fieldType} fieldType={fieldType} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
