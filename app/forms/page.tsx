'use client';

import { useFormStore } from '@/lib/store';
import Link from 'next/link';

export default function FormsPage() {
  const { forms } = useFormStore();

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
            {forms.map((form) => (
              <Link
                key={form.id}
                href={`/forms/${form.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h2>
                {form.description && (
                  <p className="text-gray-600 mb-4">{form.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{form.fields.length} questions</span>
                  <span>•</span>
                  <span>Created {new Date(form.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
