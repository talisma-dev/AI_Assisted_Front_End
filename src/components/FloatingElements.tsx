
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Trophy, Target, Sparkles, BookOpen, Award, Zap } from 'lucide-react';

const FloatingElements = () => {
  const elements = [
    { icon: Brain, delay: 0, duration: 8, x: 10, y: 20 },
    { icon: Star, delay: 1, duration: 6, x: 80, y: 30 },
    { icon: Trophy, delay: 2, duration: 10, x: 15, y: 70 },
    { icon: Target, delay: 0.5, duration: 7, x: 85, y: 60 },
    { icon: Sparkles, delay: 1.5, duration: 9, x: 50, y: 15 },
    { icon: BookOpen, delay: 3, duration: 8, x: 25, y: 80 },
    { icon: Award, delay: 2.5, duration: 6, x: 70, y: 85 },
    { icon: Zap, delay: 1, duration: 7, x: 60, y: 45 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((element, index) => {
        const Icon = element.icon;
        return (
          <motion.div
            key={index}
            className="absolute opacity-10 text-blue-400"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>
        );
      })}
      
      {/* Floating Particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [-30, 30],
            x: [-20, 20],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
