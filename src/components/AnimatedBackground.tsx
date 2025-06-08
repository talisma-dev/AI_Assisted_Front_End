
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Enhanced Neural Network Grid with stronger visibility */}
      <motion.div 
        className="absolute inset-0 opacity-30"
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
            linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px),
            linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Enhanced AI-themed Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.5) 0%, rgba(59, 130, 246, 0.3) 25%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.5) 0%, rgba(236, 72, 153, 0.3) 25%, transparent 50%)',
            'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.5) 0%, rgba(168, 85, 247, 0.3) 25%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.5) 0%, rgba(6, 182, 212, 0.3) 25%, transparent 50%)',
            'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.5) 0%, rgba(59, 130, 246, 0.3) 25%, transparent 50%), radial-gradient(circle at 90% 10%, rgba(6, 182, 212, 0.5) 0%, rgba(236, 72, 153, 0.3) 25%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.5) 0%, rgba(59, 130, 246, 0.3) 25%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.5) 0%, rgba(236, 72, 153, 0.3) 25%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Exciting Learning Achievement Stars */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute text-yellow-400 text-2xl opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360],
            opacity: [0.3, 1, 0.3],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </motion.div>
      ))}

      {/* Lightning Bolt Success Animations */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`lightning-${i}`}
          className="absolute text-3xl opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            color: '#fbbf24'
          }}
          animate={{
            scale: [0, 1.2, 0],
            rotate: [0, -15, 15, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⚡
        </motion.div>
      ))}

      {/* Floating Achievement Medals */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`medal-${i}`}
          className="absolute text-2xl opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, 20, -20, 0],
            rotate: [0, 360],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: 6 + Math.random() * 2,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🏆
        </motion.div>
      ))}

      {/* Celebration Confetti Effect */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-3 h-3 opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(45deg, 
              hsl(${Math.random() * 360}, 80%, 70%), 
              hsl(${Math.random() * 360}, 80%, 80%))`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%'
          }}
          animate={{
            y: [0, -100, 100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 720],
            scale: [0.5, 1.2, 0.5],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enhanced Matrix-style Code Rain Effect */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`code-${i}`}
          className="absolute text-cyan-400 font-mono text-sm opacity-50 select-none font-bold"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: Math.random() * 12 + 12
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

      {/* Progress Celebration Rockets */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`rocket-${i}`}
          className="absolute text-3xl opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-50px',
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 15, -15, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          🚀
        </motion.div>
      ))}

      {/* AI Neural Network Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
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
              opacity: [0, 0.9, 0]
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

      {/* Enhanced Floating Data Particles */}
      {Array.from({ length: 25 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full shadow-lg"
          style={{
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(45deg, 
              hsl(${180 + Math.random() * 120}, 75%, 65%), 
              hsl(${240 + Math.random() * 120}, 75%, 80%))`
          }}
          animate={{
            y: [-30, 30],
            x: [-20, 20],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Success Fireworks Bursts */}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={`firework-${i}`}
          className="absolute"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
        >
          {Array.from({ length: 8 }, (_, j) => (
            <motion.div
              key={j}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
              animate={{
                x: [0, Math.cos(j * 45 * Math.PI / 180) * 40],
                y: [0, Math.sin(j * 45 * Math.PI / 180) * 40],
                opacity: [1, 0],
                scale: [1, 0]
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 6,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedBackground;
