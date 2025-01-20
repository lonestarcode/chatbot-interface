import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';

function Groups({ darkMode }) {
  return (
    <div className={`h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center mb-6">
          <h2 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <FontAwesomeIcon icon={faUserGroup} className="mr-2" />
            Groups
          </h2>
        </div>
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Groups feature coming soon...
        </div>
      </div>
    </div>
  );
}

export default Groups; 