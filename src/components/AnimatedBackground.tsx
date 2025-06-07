
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Subtle Grid Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Gentle Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.08) 25%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.08) 25%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.08) 25%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.08) 25%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.08) 25%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, rgba(236, 72, 153, 0.08) 25%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Study Elements */}
      <div className="absolute top-1/4 left-1/6 opacity-15">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-blue-400/50 to-purple-500/50 rounded-lg shadow-lg flex items-center justify-center"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-xl">📚</span>
        </motion.div>
      </div>

      <div className="absolute bottom-1/3 right-1/5 opacity-15">
        <motion.div 
          className="w-10 h-10 bg-gradient-to-br from-cyan-400/50 to-blue-500/50 rounded-full shadow-lg flex items-center justify-center"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-lg">🧠</span>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-3/4 opacity-15">
        <motion.div 
          className="w-8 h-8 bg-gradient-to-br from-purple-400/50 to-pink-500/50 rounded-lg shadow-lg flex items-center justify-center"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.15, 1],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-sm">📖</span>
        </motion.div>
      </div>

      <div className="absolute top-3/4 left-1/4 opacity-15">
        <motion.div 
          className="w-14 h-14 bg-gradient-to-br from-green-400/50 to-emerald-500/50 rounded-xl shadow-lg flex items-center justify-center"
          animate={{ 
            x: [0, 15, 0],
            y: [0, -25, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-2xl">✏️</span>
        </motion.div>
      </div>

      <div className="absolute top-1/6 right-1/3 opacity-15">
        <motion.div 
          className="w-9 h-9 bg-gradient-to-br from-orange-400/50 to-red-500/50 rounded-full shadow-lg flex items-center justify-center"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            y: [0, -18, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <span className="text-white text-lg">💡</span>
        </motion.div>
      </div>

      {/* Subtle AI Circuit Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {Array.from({ length: 4 }, (_, i) => (
          <motion.path
            key={`circuit-${i}`}
            d={`M${20 + i * 25}%,10% L${30 + i * 25}%,20% L${25 + i * 25}%,30% L${35 + i * 25}%,40%`}
            stroke="url(#circuitGradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Gentle Floating Particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(45deg, 
              hsl(${200 + Math.random() * 60}, 60%, 70%), 
              hsl(${240 + Math.random() * 60}, 60%, 80%))`
          }}
          animate={{
            y: [-20, 20],
            x: [-15, 15],
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Study Progress Rings */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute border rounded-full opacity-5"
            style={{
              width: 80 + i * 40,
              height: 80 + i * 40,
              top: -(40 + i * 20),
              left: -(40 + i * 20),
              borderColor: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
              borderWidth: 1
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{
              duration: 6,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
