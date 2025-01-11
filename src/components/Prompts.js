import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faBookmark } from '@fortawesome/free-solid-svg-icons';

function Prompts({ darkMode }) {
  const [recentPrompts, setRecentPrompts] = useState([]);
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch recent prompts
      const recentRes = await fetch('http://localhost:3001/api/prompts/recent', { headers });
      const recentData = await recentRes.json();
      setRecentPrompts(recentData);

      // Fetch saved prompts
      const savedRes = await fetch('http://localhost:3001/api/prompts/saved', { headers });
      const savedData = await savedRes.json();
      setSavedPrompts(savedData);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
            ${activeTab === 'recent' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
          <span>Recent</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
            ${activeTab === 'saved' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
          <span>Saved</span>
        </button>
      </div>

      <div className="space-y-4">
        {(activeTab === 'recent' ? recentPrompts : savedPrompts).map((prompt) => (
          <div 
            key={prompt.id}
            className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm
                     border border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-800 dark:text-gray-200">{prompt.content}</p>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {new Date(prompt.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Prompts; 