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

        {/* Mountain range */}
        <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
          {/* Back layer - furthest mountains */}
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-[#152A4F]"
              style={{
                left: `${(i * 18) - 15}%`,
                height: `${120 + Math.random() * 80}px`,
                width: '600px',
                opacity: 0.6 - (i * 0.03),
                filter: 'brightness(0.5)',
                transformOrigin: 'bottom',
                clipPath: `polygon(
                  0% 100%,
                  10% ${85 + Math.random() * 10}%,
                  25% ${60 + Math.random() * 15}%,
                  35% ${75 + Math.random() * 15}%,
                  45% ${55 + Math.random() * 10}%,
                  60% ${80 + Math.random() * 10}%,
                  75% ${65 + Math.random() * 15}%,
                  85% ${75 + Math.random() * 15}%,
                  100% 100%
                )`
              }}
            />
          ))}
          
          {/* Middle layer */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i + 7}
              className="absolute bottom-0 bg-[#1B3B6F]"
              style={{
                left: `${(i * 20) - 10}%`,
                height: `${140 + Math.random() * 60}px`,
                width: '650px',
                opacity: 0.75 - (i * 0.04),
                filter: 'brightness(0.65)',
                transformOrigin: 'bottom',
                clipPath: `polygon(
                  0% 100%,
                  15% ${80 + Math.random() * 15}%,
                  28% ${60 + Math.random() * 10}%,
                  42% ${75 + Math.random() * 15}%,
                  55% ${50 + Math.random() * 15}%,
                  68% ${70 + Math.random() * 20}%,
                  82% ${55 + Math.random() * 15}%,
                  100% 100%
                )`
              }}
            />
          ))}

          {/* Front layer - closest mountains */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i + 13}
              className="absolute bottom-0 bg-[#234785]"
              style={{
                left: `${(i * 25) - 15}%`,
                height: `${100 + Math.random() * 50}px`,
                width: '800px',
                opacity: 0.9 - (i * 0.05),
                filter: 'brightness(0.8)',
                transformOrigin: 'bottom',
                clipPath: `polygon(
                  0% 100%,
                  12% ${85 + Math.random() * 10}%,
                  25% ${70 + Math.random() * 15}%,
                  38% ${90 + Math.random() * 8}%,
                  50% ${75 + Math.random() * 12}%,
                  65% ${85 + Math.random() * 10}%,
                  80% ${70 + Math.random() * 15}%,
                  92% ${85 + Math.random() * 10}%,
                  100% 100%
                )`
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
      <div className="max-w-md w-full space-y-8 relative z-10 mt-20 sm:mt-24">
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