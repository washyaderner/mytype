import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <main className="max-w-2xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          MyType
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Beautiful, one-question-at-a-time forms
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/builder"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Form
          </Link>
          <Link
            href="/forms"
            className="px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
          >
            View Forms
          </Link>
        </div>
      </main>
    </div>
  );
}
