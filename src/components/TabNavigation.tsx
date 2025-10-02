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
      icon: Type,
    },
    {
      id: 'image-to-image' as TabType,
      label: 'Image to Image',
      icon: Image,
    },
    {
      id: 'image-to-video' as TabType,
      label: 'Image to Video',
      icon: Video,
    },
  ];

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex space-x-4 xs:space-x-6 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-3 xs:py-4 px-1 border-b-2 font-medium text-xs xs:text-sm flex items-center space-x-1.5 xs:space-x-2 transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-3.5 xs:w-4 h-3.5 xs:h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};