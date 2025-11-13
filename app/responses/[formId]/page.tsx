'use client';

import { useFormStore } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * Responses Viewer Page
 *
 * Displays all submitted responses for a specific form
 */
export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;

  const { getForm, getResponses, deleteResponse } = useFormStore();
  const form = getForm(formId);
  const responses = getResponses(formId);

  const handleDeleteResponse = (responseId: string) => {
    if (confirm('Delete this response? This action cannot be undone.')) {
      deleteResponse(responseId);
    }
  };

  const handleExportCSV = () => {
    if (!form || responses.length === 0) return;

    // Build CSV header
    const headers = ['Response ID', 'Submitted At', ...form.fields.map(f => f.title)];

    // Build CSV rows
    const rows = responses.map(response => {
      const row = [
        response.id,
        new Date(response.completedAt || response.startedAt).toLocaleString(),
      ];

      // Add field values in order
      form.fields.forEach(field => {
        const fieldResponse = response.responses.find(r => r.fieldId === field.id);
        const value = fieldResponse?.value;

        // Format value for CSV
        let formattedValue = '';
        if (Array.isArray(value)) {
          formattedValue = value.join(', ');
        } else if (typeof value === 'object' && value !== null) {
          formattedValue = JSON.stringify(value);
        } else if (value !== undefined && value !== null) {
          formattedValue = String(value);
        }

        // Escape quotes for CSV
        formattedValue = formattedValue.replace(/"/g, '""');
        row.push(`"${formattedValue}"`);
      });

      return row.join(',');
    });

    // Combine and download
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${form.title.toLowerCase().replace(/\s+/g, '-')}-responses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Form Not Found</h1>
          <Link
            href="/forms"
            className="text-purple-600 hover:text-purple-700"
          >
            Back to Forms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/forms"
            className="text-purple-600 hover:text-purple-700 text-sm mb-2 inline-block"
          >
            ← Back to Forms
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-gray-600 mt-1">
                {responses.length} {responses.length === 1 ? 'response' : 'responses'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/builder?id=${formId}`}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Form
              </Link>
              {responses.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Responses */}
        {responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h2>
            <p className="text-gray-600 mb-6">
              Share your form to start collecting responses
            </p>
            <Link
              href={`/forms/${formId}`}
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Form
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {responses
              .sort((a, b) => {
                const dateA = new Date(a.completedAt || a.startedAt).getTime();
                const dateB = new Date(b.completedAt || b.startedAt).getTime();
                return dateB - dateA; // Most recent first
              })
              .map((response, index) => (
                <div key={response.id} className="bg-white rounded-lg shadow-md p-6">
                  {/* Response Header */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Response #{responses.length - index}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(response.completedAt || response.startedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteResponse(response.id)}
                      className="text-gray-400 hover:text-red-600 p-2"
                      title="Delete response"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Response Data */}
                  <div className="space-y-4">
                    {form.fields.map((field) => {
                      const fieldResponse = response.responses.find(
                        (r) => r.fieldId === field.id
                      );

                      if (!fieldResponse) return null;

                      let displayValue: string | React.ReactNode = '';

                      // Format value based on type
                      if (fieldResponse.value === null || fieldResponse.value === undefined) {
                        displayValue = <span className="text-gray-400 italic">No answer</span>;
                      } else if (Array.isArray(fieldResponse.value)) {
                        displayValue = fieldResponse.value.join(', ');
                      } else if (typeof fieldResponse.value === 'boolean') {
                        displayValue = fieldResponse.value ? 'Yes' : 'No';
                      } else if (typeof fieldResponse.value === 'object') {
                        displayValue = JSON.stringify(fieldResponse.value, null, 2);
                      } else {
                        displayValue = String(fieldResponse.value);
                      }

                      return (
                        <div key={field.id} className="border-l-2 border-purple-200 pl-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {field.title}
                          </p>
                          <p className="text-gray-900">{displayValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
