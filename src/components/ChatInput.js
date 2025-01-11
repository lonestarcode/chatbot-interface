import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight, 
  faPlus, 
  faMicrophone 
} from '@fortawesome/free-solid-svg-icons';

function ChatInput({ onSendMessage, darkMode }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  const handleInput = (e) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
    adjustHeight();
  };

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      setIsTyping(false);
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-[256px] border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-4">
        <div className="relative border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
          <textarea
            ref={textareaRef}
            value={message}
            rows={1}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            className="w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 
                     resize-none overflow-hidden border-b dark:border-gray-600 
                     bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="Type your message..."
            style={{ minHeight: '40px', maxHeight: '200px' }}
          />
          <div className="flex justify-between items-center px-4 py-2">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
            </button>
            <button 
              onClick={handleSubmit}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 
                       disabled:text-gray-300 dark:disabled:text-gray-600 p-2
                       rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-all duration-200"
              disabled={!message.trim()}
            >
              <FontAwesomeIcon 
                icon={isTyping ? faArrowRight : faMicrophone} 
                className={`w-5 h-5 transition-all duration-200 ${
                  isTyping ? 'transform -rotate-90' : ''
                }`}
                style={{ fontWeight: 900 }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;