import React from 'react';
import { Type, Image, Video } from 'lucide-react';
import { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'text-to-image' as TabType,
      label: 'Text to Image',
      shortLabel: 'Text→Image',
      icon: Type,
    },
    {
      id: 'image-to-image' as TabType,
      label: 'Image to Image',
      shortLabel: 'Image→Image',
      icon: Image,
    },
    {
      id: 'image-to-video' as TabType,
      label: 'Image to Video',
      shortLabel: 'Image→Video',
      icon: Video,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white sticky top-14 sm:top-16 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1.5 sm:space-x-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};