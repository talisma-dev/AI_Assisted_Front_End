
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Award, Target, Brain, BookOpen, GraduationCap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const CelebrationEffect = () => {
  const { state, showCongratulations, setShowCongratulations } = useApp();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (showCongratulations) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showCongratulations]);

  const celebrationIcons = [Trophy, Star, Sparkles, Award, Target, Brain, BookOpen, GraduationCap];

  return (
    <AnimatePresence>
      {showCongratulations && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowCongratulations(false)}
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'][i % 7],
                    left: `${Math.random() * 100}%`,
                    top: '-10px'
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: [0, 360, 720],
                    scale: [1, 0.8, 1.2, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: "easeOut",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          )}

          {/* Floating Celebration Icons */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 12 }, (_, i) => {
                const Icon = celebrationIcons[i % celebrationIcons.length];
                return (
                  <motion.div
                    key={`icon-${i}`}
                    className="absolute text-yellow-400"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                    animate={{
                      scale: [0, 1.5, 1, 1.2, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 1, 0.8, 0]
                    }}
                    transition={{
                      duration: 3,
                      ease: "easeInOut",
                      delay: Math.random() * 1.5
                    }}
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Main Celebration Modal */}
          <motion.div
            initial={{ scale: 0, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 90 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 rounded-3xl shadow-2xl max-w-md mx-4 text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated Background Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 rounded-3xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative z-10">
              {/* Trophy Animation */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-4"
              >
                <div className="inline-flex p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
              </motion.div>

              {/* Congratulations Text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                🎉 Congratulations! 🎉
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 mb-6 text-lg"
              >
                You've mastered all concepts and you're ready for the next adventure!
              </motion.p>

              {/* Animated Stars */}
              <div className="flex justify-center gap-2 mb-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 360],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="h-6 w-6 text-yellow-300 fill-current" />
                  </motion.div>
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCongratulations(false)}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 backdrop-blur-sm border border-white/30"
              >
                Continue Your Journey
              </motion.button>
            </div>

            {/* Floating Particles around Modal */}
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [1, 0.3, 1],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationEffect;
