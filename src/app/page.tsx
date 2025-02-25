import Link from "next/link";
import IdeaCapture from '@/components/IdeaCapture';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto pt-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Idea Capture
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Capture your thoughts as they come, export them when you need
          </p>
        </header>
      </div>
      <IdeaCapture />
    </main>
  );
}
