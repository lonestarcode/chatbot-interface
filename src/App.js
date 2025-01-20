import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import ChatLayout from './components/ChatLayout';
import Prompts from './components/Prompts';
import AuthChoice from './components/AuthChoice';

function App() {
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState({});
  const [currentView, setCurrentView] = useState('chat');
  const messagesEndRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [promptsRefreshTrigger, setPromptsRefreshTrigger] = useState(0);

  const handleAuthSuccess = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
  };
  
  const handleGuestAccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('token', 'guest-token');
    localStorage.setItem('isGuest', 'true');
  };

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSavePrompt = async (message) => {
    try {
      const token = localStorage.getItem('token');
      const isGuest = localStorage.getItem('isGuest');
      
      if (!token || isGuest === 'true') {
        console.error('Must be logged in to save prompts');
        return false;
      }

      console.log('Attempting to save prompt with token:', token);
      console.log('Message content:', message);

      const response = await fetch('http://localhost:3001/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save prompt');
      }

      const data = await response.json();
      setPromptsRefreshTrigger(prev => prev + 1);
      
      return true;
    } catch (error) {
      console.error('Error saving prompt:', error);
      return false;
    }
  };

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { text: message, isBot: false }]);
    
    try {
      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message}`, 
        isBot: true 
      }]);
    }
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {!isAuthenticated ? (
        <AuthChoice onAuthSuccess={handleAuthSuccess} onGuestAccess={handleGuestAccess} darkMode={darkMode} />
      ) : (
        <div className="flex flex-col h-full">
          <Header 
            darkMode={darkMode} 
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            currentView={currentView}
            onNavigate={handleNavigate}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              onNavigate={handleNavigate}
              currentView={currentView}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />
            <main className="flex-1 overflow-auto relative">
              {currentView === 'chat' ? (
                <ChatLayout
                  inputComponent={
                    <ChatInput 
                      onSendMessage={handleSendMessage} 
                      darkMode={darkMode} 
                    />
                  }
                >
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      message={msg.text}
                      isBot={msg.isBot}
                      darkMode={darkMode}
                      onSavePrompt={() => handleSavePrompt(msg.text)}
                      isSaved={savedPrompts[msg.text]}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </ChatLayout>
              ) : (
                <Prompts 
                  darkMode={darkMode} 
                  refreshTrigger={promptsRefreshTrigger}
                />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;