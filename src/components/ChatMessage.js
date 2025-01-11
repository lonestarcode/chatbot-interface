import React, { useState } from 'react';
import { formatMessage } from '../utils/messageFormatter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy, faBookmark as faBookmarkSolid, faBookmark as faBookmarkRegular } from '@fortawesome/free-solid-svg-icons';

function ChatMessage({ message, isBot, darkMode, onSavePrompt, isSaved }) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePrompt = async () => {
    setSaving(true);
    const success = await onSavePrompt(message);
    if (!success) {
      // Reset saving state if failed
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 px-4">
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} group items-end`}>
        <div className={`max-w-[85%] rounded-lg p-4 transform transition-all duration-200 ease-out prose prose-sm
          ${isBot 
            ? 'bg-gray-300 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          } shadow-sm hover:shadow-md`}
        >
          {isBot ? formatMessage(message) : message}
        </div>
        {isBot && (
          <div className="flex gap-2">
            <button
              onClick={handleCopyMessage}
              className="ml-2 p-2 text-gray-500 dark:text-gray-400 
                       hover:text-gray-700 dark:hover:text-gray-200 
                       bg-gray-300/50 dark:bg-gray-800/50 
                       hover:bg-gray-300/70 dark:hover:bg-gray-800/70 
                       rounded transition-all opacity-0 group-hover:opacity-100"
            >
              <FontAwesomeIcon 
                icon={copied ? faCheck : faCopy} 
                className="w-4 h-4"
              />
            </button>
            <button
              onClick={handleSavePrompt}
              disabled={saving || isSaved}
              className={`p-2 text-gray-500 dark:text-gray-400 
                       hover:text-gray-700 dark:hover:text-gray-200 
                       bg-gray-300/50 dark:bg-gray-800/50 
                       hover:bg-gray-300/70 dark:hover:bg-gray-800/70 
                       rounded transition-all opacity-0 group-hover:opacity-100
                       ${saving ? 'animate-pulse' : ''}`}
            >
              <FontAwesomeIcon 
                icon={isSaved ? faBookmarkSolid : faBookmarkRegular} 
                className={`w-4 h-4 ${saving ? 'opacity-50' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage; 