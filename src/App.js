import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import ChatLayout from './components/ChatLayout';
import Prompts from './components/Prompts';
import AuthChoice from './components/AuthChoice';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [savedPrompts, setSavedPrompts] = useState({});
  const [currentView, setCurrentView] = useState('chat');
  const messagesEndRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [authView, setAuthView] = useState('choice'); // 'choice', 'login', or 'register'

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
      if (!token) {
        console.error('No token found');
        return false;
      }

      const response = await fetch('http://localhost:3001/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      });

      if (!response.ok) throw new Error('Failed to save prompt');
      
      const savedPrompt = await response.json();
      setSavedPrompts(prev => ({
        ...prev,
        [message]: savedPrompt.id
      }));
      
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

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {authView === 'choice' && (
            <AuthChoice 
              onSelect={setAuthView}
              darkMode={darkMode}
            />
          )}
          {authView === 'login' && (
            <Login 
              onSuccess={handleAuthSuccess}
              onBack={() => setAuthView('choice')}
            />
          )}
          {authView === 'register' && (
            <Register 
              onSuccess={handleAuthSuccess}
              onBack={() => setAuthView('choice')}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 bg-white dark:bg-gray-900">
          {currentView === 'chat' ? (
            <ChatLayout inputComponent={<ChatInput onSendMessage={handleSendMessage} darkMode={darkMode} />}>
              <div className="h-full overflow-y-auto">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index}
                    message={message.text}
                    isBot={message.isBot}
                    darkMode={darkMode}
                    onSavePrompt={handleSavePrompt}
                    isSaved={savedPrompts[message.text] !== undefined}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ChatLayout>
          ) : (
            <Prompts darkMode={darkMode} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;