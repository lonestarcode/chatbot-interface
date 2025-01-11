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
    <header className="bg-gradient-to-b from-[#1B3B6F] to-[#065A82] text-white relative">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-end justify-center flex-1">
          <svg 
            className="w-10 h-10 mr-3 mb-[2px]" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M45 80 L45 30 Q45 20 50 20 Q55 20 55 30 L55 80 Z" 
              fill="currentColor"
              className="opacity-90"
            />
            <path 
              d="M45 45 L45 44 Q45 35 40 35 Q35 35 35 44 L35 55 Q35 60 40 60 L45 60" 
              fill="currentColor"
              className="opacity-90"
            />
            <path 
              d="M55 35 L55 34 Q55 25 60 25 Q65 25 65 34 L65 45 Q65 50 60 50 L55 50" 
              fill="currentColor"
              className="opacity-90"
            />
            <path 
              d="M42 35 L38 33 M42 45 L38 43 M42 55 L38 53 M42 65 L38 63 M42 75 L38 73
                 M42 40 L38 38 M42 50 L38 48 M42 60 L38 58 M42 70 L38 68"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-70"
            />
            <path 
              d="M58 30 L62 28 M58 40 L62 38 M58 50 L62 48 M58 60 L62 58 M58 70 L62 68
                 M58 35 L62 33 M58 45 L62 43 M58 55 L62 53 M58 65 L62 63"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-70"
            />
            <path 
              d="M35 48 L32 46 M35 52 L32 50
                 M65 38 L68 36 M65 42 L68 40"
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-70"
            />
            <path 
              d="M48 25 L48 75 M52 25 L52 75" 
              stroke="currentColor"
              strokeWidth="1"
              className="opacity-40"
            />
            <path 
              d="M30 80 Q40 77 50 77 Q60 77 70 80" 
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-60"
            />
          </svg>
          <h1 className="text-xl font-['Space_Grotesk'] font-bold tracking-wide">
            Odessa
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
            <FontAwesomeIcon icon={faPen} className="text-gray-600 dark:text-gray-400 w-5 h-5" />
          </button>
          <button className="flex-1 p-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex justify-center">
            <FontAwesomeIcon icon={faLightbulb} className="text-gray-600 dark:text-gray-400 w-5 h-5" />
          </button>
          <button className="flex-1 p-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors flex justify-center">
            <FontAwesomeIcon icon={faUserGroup} className="text-gray-600 dark:text-gray-400 w-5 h-5" />
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