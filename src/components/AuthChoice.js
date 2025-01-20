import React, { useState } from 'react';
import AuthBackground from './AuthBackground';

function AuthChoice({ darkMode, onAuthSuccess, onGuestAccess }) {
  const [view, setView] = useState('choice');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    setView('choice');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login/register:', { email, view }); // Debug log
      
      const endpoint = view === 'login' ? '/api/login' : '/api/register';
      const body = view === 'login' 
        ? { email, password }
        : { email, password, username };

      console.log('Making request to:', `http://localhost:3001${endpoint}`); // Debug log

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.token);
    } catch (error) {
      console.error('Auth error:', error); // Debug log
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
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
              <span className="block italic text-lg text-gray-200">Ollama AI Interface</span>
            </div>
          </div>
          <div className="h-24"></div>
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
            <button
              onClick={() => onGuestAccess()}
              className="mt-16 w-48 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-500/20 hover:bg-gray-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      )}

      {(view === 'login' || view === 'register') && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-white">
            {view === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          
          {error && (
            <div className="text-red-500 bg-red-100/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {view === 'register' && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
          
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={loading}
              className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white 
                ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {loading ? 'Please wait...' : (view === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>
      )}
    </AuthBackground>
  );
}

export default AuthChoice; 