import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            MyType
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-medium">
            Beautiful, one-question-at-a-time forms
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            A lightweight Typeform clone with drag-and-drop builder, smooth animations,
            webhook integrations, and zero dependencies on external services.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/builder"
              className="px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Create Your First Form
            </Link>
            <Link
              href="/forms"
              className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 text-lg font-semibold rounded-lg hover:bg-purple-50 transition-colors"
            >
              View My Forms
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Drag & Drop Builder</h3>
            <p className="text-gray-600">
              Create forms visually with 14 field types, real-time preview, and intuitive drag-and-drop interface.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Beautiful Animations</h3>
            <p className="text-gray-600">
              Smooth Motion animations with spring physics for a delightful one-question-at-a-time experience.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Webhook Integrations</h3>
            <p className="text-gray-600">
              Connect to Make.com, n8n, Zapier, or custom endpoints with automatic retry and authentication support.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Security First</h3>
            <p className="text-gray-600">
              OWASP-compliant with XSS prevention, input sanitization, CSRF protection, and secure headers.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">LocalStorage Persistence</h3>
            <p className="text-gray-600">
              All data stored locally in your browser. No external database needed for the MVP.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Export & Share</h3>
            <p className="text-gray-600">
              Export forms as JSON, import for duplication, share public URLs, and export responses as CSV.
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Quick Start Guide</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Create Form</h4>
              <p className="text-sm text-gray-600">
                Click &ldquo;Create Your First Form&rdquo; and drag fields from the palette
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Configure</h4>
              <p className="text-sm text-gray-600">
                Customize fields, set up webhooks, and configure form settings
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Share</h4>
              <p className="text-sm text-gray-600">
                Click &ldquo;Share Link&rdquo; to copy the form URL and send to respondents
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">View Responses</h4>
              <p className="text-sm text-gray-600">
                Check responses in real-time and export to CSV for analysis
              </p>
            </div>
          </div>
        </div>

        {/* Field Types */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">14 Field Types Included</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Short Text',
              'Long Text',
              'Email',
              'Phone',
              'URL',
              'Number',
              'Date',
              'Multiple Choice',
              'Dropdown',
              'Yes/No',
              'Rating',
              'Opinion Scale',
              'File Upload',
              'Statement',
            ].map((field) => (
              <div key={field} className="flex items-center gap-2 text-gray-700">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{field}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Built With</h2>
          <p className="text-gray-600 mb-4">
            Next.js 14 • TypeScript • Tailwind CSS • Zustand • Motion • @dnd-kit
          </p>
          <p className="text-sm text-gray-500">
            Open source • MIT License • Ready for production
          </p>
        </div>
      </div>
    </div>
  );
}
