
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Enhanced Neural Network Grid */}
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
            linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px),
            linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Tech Elements */}
      <div className="absolute top-1/4 right-1/4 opacity-10">
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl shadow-2xl"
          animate={{ 
            y: [0, -20, 0],
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
            🧠
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-1/3 left-1/5 opacity-15">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-br from-green-400 via-cyan-500 to-blue-500 rounded-full shadow-xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-lg">
            ⚡
          </div>
        </motion.div>
      </div>

      <div className="absolute top-2/3 right-1/3 opacity-12">
        <motion.div 
          className="w-14 h-14 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-lg shadow-xl"
          animate={{ 
            x: [0, 15, 0],
            y: [0, -15, 0],
            rotate: [0, -45, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-full h-full flex items-center justify-center text-white text-xl">
            🎯
          </div>
        </motion.div>
      </div>

      {/* Matrix-style Code Rain Effect */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`code-${i}`}
          className="absolute text-green-400 font-mono text-xs opacity-20 select-none"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: Math.random() * 8 + 8
          }}
          animate={{
            y: ['-100vh', '100vh']
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </motion.div>
      ))}

      {/* Pulse Rings */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {Array.from({ length: 3 }, (_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute border border-blue-400 rounded-full opacity-10"
            style={{
              width: 100 + i * 50,
              height: 100 + i * 50,
              top: -(50 + i * 25),
              left: -(50 + i * 25)
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
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
