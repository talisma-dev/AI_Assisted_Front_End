
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
      className="fixed top-4 right-4 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={handleLogout}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-purple-600 hover:via-pink-500 hover:to-orange-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden"
        whileHover={{ 
          scale: 1.03,
          rotateY: 3,
          boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)"
        }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 rounded-xl blur-lg"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ["100%", "-100%"] : "100%"
          }}
          transition={{ duration: 1.2, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
        />
        
        {/* AI Bot Wave Animation */}
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 360] : 0,
            scale: isHovered ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 0.8, repeat: isHovered ? Infinity : 0, repeatDelay: 0.3 }
          }}
          className="relative z-10"
        >
          <Sparkles className="h-4 w-4 text-yellow-300 drop-shadow-sm" />
        </motion.div>
        
        <LogOut className="h-4 w-4 text-white drop-shadow-sm relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="text-white font-medium relative z-10 drop-shadow-sm text-sm">
          Logout
        </span>
        
        {/* Enhanced Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? -45 : 12,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none shadow-lg border border-white/10"
        >
          <motion.div
            animate={{
              background: isHovered 
                ? "linear-gradient(45deg, #1f2937, #374151, #1f2937)"
                : "#1f2937"
            }}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="h-2.5 w-2.5 text-yellow-400" />
            See you next time, {state.currentUser?.username}! 👋
          </motion.div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
        </motion.div>
        
        {/* Floating particles on hover */}
        {isHovered && (
          <>
            {Array.from({ length: 4 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/50 rounded-full"
                style={{
                  left: `${25 + i * 12}%`,
                  top: `${35 + (i % 2) * 30}%`
                }}
                animate={{
                  y: [-8, -20, -8],
                  x: [0, Math.random() * 15 - 7, 0],
                  opacity: [1, 0.4, 1],
                  scale: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
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
