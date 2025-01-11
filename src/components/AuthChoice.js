import React, { useState } from 'react';
import AuthBackground from './AuthBackground';

function AuthChoice({ onSelect, darkMode, onAuthSuccess }) {
  const [view, setView] = useState('choice');

  const handleBack = () => setView('choice');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    onAuthSuccess();
  };

  return (
    <AuthBackground>
      {view === 'choice' && (
        <div className="flex flex-col items-center -mt-20">
          <div className="flex items-center">
            <svg 
              className="w-10 h-10 mr-3 mb-[2px]" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="30" fill="white" className="opacity-90" />
              <ellipse cx="50" cy="50" rx="50" ry="20" fill="gray" className="opacity-70" />
            </svg>
            <div className="text-center">
              <h2 className="text-5xl font-['Space_Grotesk'] font-bold tracking-wide text-white">
                Odessa
              </h2>
              <span className="block italic text-lg text-gray-200">AI Interface</span>
            </div>
          </div>
          <div className="h-24"></div> {/* Further increased buffer between AI Interface and Login */}
          <div className="mt-8 space-y-4 flex flex-col items-center">
            <button
              onClick={() => setView('login')}
              className="w-48 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400/20 hover:bg-gray-400/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={() => setView('register')}
              className="w-48 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400/20 hover:bg-gray-400/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
            >
              Register
            </button>
            <div className="h-8"></div> {/* Reduced buffer between Register and Guest */}
            <button
              onClick={() => onSelect('guest')}
              className="mt-16 w-48 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500/20 hover:bg-gray-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Guest
            </button>
          </div>
        </div>
      )}

      {(view === 'login' || view === 'register') && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-white">
            {view === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <input
            type="email"
            required
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {view === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </AuthBackground>
  );
}

export default AuthChoice; 