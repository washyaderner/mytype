'use client';

import { useState } from 'react';
import { useFormStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DynamicForm } from '@/components/form-renderer/DynamicForm';
import { ThankYou } from '@/components/form-renderer/ThankYou';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/**
 * Public Form Page
 *
 * Displays forms to respondents with one-question-at-a-time experience
 * SECURITY: All responses sanitized before storage
 */
export default function FormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const { getForm, saveResponse } = useFormStore();
  const form = getForm(formId);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data: Record<string, any>) => {
    // Save response to store
    saveResponse({
      formId,
      responses: Object.entries(data).map(([fieldId, value]) => {
        const field = form?.fields.find((f) => f.id === fieldId);
        return {
          fieldId,
          fieldType: field?.type || 'short_text',
          value,
          timestamp: new Date().toISOString(),
        };
      }),
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      isComplete: true,
    });

    setIsSubmitted(true);

    // Log to console for MVP
    console.log('Form submitted:', {
      formId,
      formTitle: form?.title,
      responses: data,
    });
  };

  const handleSaveProgress = (data: Record<string, any>, currentStep: number) => {
    // Auto-save to localStorage (already handled by store persistence)
    console.log('Progress saved:', { formId, currentStep, data });
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h1>
          <p className="text-gray-600 mb-6">
            The form you&apos;re looking for doesn&apos;t exist or has been deleted.
          </p>
          <Link
            href="/forms"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Forms
          </Link>
        </div>
      </div>
    );
  }

  if (form.fields.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-md">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Empty Form</h1>
          <p className="text-gray-600 mb-6">
            This form doesn&apos;t have any questions yet.
          </p>
          <Link
            href={`/builder?id=${formId}`}
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Questions
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return <ThankYou settings={form.settings} />;
  }

  return (
    <ErrorBoundary>
      <DynamicForm
        form={form}
        onSubmit={handleSubmit}
        onSaveProgress={handleSaveProgress}
      />
    </ErrorBoundary>
  );
}
