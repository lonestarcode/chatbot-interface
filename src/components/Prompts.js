import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faClock } from '@fortawesome/free-solid-svg-icons';

function Prompts({ darkMode, refreshTrigger }) {
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [activeTab, setActiveTab] = useState('saved');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, [refreshTrigger]);

  const fetchPrompts = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const isGuest = localStorage.getItem('isGuest');
      
      console.log('Fetching prompts with token:', token);
      console.log('Is guest?', isGuest);
      
      if (!token || isGuest === 'true') {
        setSavedPrompts([]);
        setRecentPrompts([]);
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const savedRes = await fetch('http://localhost:3001/api/prompts/saved', { 
        method: 'GET',
        headers
      });

      console.log('Saved prompts response status:', savedRes.status);
      
      if (!savedRes.ok) {
        const errorData = await savedRes.json();
        throw new Error(errorData.error || 'Failed to fetch saved prompts');
      }

      const savedData = await savedRes.json();
      console.log('Received saved prompts:', savedData);
      setSavedPrompts(savedData);

      const recentRes = await fetch('http://localhost:3001/api/prompts/recent', { 
        method: 'GET',
        headers
      });

      if (!recentRes.ok) {
        const errorData = await recentRes.json();
        throw new Error(errorData.error || 'Failed to fetch recent prompts');
      }

      const recentData = await recentRes.json();
      setRecentPrompts(recentData);

    } catch (error) {
      console.error('Error fetching prompts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="text-gray-600 dark:text-gray-400">
          Loading prompts...
        </div>
      </div>
    );
  }

  const prompts = activeTab === 'saved' ? savedPrompts : recentPrompts;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'saved'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Saved Prompts
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'recent'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Recent Prompts
        </button>
      </div>

      {prompts.length === 0 ? (
        <div className="text-gray-600 dark:text-gray-400">
          No {activeTab} prompts found.
        </div>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <p className="text-gray-800 dark:text-gray-200">{prompt.content}</p>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {new Date(prompt.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Prompts;