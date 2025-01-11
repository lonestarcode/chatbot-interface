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
          <h2 className="text-5xl font-['Space_Grotesk'] font-bold tracking-wide text-white">
            Odessa
          </h2>
          <p className="mt-3 text-lg italic text-gray-200">
            Ollama AI Interface
          </p>
          <div className="mt-8 space-y-4 flex flex-col items-center">
            <button
              onClick={() => onSelect('guest')}
              className="w-48 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-400/20 hover:bg-gray-400/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-200"
            >
              Guest
            </button>
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