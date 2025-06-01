
import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'members' | 'contributions';
  onTabChange: (tab: 'members' | 'contributions') => void;
}

export const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex rounded-lg bg-white/5 p-1">
      <button
        onClick={() => onTabChange('members')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
          activeTab === 'members'
            ? 'bg-gradient-purple-pink text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Users className="w-4 h-4 inline mr-2" />
        Members
      </button>
      <button
        onClick={() => onTabChange('contributions')}
        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
          activeTab === 'contributions'
            ? 'bg-gradient-purple-pink text-white'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <TrendingUp className="w-4 h-4 inline mr-2" />
        Timeline
      </button>
    </div>
  );
};
