
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, Star, Award, BookOpen, Brain } from 'lucide-react';

const CelebrationEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Confetti Effect */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`confetti-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: `hsl(${Math.random() * 360}, 70%, 60%)`
          }}
          initial={{ y: -20, x: 0, opacity: 1, scale: 0 }}
          animate={{
            y: [0, 400],
            x: [0, (Math.random() - 0.5) * 200],
            opacity: [1, 0],
            scale: [0, 1, 0],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
          }}
          transition={{
            duration: 2.5,
            delay: Math.random() * 1,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Sparkle Burst */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: '50%',
            top: '50%'
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i / 12) * Math.PI * 2) * 100,
            y: Math.sin((i / 12) * Math.PI * 2) * 100,
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            ease: "easeOut"
          }}
        >
          <Sparkles className="h-4 w-4 text-yellow-400" />
        </motion.div>
      ))}

      {/* Floating Study Icons */}
      {[Trophy, Star, Award, BookOpen, Brain].map((Icon, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 20}%`
          }}
          initial={{ y: 0, scale: 0, opacity: 0 }}
          animate={{
            y: [-50, -100],
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 2,
            delay: 0.3 + i * 0.1,
            ease: "easeOut"
          }}
        >
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
            <Icon className="h-5 w-5 text-white" />
          </div>
        </motion.div>
      ))}

      {/* Success Ripples */}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-green-400 rounded-full"
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 3],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            ease: "easeOut"
          }}
          style={{
            width: 100,
            height: 100
          }}
        />
      ))}

      {/* Floating Hearts/Stars */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`heart-${i}`}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 80 + 10}%`,
            top: `${Math.random() * 60 + 20}%`
          }}
          initial={{ scale: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            y: [-30, -80],
            x: [(Math.random() - 0.5) * 40]
          }}
          transition={{
            duration: 2,
            delay: Math.random() * 1,
            ease: "easeOut"
          }}
        >
          {i % 2 === 0 ? '⭐' : '🎉'}
        </motion.div>
      ))}
    </div>
  );
};

export default CelebrationEffect;
