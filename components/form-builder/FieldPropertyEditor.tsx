'use client';

import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import type { FieldConfig, Choice } from '@/types';
import { Input, Textarea, Select, Button, Card, CardHeader, CardContent } from '@/components/ui';
import { MAX_LENGTHS } from '@/utils/security';

interface FieldPropertyEditorProps {
  field: FieldConfig | null;
  onUpdateField: (updates: Partial<FieldConfig>) => void;
  onClose: () => void;
}

/**
 * Field Property Editor Component
 *
 * SECURITY: All input values are validated and sanitized through Input/Textarea components
 */
export const FieldPropertyEditor: React.FC<FieldPropertyEditorProps> = ({
  field,
  onUpdateField,
  onClose,
}) => {
  const [localField, setLocalField] = useState<FieldConfig | null>(field);

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  if (!localField) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <p className="text-gray-500 text-center">Select a field to edit its properties</p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<FieldConfig>) => {
    const updated = { ...localField, ...updates };
    setLocalField(updated);
    onUpdateField(updates);
  };

  const handleAddChoice = () => {
    const newChoice: Choice = {
      id: nanoid(),
      label: 'New Option',
      value: `option_${(localField.choices?.length || 0) + 1}`,
    };
    handleUpdate({
      choices: [...(localField.choices || []), newChoice],
    });
  };

  const handleUpdateChoice = (choiceId: string, updates: Partial<Choice>) => {
    const updatedChoices = localField.choices?.map((choice) =>
      choice.id === choiceId ? { ...choice, ...updates } : choice
    );
    handleUpdate({ choices: updatedChoices });
  };

  const handleDeleteChoice = (choiceId: string) => {
    const updatedChoices = localField.choices?.filter((c) => c.id !== choiceId);
    handleUpdate({ choices: updatedChoices });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Field Properties</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Basic Properties */}
        <Card padding="sm">
          <CardHeader title="Basic Settings" />
          <CardContent className="space-y-4">
            <Input
              label="Question Title"
              value={localField.title}
              onChange={(value) => handleUpdate({ title: value })}
              placeholder="Enter your question..."
              maxLength={MAX_LENGTHS.FIELD_TITLE}
              maxSanitizedLength={MAX_LENGTHS.FIELD_TITLE}
            />

            <Textarea
              label="Description (optional)"
              value={localField.description || ''}
              onChange={(value) => handleUpdate({ description: value })}
              placeholder="Add helpful context..."
              rows={3}
              maxLength={MAX_LENGTHS.FIELD_DESCRIPTION}
              maxSanitizedLength={MAX_LENGTHS.FIELD_DESCRIPTION}
            />

            {['short_text', 'long_text', 'email', 'phone', 'url', 'number'].includes(localField.type) && (
              <Input
                label="Placeholder Text (optional)"
                value={localField.placeholder || ''}
                onChange={(value) => handleUpdate({ placeholder: value })}
                placeholder="Placeholder text..."
                maxLength={MAX_LENGTHS.FIELD_TITLE}
                maxSanitizedLength={MAX_LENGTHS.FIELD_TITLE}
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={localField.required || false}
                onChange={(e) => handleUpdate({ required: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">Required field</span>
            </label>
          </CardContent>
        </Card>

        {/* Choices (for multiple_choice, dropdown) */}
        {['multiple_choice', 'dropdown'].includes(localField.type) && (
          <Card padding="sm">
            <CardHeader title="Choices" />
            <CardContent className="space-y-3">
              {localField.choices?.map((choice, index) => (
                <div key={choice.id} className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{index + 1}.</span>
                  <Input
                    value={choice.label}
                    onChange={(value) =>
                      handleUpdateChoice(choice.id, { label: value, value: value.toLowerCase().replace(/\s+/g, '_') })
                    }
                    placeholder="Option label..."
                    className="flex-1"
                    maxLength={MAX_LENGTHS.CHOICE_LABEL}
                    maxSanitizedLength={MAX_LENGTHS.CHOICE_LABEL}
                  />
                  <button
                    onClick={() => handleDeleteChoice(choice.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                    title="Delete choice"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={handleAddChoice} className="w-full">
                + Add Choice
              </Button>

              {localField.type === 'multiple_choice' && (
                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={localField.allowMultiple || false}
                    onChange={(e) => handleUpdate({ allowMultiple: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Allow multiple selections</span>
                </label>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={localField.allowOther || false}
                  onChange={(e) => handleUpdate({ allowOther: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Allow &quot;Other&quot; option</span>
              </label>
            </CardContent>
          </Card>
        )}

        {/* Text Length Limits */}
        {['short_text', 'long_text'].includes(localField.type) && (
          <Card padding="sm">
            <CardHeader title="Text Limits" />
            <CardContent className="space-y-4">
              <Input
                label="Minimum Length"
                type="number"
                value={localField.minLength?.toString() || ''}
                onChange={(value) => handleUpdate({ minLength: value ? parseInt(value, 10) : undefined })}
                placeholder="No minimum"
                min={0}
                max={MAX_LENGTHS.LONG_TEXT}
              />
              <Input
                label="Maximum Length"
                type="number"
                value={localField.maxLength?.toString() || ''}
                onChange={(value) => handleUpdate({ maxLength: value ? parseInt(value, 10) : undefined })}
                placeholder="No maximum"
                min={1}
                max={MAX_LENGTHS.LONG_TEXT}
              />
            </CardContent>
          </Card>
        )}

        {/* Number Range */}
        {localField.type === 'number' && (
          <Card padding="sm">
            <CardHeader title="Number Range" />
            <CardContent className="space-y-4">
              <Input
                label="Minimum Value"
                type="number"
                value={localField.min?.toString() || ''}
                onChange={(value) => handleUpdate({ min: value ? parseFloat(value) : undefined })}
                placeholder="No minimum"
              />
              <Input
                label="Maximum Value"
                type="number"
                value={localField.max?.toString() || ''}
                onChange={(value) => handleUpdate({ max: value ? parseFloat(value) : undefined })}
                placeholder="No maximum"
              />
              <Input
                label="Step"
                type="number"
                value={localField.step?.toString() || '1'}
                onChange={(value) => handleUpdate({ step: value ? parseFloat(value) : 1 })}
                placeholder="1"
                min={0.01}
              />
            </CardContent>
          </Card>
        )}

        {/* Rating Settings */}
        {localField.type === 'rating' && (
          <Card padding="sm">
            <CardHeader title="Rating Settings" />
            <CardContent className="space-y-4">
              <Select
                label="Number of Stars"
                value={localField.steps?.toString() || '5'}
                onChange={(value) => handleUpdate({ steps: parseInt(value, 10) })}
                options={[
                  { value: '3', label: '3 stars' },
                  { value: '4', label: '4 stars' },
                  { value: '5', label: '5 stars' },
                  { value: '7', label: '7 stars' },
                  { value: '10', label: '10 stars' },
                ]}
              />
              <Select
                label="Shape"
                value={localField.shape || 'star'}
                onChange={(value) => handleUpdate({ shape: value as any })}
                options={[
                  { value: 'star', label: 'Star ⭐' },
                  { value: 'heart', label: 'Heart ❤️' },
                  { value: 'thumbs', label: 'Thumbs 👍' },
                  { value: 'numbers', label: 'Numbers 1-5' },
                ]}
              />
            </CardContent>
          </Card>
        )}

        {/* Opinion Scale Settings */}
        {localField.type === 'opinion_scale' && (
          <Card padding="sm">
            <CardHeader title="Scale Settings" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum"
                  type="number"
                  value={localField.min?.toString() || '1'}
                  onChange={(value) => handleUpdate({ min: parseInt(value, 10) })}
                  min={0}
                  max={100}
                />
                <Input
                  label="Maximum"
                  type="number"
                  value={localField.max?.toString() || '10'}
                  onChange={(value) => handleUpdate({ max: parseInt(value, 10) })}
                  min={1}
                  max={100}
                />
              </div>
              <Input
                label="Start Label"
                value={localField.startLabel || ''}
                onChange={(value) => handleUpdate({ startLabel: value })}
                placeholder="e.g., Not likely"
                maxLength={100}
              />
              <Input
                label="End Label"
                value={localField.endLabel || ''}
                onChange={(value) => handleUpdate({ endLabel: value })}
                placeholder="e.g., Very likely"
                maxLength={100}
              />
            </CardContent>
          </Card>
        )}

        {/* Statement Button Text */}
        {localField.type === 'statement' && (
          <Card padding="sm">
            <CardHeader title="Button Settings" />
            <CardContent>
              <Input
                label="Button Text"
                value={localField.buttonText || 'Continue'}
                onChange={(value) => handleUpdate({ buttonText: value })}
                placeholder="Continue"
                maxLength={50}
              />
            </CardContent>
          </Card>
        )}

        {/* File Upload Settings */}
        {localField.type === 'file_upload' && (
          <Card padding="sm">
            <CardHeader title="Upload Settings" />
            <CardContent className="space-y-4">
              <Input
                label="Maximum File Size (MB)"
                type="number"
                value={(localField.maxFileSize ? localField.maxFileSize / 1024 / 1024 : 10).toString()}
                onChange={(value) => handleUpdate({ maxFileSize: parseFloat(value) * 1024 * 1024 })}
                min={1}
                max={100}
              />
              <Input
                label="Maximum Files"
                type="number"
                value={localField.maxFiles?.toString() || '1'}
                onChange={(value) => handleUpdate({ maxFiles: parseInt(value, 10) })}
                min={1}
                max={10}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
