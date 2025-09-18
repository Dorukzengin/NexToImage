import React from 'react';
import { ResolutionOption } from '../types';

interface ResolutionSelectorProps {
  selectedResolution: ResolutionOption;
  onResolutionChange: (resolution: ResolutionOption) => void;
}

const resolutionOptions: ResolutionOption[] = [
  { label: '512 × 512', width: 512, height: 512 },
  { label: '1024 × 1024', width: 1024, height: 1024 },
  { label: '2048 × 2048', width: 2048, height: 2048 },
];

export const ResolutionSelector: React.FC<ResolutionSelectorProps> = ({
  selectedResolution,
  onResolutionChange,
}) => {
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
          if (resolution) {
            onResolutionChange(resolution);
          }
        }}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        {resolutionOptions.map((option) => (
          <option
            key={`${option.width}x${option.height}`}
            value={`${option.width}x${option.height}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};