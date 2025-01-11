import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPen, 
  faLightbulb, 
  faUserGroup,
  faGear,
  faSun,
  faMoon 
} from "@fortawesome/free-solid-svg-icons";

function Header({ darkMode, onToggleDarkMode }) {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <header className={`relative ${darkMode ? 'bg-auth-dark text-white' : 'bg-gradient-to-b from-gray-200 to-gray-100 text-gray-800'}`}>
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
        <div ref={settingsRef}>
          <button 
            onClick={toggleSettings}
            className="absolute right-4 hover:text-gray-200 transition-colors"
          >
            <FontAwesomeIcon icon={faGear} className="w-5 h-5" />
          </button>
          
          {showSettings && (
            <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50">
              <button 
                onClick={onToggleDarkMode}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full"
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="w-4 h-4" />
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

      <div className="bg-gray-200 dark:bg-gray-800 md:hidden relative">
        <nav className="flex justify-around">
          <button className="flex-1 p-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex justify-center">
            <FontAwesomeIcon icon={faPen} className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          </button>
          <button className="flex-1 p-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex justify-center">
            <FontAwesomeIcon icon={faLightbulb} className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          </button>
          <button className="flex-1 p-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex justify-center">
            <FontAwesomeIcon icon={faUserGroup} className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-[3px] bg-gradient-to-r from-gray-300/0 via-gray-300/30 to-gray-300/0 dark:from-gray-600/0 dark:via-gray-600/30 dark:to-gray-600/0"></div>
          <div className="h-[2px] bg-gradient-to-r from-gray-400/0 via-gray-400/20 to-gray-400/0 dark:from-gray-700/0 dark:via-gray-700/20 dark:to-gray-700/0"></div>
        </div>
      </div>
    </header>
  );
}

export default Header;