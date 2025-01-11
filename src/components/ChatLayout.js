import React from 'react';

function ChatLayout({ children, inputComponent }) {
  return (
    <div className="flex flex-col h-full relative bg-white dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto pb-32 mb-8">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900">
        <div className="h-6"></div>
        {inputComponent}
      </div>
    </div>
  );
}

export default ChatLayout; 