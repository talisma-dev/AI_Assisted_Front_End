
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const EnhancedLogout = () => {
  const { logout, state } = useApp();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.div 
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={handleLogout}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-purple-600 hover:via-pink-500 hover:to-orange-500 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
        whileHover={{ 
          scale: 1.05,
          rotateY: 5,
          boxShadow: "0 0 40px rgba(59, 130, 246, 0.6)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-400/30 to-purple-400/30 rounded-2xl blur-xl"
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ["100%", "-100%"] : "100%"
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
        />
        
        {/* AI Bot Wave Animation */}
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 360] : 0,
            scale: isHovered ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 2, ease: "easeInOut" },
            scale: { duration: 1, repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }
          }}
          className="relative z-10"
        >
          <Sparkles className="h-5 w-5 text-yellow-300 drop-shadow-sm" />
        </motion.div>
        
        <LogOut className="h-5 w-5 text-white drop-shadow-sm relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-white font-semibold relative z-10 drop-shadow-sm">
          Logout
        </span>
        
        {/* Enhanced Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? -55 : 15,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute -top-14 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm rounded-xl whitespace-nowrap pointer-events-none shadow-xl border border-white/10"
        >
          <motion.div
            animate={{
              background: isHovered 
                ? "linear-gradient(45deg, #1f2937, #374151, #1f2937)"
                : "#1f2937"
            }}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-3 w-3 text-yellow-400" />
            See you next time, {state.currentUser?.username}! 👋
          </motion.div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </motion.div>
        
        {/* Floating particles on hover */}
        {isHovered && (
          <>
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 40}%`
                }}
                animate={{
                  y: [-10, -30, -10],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [1, 0.5, 1],
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
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default EnhancedLogout;
