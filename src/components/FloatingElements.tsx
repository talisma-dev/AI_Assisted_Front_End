
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Trophy, Target, Sparkles, BookOpen, Award, Zap, Network, Cpu, Database, Bot } from 'lucide-react';

const FloatingElements = () => {
  const elements = [
    { icon: Brain, delay: 0, duration: 8, x: 10, y: 20, color: 'text-blue-400' },
    { icon: Star, delay: 1, duration: 6, x: 80, y: 30, color: 'text-purple-400' },
    { icon: Trophy, delay: 2, duration: 10, x: 15, y: 70, color: 'text-yellow-400' },
    { icon: Target, delay: 0.5, duration: 7, x: 85, y: 60, color: 'text-green-400' },
    { icon: Sparkles, delay: 1.5, duration: 9, x: 50, y: 15, color: 'text-pink-400' },
    { icon: BookOpen, delay: 3, duration: 8, x: 25, y: 80, color: 'text-cyan-400' },
    { icon: Award, delay: 2.5, duration: 6, x: 70, y: 85, color: 'text-orange-400' },
    { icon: Zap, delay: 1, duration: 7, x: 60, y: 45, color: 'text-indigo-400' },
    { icon: Network, delay: 3.5, duration: 9, x: 35, y: 25, color: 'text-emerald-400' },
    { icon: Cpu, delay: 2.8, duration: 8, x: 90, y: 15, color: 'text-rose-400' },
    { icon: Database, delay: 1.8, duration: 7, x: 5, y: 45, color: 'text-violet-400' },
    { icon: Bot, delay: 4, duration: 6, x: 75, y: 35, color: 'text-teal-400' }
  ];

  const neuralConnections = [
    { x1: 10, y1: 20, x2: 35, y2: 25, delay: 0 },
    { x1: 35, y1: 25, x2: 50, y2: 15, delay: 1 },
    { x1: 50, y1: 15, x2: 80, y2: 30, delay: 2 },
    { x1: 80, y1: 30, x2: 90, y2: 15, delay: 0.5 },
    { x1: 60, y1: 45, x2: 75, y2: 35, delay: 1.5 },
    { x1: 15, y1: 70, x2: 25, y2: 80, delay: 2.5 },
    { x1: 70, y1: 85, x2: 85, y2: 60, delay: 3 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Neural Network Background Grid */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full opacity-5"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 70%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)
            `
          }}
          animate={{
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Enhanced Neural Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="neuralGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {neuralConnections.map((connection, index) => (
          <motion.path
            key={index}
            d={`M${connection.x1}%,${connection.y1}% Q${(connection.x1 + connection.x2) / 2}%,${(connection.y1 + connection.y2) / 2 - 10}% ${connection.x2}%,${connection.y2}%`}
            stroke={index % 2 === 0 ? "url(#neuralGrad1)" : "url(#neuralGrad2)"}
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 4,
              delay: connection.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>

      {/* Floating Icons with Enhanced Animations */}
      {elements.map((element, index) => {
        const Icon = element.icon;
        return (
          <motion.div
            key={index}
            className={`absolute opacity-15 ${element.color}`}
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            whileHover={{
              scale: 1.5,
              opacity: 0.3,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(139, 92, 246, 0.5)",
                  "0 0 20px rgba(236, 72, 153, 0.3)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="rounded-full p-2"
            >
              <Icon className="h-8 w-8" />
            </motion.div>
          </motion.div>
        );
      })}
      
      {/* Enhanced Floating Particles with Data Flow Effect */}
      {Array.from({ length: 25 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(45deg, 
              hsl(${Math.random() * 360}, 70%, 60%), 
              hsl(${Math.random() * 360}, 70%, 80%))`
          }}
          animate={{
            y: [-30, 30],
            x: [-20, 20],
            opacity: [0.1, 0.4, 0.1],
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

      {/* AI Brain Wave Effect */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 opacity-5"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full border-4 border-blue-400 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full border-2 border-purple-400"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-full border-2 border-pink-400"></div>
        </div>
      </motion.div>

      {/* Data Stream Lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-1 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-20"
          style={{
            height: '100vh',
            left: `${(i + 1) * 12}%`,
          }}
          animate={{
            y: ['-100vh', '100vh']
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
