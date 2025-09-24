import React from 'react';
import { ResolutionOption } from '../types';
import { Crown } from 'lucide-react';

interface ResolutionSelectorProps {
  selectedResolution: ResolutionOption;
  onResolutionChange: (resolution: ResolutionOption) => void;
  userPlan?: string;
}

const getResolutionOptions = (userPlan: string = 'free'): ResolutionOption[] => {
  const baseOptions: ResolutionOption[] = [
    { label: '512 × 512', width: 512, height: 512, planRequired: 'free' },
    { label: '1024 × 1024', width: 1024, height: 1024, planRequired: 'free' },
  ];

  const proOptions: ResolutionOption[] = [
    { label: '1536 × 1536', width: 1536, height: 1536, planRequired: 'pro' },
    { label: '768 × 1344 (Portrait)', width: 768, height: 1344, planRequired: 'pro' },
    { label: '1344 × 768 (Landscape)', width: 1344, height: 768, planRequired: 'pro' },
  ];

  const premiumOptions: ResolutionOption[] = [
    { label: '2048 × 2048', width: 2048, height: 2048, planRequired: 'premium' },
    { label: '1024 × 1792 (Tall Portrait)', width: 1024, height: 1792, planRequired: 'premium' },
    { label: '1792 × 1024 (Wide Landscape)', width: 1792, height: 1024, planRequired: 'premium' },
    { label: '1152 × 896 (4:3)', width: 1152, height: 896, planRequired: 'premium' },
    { label: '896 × 1152 (3:4)', width: 896, height: 1152, planRequired: 'premium' },
    { label: '1216 × 832 (3:2)', width: 1216, height: 832, planRequired: 'premium' },
    { label: '832 × 1216 (2:3)', width: 832, height: 1216, planRequired: 'premium' },
  ];

  let availableOptions = [...baseOptions];

  if (userPlan === 'pro' || userPlan === 'premium') {
    availableOptions = [...availableOptions, ...proOptions];
  }

  if (userPlan === 'premium') {
    availableOptions = [...availableOptions, ...premiumOptions];
  }

  return availableOptions;
};

const getPlanColor = (planRequired: string) => {
  switch (planRequired) {
    case 'pro':
      return 'text-purple-600';
    case 'premium':
      return 'text-pink-600';
    default:
      return 'text-gray-600';
  }
};

const getPlanBadge = (planRequired: string) => {
  switch (planRequired) {
    case 'pro':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 ml-2">
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </span>
      );
    case 'premium':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800 ml-2">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </span>
      );
    default:
      return null;
  }
};

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  selectedResolution,
  onResolutionChange,
  userPlan = 'free',
}) => {
  const resolutionOptions = getResolutionOptions(userPlan);

  const isOptionDisabled = (option: ResolutionOption) => {
    if (option.planRequired === 'free') return false;
    if (option.planRequired === 'pro' && (userPlan === 'pro' || userPlan === 'premium')) return false;
    if (option.planRequired === 'premium' && userPlan === 'premium') return false;
    return true;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Resolution
      </label>
      <select
        value={`${selectedResolution.width}x${selectedResolution.height}`}
        onChange={(e) => {
          const [width, height] = e.target.value.split('x').map(Number);
          const resolution = resolutionOptions.find(
            (r) => r.width === width && r.height === height
          );
          if (resolution && !isOptionDisabled(resolution)) {
            onResolutionChange(resolution);
          }
        }}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {resolutionOptions.map((option) => {
          const disabled = isOptionDisabled(option);
          return (
            <option
              key={`${option.width}x${option.height}`}
              value={`${option.width}x${option.height}`}
              disabled={disabled}
              className={disabled ? 'text-gray-400' : ''}
            >
              {option.label} {disabled ? '(Requires ' + option.planRequired + ' plan)' : ''}
            </option>
          );
        })}
      </select>
      
      {userPlan === 'free' && (
        <div className="mt-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Crown className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-purple-900 mb-1">Unlock More Resolutions</p>
              <p className="text-purple-700">
                <strong>Pro Plan:</strong> Portrait & landscape formats
              </p>
              <p className="text-purple-700">
                <strong>Premium Plan:</strong> All aspect ratios + ultra-high resolution
              </p>
            </div>
          </div>
        </div>
      )}

      {userPlan === 'pro' && (
        <div className="mt-2 p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Crown className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-pink-900 mb-1">Premium Exclusive</p>
              <p className="text-pink-700">
                Upgrade to Premium for ultra-high resolution (2048×2048) and custom aspect ratios!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};