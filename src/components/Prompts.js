import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

function Prompts({ darkMode, refreshTrigger }) {
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching saved prompts...');
    fetchPrompts();
  }, [refreshTrigger]);

  const fetchPrompts = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const isGuest = localStorage.getItem('isGuest');
      
      console.log('Token:', token);
      console.log('Is Guest:', isGuest);
      
      if (!token || isGuest === 'true') {
        console.log('No token or guest user, setting empty prompts');
        setSavedPrompts([]);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/prompts/saved', { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch saved prompts');
      }

      const data = await response.json();
      console.log('Received saved prompts:', data);
      setSavedPrompts(data);

    } catch (error) {
      console.error('Error fetching prompts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (promptId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || token === 'guest-token') {
        console.error('Must be logged in to manage prompts');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/prompts/${promptId}/toggle-save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle save status');
      }

      // Refresh the prompts list
      fetchPrompts();
    } catch (error) {
      console.error('Error toggling save status:', error);
      setError(error.message);
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

  return (
    <div className={`h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center mb-6">
          <h2 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FontAwesomeIcon icon={faBookmark} className="mr-2" />
            Saved Prompts
          </h2>
        </div>

        {savedPrompts.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No saved prompts found.
          </div>
        ) : (
          <div className="space-y-4">
            {savedPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className={`p-4 rounded-lg shadow transition-shadow hover:shadow-md ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-200' 
                    : 'bg-white text-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                    {prompt.content}
                  </p>
                  <button
                    onClick={() => handleToggleSave(prompt.id)}
                    className={`ml-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-yellow-500`}
                  >
                    <FontAwesomeIcon icon={faBookmark} />
                  </button>
                </div>
                <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(prompt.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Prompts;