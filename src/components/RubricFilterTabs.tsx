import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, List } from 'lucide-react';

interface RubricFilterTabsProps {
  activeFilter: 'all' | 'mastery' | 'remediation' | 'intervention';
  onFilterChange: (filter: 'all' | 'mastery' | 'remediation' | 'intervention') => void;
  counts: {
    all: number;
    mastery: number;
    remediation: number;
    intervention: number;
  };
}

const RubricFilterTabs: React.FC<RubricFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  counts
}) => {
  const tabs = [
    {
      id: 'all',
      label: 'All Learning Goals',
      icon: List,
      color: 'blue',
      count: counts.all
    },
    {
      id: 'mastery',
      label: 'Mastered',
      icon: CheckCircle,
      color: 'green',
      count: counts.mastery
    },
    {
      id: 'remediation',
      label: 'Needs Review',
      icon: AlertTriangle,
      color: 'orange',
      count: counts.remediation
    },
    {
      id: 'intervention',
      label: 'Learn and Improve',
      icon: XCircle,
      color: 'red',
      count: counts.remediation
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = 'transition-all duration-200';
    switch (color) {
      case 'green':
        return isActive 
          ? `${baseClasses} bg-green-100 text-green-700 border-green-300`
          : `${baseClasses} hover:bg-green-50 text-green-600 border-green-200`;
      case 'orange':
        return isActive 
          ? `${baseClasses} bg-orange-100 text-orange-700 border-orange-300`
          : `${baseClasses} hover:bg-orange-50 text-orange-600 border-orange-200`;
      case 'red':
        return isActive 
          ? `${baseClasses} bg-red-100 text-red-700 border-red-300`
          : `${baseClasses} hover:bg-red-50 text-red-600 border-red-200`;
      default:
        return isActive 
          ? `${baseClasses} bg-blue-100 text-blue-700 border-blue-300`
          : `${baseClasses} hover:bg-blue-50 text-blue-600 border-blue-200`;
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 mb-8">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            const Icon = tab.icon;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onFilterChange(tab.id as any)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getColorClasses(tab.color, isActive)}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <motion.span
                    className={`px-2 py-1 text-xs rounded-full ${
                      isActive ? 'bg-white/80' : 'bg-gray-100'
                    }`}
                    animate={{ scale: isActive ? 1.1 : 1 }}
                  >
                    {tab.count}
                  </motion.span>
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 rounded-lg z-0 pointer-events-none
                      ${tab.color === 'blue' ? 'bg-blue-200/40' : ''}
                      ${tab.color === 'green' ? 'bg-green-200/40' : ''}
                      ${tab.color === 'orange' ? 'bg-orange-200/40' : ''}
                      ${tab.color === 'red' ? 'bg-red-200/40' : ''}
                    `}
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RubricFilterTabs;
