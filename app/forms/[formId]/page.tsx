'use client';

import { useFormStore } from '@/lib/store';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function FormPage() {
  const params = useParams();
  const formId = params.formId as string;
  const { getForm } = useFormStore();
  const form = getForm(formId);

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-md">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600 mb-8">{form.description}</p>
          )}

          <div className="space-y-6">
            <p className="text-gray-700">
              This form has {form.fields.length} question{form.fields.length !== 1 ? 's' : ''}.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                📝 Form renderer will be implemented in upcoming features. For now, you can view the form structure in the builder.
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/forms"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Forms
              </Link>
              <Link
                href="/builder"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit in Builder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
