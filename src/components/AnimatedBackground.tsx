
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Neural Network Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] animate-pulse"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-cyan-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-green-400/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Neural Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <g className="animate-pulse">
          <path d="M100,200 Q300,100 500,300" stroke="url(#neuralGrad)" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M200,400 Q400,200 600,400" stroke="url(#neuralGrad)" strokeWidth="1" fill="none" opacity="0.2" />
          <path d="M50,300 Q250,150 450,350" stroke="url(#neuralGrad)" strokeWidth="1" fill="none" opacity="0.25" />
        </g>
      </svg>
      
      {/* Floating Educational Icons */}
      <div className="absolute top-1/4 right-1/4 opacity-20">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg animate-float rotate-12">
          <div className="w-full h-full flex items-center justify-center text-white text-lg">📚</div>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-15">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full animate-float" style={{ animationDelay: '2.5s' }}>
          <div className="w-full h-full flex items-center justify-center text-white text-sm">🧠</div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
