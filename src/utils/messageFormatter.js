import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';

export function formatMessage(message) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <ReactMarkdown
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');
          
          return !inline && match ? (
            <div className="relative group mt-2 mb-2">
              <div className="bg-gray-900 dark:bg-[#1a1a1a] rounded-lg p-1">
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    background: 'transparent',
                    padding: '1rem',
                    margin: 0,
                  }}
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
                <button
                  onClick={() => handleCopy(code)}
                  className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-white 
                           bg-black/50 hover:bg-black/70 rounded transition-all 
                           opacity-0 group-hover:opacity-100"
                >
                  <FontAwesomeIcon 
                    icon={copiedCode === code ? faCheck : faCopy} 
                    className="w-4 h-4"
                  />
                </button>
              </div>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {message}
    </ReactMarkdown>
  );
} 