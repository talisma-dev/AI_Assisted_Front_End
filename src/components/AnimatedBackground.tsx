
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Enhanced Neural Network Grid with stronger visibility */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Killer AI-themed Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.4) 0%, rgba(59, 130, 246, 0.2) 25%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.2) 25%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.4) 0%, rgba(168, 85, 247, 0.2) 25%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.4) 0%, rgba(6, 182, 212, 0.2) 25%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.4) 0%, rgba(59, 130, 246, 0.2) 25%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(6, 182, 212, 0.4) 0%, rgba(236, 72, 153, 0.2) 25%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.4) 0%, rgba(59, 130, 246, 0.2) 25%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.4) 0%, rgba(236, 72, 153, 0.2) 25%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Larger Floating Tech Elements with enhanced visibility */}
      <div className="absolute top-1/4 right-1/4 opacity-25">
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl shadow-2xl"
          animate={{ 
            y: [0, -25, 0],
            rotateY: [0, 180, 360],
            rotateX: [0, 15, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
            🧠
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-1/3 left-1/5 opacity-30">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 rounded-full shadow-2xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-2xl">
            ⚡
          </div>
        </motion.div>
      </div>

      <div className="absolute top-2/3 right-1/3 opacity-25">
        <motion.div 
          className="w-18 h-18 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl shadow-2xl"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -20, 0],
            rotate: [0, -45, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-2xl">
            🎯
          </div>
        </motion.div>
      </div>

      {/* Enhanced Matrix-style Code Rain Effect */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`code-${i}`}
          className="absolute text-cyan-400 font-mono text-sm opacity-40 select-none font-bold"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: Math.random() * 12 + 10
          }}
          animate={{
            y: ['-100vh', '100vh']
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </motion.div>
      ))}

      {/* Enhanced Pulse Rings with stronger colors */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {Array.from({ length: 4 }, (_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute border-2 rounded-full opacity-20"
            style={{
              width: 120 + i * 60,
              height: 120 + i * 60,
              top: -(60 + i * 30),
              left: -(60 + i * 30),
              borderColor: i % 2 === 0 ? '#06b6d4' : '#8b5cf6'
            }}
            animate={{
              scale: [1, 2.5, 1],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 4,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* AI Neural Network Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
          </linearGradient>
          <filter id="neuralGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: 8 }, (_, i) => (
          <motion.path
            key={`neural-${i}`}
            d={`M${Math.random() * 100}%,${Math.random() * 100}% Q${Math.random() * 100}%,${Math.random() * 100}% ${Math.random() * 100}%,${Math.random() * 100}%`}
            stroke="url(#neuralGradient)"
            strokeWidth="3"
            fill="none"
            filter="url(#neuralGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 6,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Floating Data Particles with enhanced visibility */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full shadow-lg"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(45deg, 
              hsl(${180 + Math.random() * 120}, 70%, 60%), 
              hsl(${240 + Math.random() * 120}, 70%, 80%))`
          }}
          animate={{
            y: [-40, 40],
            x: [-30, 30],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5]
          }}
          transition={{
            duration: 5 + Math.random() * 8,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enhanced AI Brain Wave Effect */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 opacity-15"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full border-4 border-cyan-400 relative shadow-2xl">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border-3 border-blue-500 shadow-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full border-2 border-purple-500 shadow-lg"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedBackground;
