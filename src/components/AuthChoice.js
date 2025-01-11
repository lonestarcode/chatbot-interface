import React from 'react';

function AuthChoice({ onSelect, darkMode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to AI Chat
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Your Personal AI Assistant
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => onSelect('login')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Sign In with Existing Account
          </button>
          <button
            onClick={() => onSelect('register')}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthChoice; 