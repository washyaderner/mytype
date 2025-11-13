'use client';

import React from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FieldConfig, FieldType } from '@/types';
import { getFieldTypeLabel } from '@/utils/form-helpers';
import { Button } from '@/components/ui';

interface FormCanvasProps {
  fields: FieldConfig[];
  selectedFieldId: string | null;
  onAddField: (fieldType: FieldType) => void;
  onSelectField: (fieldId: string | null) => void;
  onDeleteField: (fieldId: string) => void;
  onReorderFields: (fieldIds: string[]) => void;
}

interface SortableFieldItemProps {
  field: FieldConfig;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

/**
 * Sortable field item in the canvas
 */
const SortableFieldItem: React.FC<SortableFieldItemProps> = ({
  field,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative p-4 rounded-lg border-2 bg-white
        ${isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        hover:border-purple-300 transition-all cursor-pointer
      `}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
      >
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
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Field content */}
      <div className="ml-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-purple-600 uppercase">
                {getFieldTypeLabel(field.type)}
              </span>
              {field.required && (
                <span className="text-xs text-red-500">*</span>
              )}
            </div>
            <h3 className="text-base font-medium text-gray-900">
              {field.title || 'Untitled Question'}
            </h3>
            {field.description && (
              <p className="text-sm text-gray-600 mt-1">{field.description}</p>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="ml-4 p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete field"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        {/* Field preview */}
        <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
          {field.type === 'short_text' && (
            <input
              type="text"
              placeholder={field.placeholder || 'Type your answer...'}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              disabled
            />
          )}
          {field.type === 'long_text' && (
            <textarea
              placeholder={field.placeholder || 'Type your answer...'}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white resize-none"
              rows={3}
              disabled
            />
          )}
          {field.type === 'multiple_choice' && field.choices && (
            <div className="space-y-2">
              {field.choices.map((choice) => (
                <label key={choice.id} className="flex items-center gap-2">
                  <input
                    type={field.allowMultiple ? 'checkbox' : 'radio'}
                    disabled
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">{choice.label}</span>
                </label>
              ))}
            </div>
          )}
          {field.type === 'dropdown' && field.choices && (
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              disabled
            >
              <option>Select an option...</option>
              {field.choices.map((choice) => (
                <option key={choice.id}>{choice.label}</option>
              ))}
            </select>
          )}
          {['email', 'phone', 'url', 'number'].includes(field.type) && (
            <input
              type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : 'text'}
              placeholder={field.placeholder || `Enter ${field.type}...`}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              disabled
            />
          )}
          {field.type === 'date' && (
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              disabled
            />
          )}
          {field.type === 'yes_no' && (
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-green-100 text-green-700 rounded" disabled>
                Yes
              </button>
              <button className="px-6 py-2 bg-red-100 text-red-700 rounded" disabled>
                No
              </button>
            </div>
          )}
          {field.type === 'rating' && (
            <div className="flex gap-2">
              {Array.from({ length: field.steps || 5 }).map((_, i) => (
                <span key={i} className="text-2xl text-gray-300">
                  ⭐
                </span>
              ))}
            </div>
          )}
          {field.type === 'opinion_scale' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{field.startLabel || 'Min'}</span>
              <input type="range" min={field.min || 1} max={field.max || 10} disabled className="flex-1" />
              <span className="text-xs text-gray-500">{field.endLabel || 'Max'}</span>
            </div>
          )}
          {field.type === 'file_upload' && (
            <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-500 mt-2">Upload files</p>
            </div>
          )}
          {field.type === 'statement' && (
            <div>
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded" disabled>
                {field.buttonText || 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Form Canvas Component
 *
 * Main drag-and-drop area for building forms
 */
export const FormCanvas: React.FC<FormCanvasProps> = ({
  fields,
  selectedFieldId,
  onAddField,
  onSelectField,
  onDeleteField,
  onReorderFields,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle new field from palette
    if (active.data.current?.type === 'new-field') {
      const fieldType = active.data.current.fieldType as FieldType;
      onAddField(fieldType);
      return;
    }

    // Handle reordering
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = [...fields];
        const [moved] = newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, moved);
        onReorderFields(newOrder.map((f) => f.id));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50 p-8">
        {fields.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-dashed border-gray-300">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No fields yet
              </h3>
              <p className="text-gray-600">
                Drag and drop fields from the left panel to start building your form
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            <SortableContext
              items={fields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableFieldItem
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => onSelectField(field.id)}
                  onDelete={() => onDeleteField(field.id)}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </DndContext>
  );
};
