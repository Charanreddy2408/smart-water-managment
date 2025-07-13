import React, { useEffect, useState } from 'react';

const WELCOME_TEXT = 'Welcome to Smart Water Dashboard';

const WelcomeSplash = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [typedText, setTypedText] = useState('');

  // Typewriter effect (slower)
  useEffect(() => {
    let i = 0;
    let typing;
    if (visible) {
      typing = setInterval(() => {
        setTypedText((prev) => {
          if (i < WELCOME_TEXT.length) {
            i++;
            return WELCOME_TEXT.slice(0, i);
          } else {
            clearInterval(typing);
            return prev;
          }
        });
      }, 70); // slower typing speed
    }
    return () => clearInterval(typing);
  }, [visible]);

  // Splash auto-dismiss
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 2500 + WELCOME_TEXT.length * 70);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleDismiss = () => {
    setVisible(false);
    if (onFinish) onFinish();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/90 via-white/90 to-blue-300/90 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-blue-900/95 transition-opacity duration-700 animate-fadeIn"
      onClick={handleDismiss}
      aria-label="Welcome splash screen"
    >
      <div className="flex flex-col items-center">
        {/* Animated SVG Water Drop with fade-in */}
        <svg className="w-24 h-24 animate-bounce mb-4 transition-opacity duration-1000 opacity-90" style={{ filter: 'drop-shadow(0 8px 24px rgba(59,130,246,0.18))' }} viewBox="0 0 64 64" fill="none">
          <defs>
            <linearGradient id="waterDropGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          <path
            d="M32 6C32 6 12 30 12 42C12 53.0457 21.9543 62 32 62C42.0457 62 52 53.0457 52 42C52 30 32 6 32 6Z"
            fill="url(#waterDropGradient)"
            stroke="#2563eb"
            strokeWidth="2"
          />
          <circle cx="32" cy="40" r="8" fill="#fff" fillOpacity="0.25" />
        </svg>
        {/* Animated Water Wave below drop */}
        <svg className="w-32 h-8 animate-pulse-slow mb-2" viewBox="0 0 120 24" fill="none">
          <path d="M0 12 Q 20 24 40 12 T 80 12 T 120 12 V24 H0Z" fill="#3b82f6" fillOpacity="0.18" />
        </svg>
        {/* Typewriter Welcome Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2 animate-fadeInUp whitespace-nowrap">
          {typedText}
          <span className="inline-block w-2 h-6 bg-blue-700 dark:bg-blue-300 align-middle animate-pulse ml-1" style={{visibility: typedText.length < WELCOME_TEXT.length ? 'visible' : 'hidden'}}></span>
        </h1>
        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 animate-fadeInUp delay-100">Real-time IoT Water Quality Monitoring</p>
      </div>
    </div>
  );
};

export default WelcomeSplash; 