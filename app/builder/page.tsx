'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DndContext } from '@dnd-kit/core';
import { useFormStore } from '@/lib/store';
import { getDefaultFieldConfig } from '@/utils/form-helpers';
import { sanitizeFormConfig } from '@/utils/security';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FieldPalette } from '@/components/form-builder/FieldPalette';
import { FormCanvas } from '@/components/form-builder/FormCanvas';
import { FieldPropertyEditor } from '@/components/form-builder/FieldPropertyEditor';
import { FormSettingsPanel } from '@/components/form-builder/FormSettingsPanel';
import { Button, Input } from '@/components/ui';
import type { FieldType, FieldConfig } from '@/types';

/**
 * Form Builder Component (inner)
 *
 * SECURITY: All user inputs sanitized through security utilities
 * Error boundaries prevent crashes from exposing sensitive data
 */
function BuilderComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formId = searchParams.get('id');

  const {
    forms,
    createForm,
    updateForm,
    getForm,
    addField,
    updateField,
    deleteField,
    reorderFields,
    setCurrentForm,
  } = useFormStore();

  const [currentFormId, setCurrentFormId] = useState<string | null>(formId);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'fields' | 'settings'>('fields');
  const [isSaving, setIsSaving] = useState(false);

  // Load form on mount or when ID changes
  useEffect(() => {
    if (formId && forms.length > 0) {
      const form = getForm(formId);
      if (form) {
        setCurrentFormId(formId);
        setCurrentForm(formId);
      } else {
        // Form not found, create new
        handleCreateNewForm();
      }
    } else if (!currentFormId && forms.length === 0) {
      // No forms exist, create first one
      handleCreateNewForm();
    } else if (!currentFormId && forms.length > 0) {
      // No form selected, load first one
      setCurrentFormId(forms[0].id);
      setCurrentForm(forms[0].id);
      router.push(`/builder?id=${forms[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, forms.length]);

  const currentForm = currentFormId ? getForm(currentFormId) : null;
  const selectedField = selectedFieldId
    ? currentForm?.fields.find((f) => f.id === selectedFieldId)
    : null;

  const handleCreateNewForm = () => {
    const newForm = createForm({
      title: 'Untitled Form',
      description: '',
      fields: [],
      settings: {
        theme: 'light',
        showProgressBar: true,
        progressBarType: 'percentage',
        allowBackNavigation: true,
        oneQuestionAtATime: true,
        submitButtonText: 'Submit',
        showThankYouMessage: true,
        thankYouMessage: 'Thank you for your response!',
      },
    });

    setCurrentFormId(newForm.id);
    setCurrentForm(newForm.id);
    router.push(`/builder?id=${newForm.id}`);
  };

  const handleSwitchForm = (formId: string) => {
    setCurrentFormId(formId);
    setCurrentForm(formId);
    setSelectedFieldId(null);
    router.push(`/builder?id=${formId}`);
  };

  const handleAddField = (fieldType: FieldType) => {
    if (!currentFormId) return;

    const defaultConfig = getDefaultFieldConfig(fieldType);
    addField(currentFormId, defaultConfig);

    // Auto-select the new field (it will be the last one)
    const form = getForm(currentFormId);
    if (form && form.fields.length > 0) {
      const lastField = form.fields[form.fields.length - 1];
      setSelectedFieldId(lastField.id);
    }
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FieldConfig>) => {
    if (!currentFormId) return;
    updateField(currentFormId, fieldId, updates);
  };

  const handleDeleteField = (fieldId: string) => {
    if (!currentFormId) return;
    deleteField(currentFormId, fieldId);
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleReorderFields = (fieldIds: string[]) => {
    if (!currentFormId) return;
    reorderFields(currentFormId, fieldIds);
  };

  const handleUpdateFormTitle = (title: string) => {
    if (!currentFormId) return;
    updateForm(currentFormId, { title });
  };

  const handleUpdateFormDescription = (description: string) => {
    if (!currentFormId) return;
    updateForm(currentFormId, { description });
  };

  const handleUpdateSettings = (updates: any) => {
    if (!currentFormId || !currentForm) return;
    updateForm(currentFormId, {
      settings: { ...currentForm.settings, ...updates },
    });
  };

  const handlePreview = () => {
    if (currentFormId) {
      window.open(`/forms/${currentFormId}`, '_blank');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay (in real app, this would sync to backend)
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
  };

  if (!currentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-white">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => router.push('/forms')}
              className="text-gray-600 hover:text-gray-900"
              title="Back to forms"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex-1 max-w-md">
              <Input
                value={currentForm.title}
                onChange={handleUpdateFormTitle}
                placeholder="Form title..."
                className="text-lg font-semibold border-0 focus:ring-0 px-2"
                sanitize={true}
              />
            </div>

            {forms.length > 1 && (
              <select
                value={currentFormId || ''}
                onChange={(e) => handleSwitchForm(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
              >
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>
                    {form.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCreateNewForm}>
              + New Form
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePreview}>
              Preview
            </Button>
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>
              {isSaving ? 'Saving...' : 'Saved'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => {
              setActivePanel('fields');
              setSelectedFieldId(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePanel === 'fields'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Fields
          </button>
          <button
            onClick={() => {
              setActivePanel('settings');
              setSelectedFieldId(null);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activePanel === 'settings'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {activePanel === 'fields' ? (
            <>
              <FieldPalette />
              <FormCanvas
                fields={currentForm.fields}
                selectedFieldId={selectedFieldId}
                onAddField={handleAddField}
                onSelectField={setSelectedFieldId}
                onDeleteField={handleDeleteField}
                onReorderFields={handleReorderFields}
              />
              <FieldPropertyEditor
                field={selectedField || null}
                onUpdateField={(updates) => {
                  if (selectedFieldId) {
                    handleUpdateField(selectedFieldId, updates);
                  }
                }}
                onClose={() => setSelectedFieldId(null)}
              />
            </>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto">
                <FormSettingsPanel
                  settings={currentForm.settings}
                  onUpdateSettings={handleUpdateSettings}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

/**
 * Form Builder Page (wrapper with Suspense)
 */
export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
          </div>
        </div>
      }
    >
      <BuilderComponent />
    </Suspense>
  );
}
