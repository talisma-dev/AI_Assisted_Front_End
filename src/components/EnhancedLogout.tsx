
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
        className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500/90 via-gray-600/90 to-slate-700/90 hover:from-blue-500/90 hover:via-purple-500/90 hover:to-indigo-600/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/20"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Subtle Background Glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-xl blur-md opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
        
        {/* Gentle Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={{
            x: isHovered ? ["100%", "-100%"] : "100%"
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        
        {/* AI Sparkle Icon */}
        <motion.div
          animate={{ 
            rotate: isHovered ? [0, 180] : 0,
            scale: isHovered ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 0.5, ease: "easeInOut" },
            scale: { duration: 0.6 }
          }}
          className="relative z-10"
        >
          <Sparkles className="h-4 w-4 text-yellow-300 drop-shadow-sm" />
        </motion.div>
        
        <LogOut className="h-4 w-4 text-white drop-shadow-sm relative z-10 group-hover:rotate-6 transition-transform duration-200" />
        <span className="text-white text-sm font-medium relative z-10 drop-shadow-sm">
          Logout
        </span>
        
        {/* Refined Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? -45 : 10,
            scale: isHovered ? 1 : 0.9
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800/95 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none shadow-lg border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1">
            <Sparkles className="h-2 w-2 text-yellow-400" />
            See you soon, {state.currentUser?.username}! 👋
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800/95"></div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default EnhancedLogout;
