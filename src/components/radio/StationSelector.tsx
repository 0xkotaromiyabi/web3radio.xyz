import React from 'react';
import { Radio as RadioIcon } from 'lucide-react';

interface StationSelectorProps {
  currentStation: string;
  onStationChange: (station: 'web3' | 'indonesia') => void;
}

const StationSelector = ({ currentStation, onStationChange }: StationSelectorProps) => {
  return (
    <div className="mb-4 flex gap-2 justify-center">
      <button
        onClick={() => onStationChange('web3')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'web3' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        }`}
      >
        <RadioIcon size={16} />
        Web3 Radio
      </button>
      <button
        onClick={() => onStationChange('indonesia')}
        className={`px-4 py-2 rounded-full flex items-center gap-2 ${
          currentStation === 'indonesia' 
            ? 'bg-[#00ff00] text-black' 
            : 'bg-[#333] text-gray-300'
        }`}
      >
        <RadioIcon size={16} />
        Radio Indonesia
      </button>
    </div>
  );
};

export default StationSelector;