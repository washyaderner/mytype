'use client';

import { useFormStore } from '@/lib/store';
import { getDefaultFieldConfig } from '@/utils/form-helpers';
import { useState } from 'react';

export default function BuilderPage() {
  const { forms, createForm, updateForm, deleteForm, addField, duplicateForm } = useFormStore();
  const [testMessage, setTestMessage] = useState<string>('');

  const handleCreateTestForm = () => {
    const newForm = createForm({
      title: 'Test Form',
      description: 'This is a test form created from the builder',
      fields: [],
      settings: {
        theme: 'light',
        showProgressBar: true,
        progressBarType: 'percentage',
        allowBackNavigation: true,
        oneQuestionAtATime: true,
        submitButtonText: 'Submit',
        showSubmitButton: true,
        showThankYouMessage: true,
        thankYouMessage: 'Thank you for your response!',
      },
    });

    // Add some test fields
    addField(newForm.id, getDefaultFieldConfig('short_text'));
    addField(newForm.id, getDefaultFieldConfig('email'));
    addField(newForm.id, getDefaultFieldConfig('multiple_choice'));

    setTestMessage(`Created form: ${newForm.title} (ID: ${newForm.id})`);
  };

  const handleUpdateForm = (formId: string) => {
    updateForm(formId, {
      title: `Updated Form - ${new Date().toLocaleTimeString()}`,
    });
    setTestMessage(`Updated form: ${formId}`);
  };

  const handleDuplicateForm = (formId: string) => {
    const duplicated = duplicateForm(formId);
    if (duplicated) {
      setTestMessage(`Duplicated form: ${duplicated.title} (ID: ${duplicated.id})`);
    }
  };

  const handleDeleteForm = (formId: string) => {
    deleteForm(formId);
    setTestMessage(`Deleted form: ${formId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">Form Builder - Test Page</h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates Feature 1: Schema & Store Setup. You can create, update, and delete forms.
            All data persists to localStorage.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleCreateTestForm}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Test Form
            </button>

            {testMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">{testMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Stored Forms ({forms.length})
          </h2>

          {forms.length === 0 ? (
            <p className="text-gray-500">No forms yet. Create one to get started!</p>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <div
                  key={form.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{form.title}</h3>
                      {form.description && (
                        <p className="text-sm text-gray-600 mt-1">{form.description}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500">
                          ID: <span className="font-mono">{form.id}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Fields: {form.fields.length}
                        </p>
                        <p className="text-xs text-gray-500">
                          Created: {new Date(form.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          Updated: {new Date(form.updatedAt).toLocaleString()}
                        </p>
                      </div>

                      {form.fields.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Fields:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {form.fields.map((field, idx) => (
                              <li key={field.id} className="flex items-center gap-2">
                                <span className="text-gray-400">{idx + 1}.</span>
                                <span className="font-medium">{field.type}</span>
                                <span className="text-gray-500">-</span>
                                <span>{field.title || 'Untitled'}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleUpdateForm(form.id)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDuplicateForm(form.id)}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => handleDeleteForm(form.id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Feature 1 Status: ✅ Complete</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ TypeScript interfaces defined</li>
            <li>✅ Zustand store with localStorage persistence</li>
            <li>✅ Form management utilities</li>
            <li>✅ Zod schema generator</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
