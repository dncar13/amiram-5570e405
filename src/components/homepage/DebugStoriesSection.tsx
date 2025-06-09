
import { useEffect, useState } from 'react';
import { getAvailableStories, Story } from '@/services/storyQuestionsService';

const DebugStoriesSection = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[DEBUG] DebugStoriesSection mounting');
    try {
      const availableStories = getAvailableStories();
      console.log('[DEBUG] Stories loaded:', availableStories);
      setStories(availableStories);
    } catch (err) {
      console.error('[DEBUG] Error loading stories:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="font-bold">DEBUG: Loading Stories...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="font-bold text-red-700">DEBUG: Error Loading Stories</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-bold text-blue-700">DEBUG: Stories Section</h3>
      <p className="text-blue-600">Found {stories.length} stories:</p>
      <ul className="list-disc list-inside mt-2">
        {stories.map((story, index) => (
          <li key={index} className="text-sm">
            <strong>{story.title}</strong> - {story.questionCount} questions ({story.difficulty})
          </li>
        ))}
      </ul>
      {stories.length === 0 && (
        <p className="text-red-600 mt-2">No stories found! Check console for debugging info.</p>
      )}
    </div>
  );
};

export default DebugStoriesSection;
