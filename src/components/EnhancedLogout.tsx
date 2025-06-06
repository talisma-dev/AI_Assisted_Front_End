
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
        className="group relative flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          animate={{
            background: isHovered 
              ? "linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(236, 72, 153, 0.2))"
              : "transparent"
          }}
        />
        
        {/* AI Bot Wave Animation */}
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 10, -10, 0] : 0,
            scale: isHovered ? 1.1 : 1
          }}
          transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, repeatDelay: 1 }}
        >
          <Sparkles className="h-5 w-5 text-yellow-400" />
        </motion.div>
        
        <LogOut className="h-5 w-5 text-white group-hover:text-blue-300 transition-colors duration-200" />
        <span className="text-white group-hover:text-blue-100 font-medium transition-colors duration-200">
          Logout
        </span>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? -50 : 10,
            scale: isHovered ? 1 : 0.8
          }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900/90 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
        >
          See you next time, {state.currentUser?.username}! 👋
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default EnhancedLogout;
