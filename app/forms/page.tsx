'use client';

import { useFormStore } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FormsPage() {
  const { forms, responses, deleteForm } = useFormStore();
  const router = useRouter();

  const getResponseCount = (formId: string) => {
    return responses.filter(r => r.formId === formId).length;
  };

  const handleDelete = (e: React.MouseEvent, formId: string, formTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${formTitle}"? This action cannot be undone.`)) {
      deleteForm(formId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
          <Link
            href="/builder"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create New Form
          </Link>
        </div>

        {forms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h2>
            <p className="text-gray-600 mb-6">Create your first form to get started</p>
            <Link
              href="/builder"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {forms.map((form) => {
              const responseCount = getResponseCount(form.id);
              return (
                <div
                  key={form.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h2>
                      {form.description && (
                        <p className="text-gray-600 mb-4">{form.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{form.fields.length} questions</span>
                        <span>•</span>
                        <span>{responseCount} {responseCount === 1 ? 'response' : 'responses'}</span>
                        <span>•</span>
                        <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, form.id, form.title)}
                      className="text-gray-400 hover:text-red-600 p-2"
                      title="Delete form"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/forms/${form.id}`}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      View Form
                    </Link>
                    <Link
                      href={`/builder?id=${form.id}`}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/responses/${form.id}`}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Responses ({responseCount})
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
