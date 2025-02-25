'use client';

import { useRef, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useLocalStorage } from '@/lib/hooks/useLocalStorage';

interface Idea {
  id: string;
  text: string;
  timestamp: Date;
}

export default function IdeaCapture() {
  const [mounted, setMounted] = useState(false);
  const [ideas, setIdeas] = useLocalStorage<Idea[]>('captured-ideas', []);
  const [newIdea, setNewIdea] = useLocalStorage<string>('draft-idea', '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (mounted) {
      scrollToBottom();
    }
  }, [ideas, mounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;

    const idea: Idea = {
      id: Date.now().toString(),
      text: newIdea.trim(),
      timestamp: new Date(),
    };

    setIdeas([...ideas, idea]);
    setNewIdea('');
  };

  const exportToObsidian = async (idea: Idea) => {
    const content = `# Idea Captured on ${format(new Date(idea.timestamp), 'PPpp')}\n\n${idea.text}`;
    
    try {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `idea-${format(new Date(idea.timestamp), 'yyyy-MM-dd-HH-mm-ss')}.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Obsidian:', error);
    }
  };

  const handleDelete = (ideaId: string) => {
    setIdeas(ideas.filter(idea => idea.id !== ideaId));
  };

  if (!mounted) {
    return <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto" />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto mb-4 flex flex-col justify-end">
        <div className="space-y-4 p-4">
          {ideas.map((idea) => (
            <div key={idea.id} className="flex flex-col group">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg max-w-[85%] relative group-hover:opacity-95">
                <p className="text-gray-800 dark:text-gray-100">{idea.text}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                  {format(new Date(idea.timestamp), 'p')}
                </span>
                <div className="absolute right-2 top-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => exportToObsidian(idea)}
                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md"
                    title="Export to Obsidian"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm hover:shadow-md hover:bg-red-50 dark:hover:bg-red-900"
                    title="Delete idea"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Type your idea here..."
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send
        </button>
      </form>
    </div>
  );
} 