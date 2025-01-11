import React from 'react';

function AuthBackground({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1B3B6F] to-[#065A82] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-[#0B1829] via-[#1B3B6F] to-transparent">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.8 + 0.2,
                animation: `twinkle ${Math.random() * 4 + 2}s infinite ease-in-out`
              }}
            />
          ))}
        </div>

        {/* Clouds background */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#FFFFFF10] via-[#FFFFFF08] to-transparent">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-b from-white/5 to-transparent rounded-full filter blur-xl"
              style={{
                bottom: `${Math.random() * 40}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 200}px`,
                height: `${Math.random() * 100 + 50}px`,
                opacity: Math.random() * 0.3 + 0.1,
                transform: `scale(${Math.random() + 0.5})`,
                animation: `float ${Math.random() * 10 + 20}s infinite ease-in-out`
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md w-full space-y-16 relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateX(-10%); }
          50% { transform: translateX(10%); }
        }
      `}</style>
    </div>
  );
}

export default AuthBackground; 