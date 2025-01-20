import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPen, 
  faLightbulb, 
  faUserGroup,
  faGear,
  faSun,
  faMoon 
} from "@fortawesome/free-solid-svg-icons";

function Header({ darkMode, onToggleDarkMode, currentView, onNavigate }) {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <>
      <header className={`relative ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-200 to-gray-100'} text-gray-800 dark:text-white`}>
        {darkMode && (
          <div className="absolute inset-0">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 60}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${Math.random() * 4 + 2}s infinite ease-in-out`
                }}
              />
            ))}
          </div>
        )}
        <div className="p-4 flex justify-between items-center relative z-10">
          <div className="flex items-end justify-center flex-1">
            <svg 
              className={`w-10 h-10 mr-3 mb-[2px] ${darkMode ? 'text-white' : 'text-gray-600'}`} 
              viewBox="0 0 100 100" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="30" className="opacity-70" />
              <ellipse cx="50" cy="50" rx="50" ry="20" className="opacity-50" />
            </svg>
            <h1 className={`text-2xl font-serif font-medium tracking-wide ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Odessa
              <span className={`ml-2 italic text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>AI Interface</span>
            </h1>
          </div>
          <button 
            onClick={toggleSettings}
            className="md:hidden hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex justify-around items-center p-2">
            <li 
              onClick={() => onNavigate('chat')}
              className={`flex items-center space-x-2 p-2 cursor-pointer rounded-lg
                      ${currentView === 'chat' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
              <span className="text-sm">Chat</span>
            </li>
            <li 
              onClick={() => onNavigate('prompts')}
              className={`flex items-center space-x-2 p-2 cursor-pointer rounded-lg
                      ${currentView === 'prompts' ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <FontAwesomeIcon icon={faLightbulb} className="w-4 h-4" />
              <span className="text-sm">Prompts</span>
            </li>
            <li 
              onClick={onToggleDarkMode}
              className="flex items-center space-x-2 p-2 cursor-pointer rounded-lg text-gray-600 dark:text-gray-400"
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="w-4 h-4" />
              <span className="text-sm">{darkMode ? 'Light' : 'Dark'}</span>
            </li>
          </ul>
        </nav>
      </header>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default Header;