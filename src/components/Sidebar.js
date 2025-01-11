import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPen, 
  faLightbulb, 
  faUserGroup 
} from '@fortawesome/free-solid-svg-icons';

function Sidebar({ onNavigate, currentView }) {
  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-4 hidden md:block border-r border-gray-200 dark:border-gray-700">
      <nav>
        <ul className="space-y-4">
          <li 
            onClick={() => onNavigate('chat')}
            className={`p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg cursor-pointer 
                      transition-colors flex items-center space-x-3
                      ${currentView === 'chat' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <FontAwesomeIcon icon={faPen} className="text-gray-600 dark:text-gray-400 w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300">Chat</span>
          </li>
          <li 
            onClick={() => onNavigate('prompts')}
            className={`p-3 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg cursor-pointer 
                      transition-colors flex items-center space-x-3
                      ${currentView === 'prompts' ? 'bg-gray-300 dark:bg-gray-700' : ''}`}
          >
            <FontAwesomeIcon icon={faLightbulb} className="text-gray-600 dark:text-gray-400 w-5 h-5" />
            <span className="text-gray-700 dark:text-gray-300">Prompts</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;