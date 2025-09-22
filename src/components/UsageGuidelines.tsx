import React from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { usageGuidelines } from '../data/guidelines';
import { TabType } from '../types';

interface UsageGuidelinesProps {
  activeTab: TabType;
}

export const UsageGuidelines: React.FC<UsageGuidelinesProps> = ({ activeTab }) => {
  let guidelines;
  switch (activeTab) {
    case 'text-to-image':
      guidelines = usageGuidelines.textToImage;
      break;
    case 'image-to-image':
      guidelines = usageGuidelines.imageToImage;
      break;
    case 'image-to-video':
      guidelines = usageGuidelines.imageToVideo;
      break;
    default:
      guidelines = usageGuidelines.general;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-blue-900 mb-2">
            {activeTab === 'text-to-image' 
              ? 'Text Writing Tips' 
              : activeTab === 'image-to-video'
              ? 'Video Generation Guidelines'
              : 'Image Upload Guidelines'}
          </h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {guidelines.map((guideline, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-3 h-3 text-blue-600 flex-shrink-0 mt-1" />
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};