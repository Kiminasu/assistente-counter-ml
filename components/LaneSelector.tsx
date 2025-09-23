import React from 'react';
import { Lane, LANES } from '../types';

interface LaneSelectorProps {
    activeLane: Lane;
    onSelectLane: (lane: Lane) => void;
}

const LaneSelector: React.FC<LaneSelectorProps> = ({ activeLane, onSelectLane }) => {
    return (
        <div className="glassmorphism p-4 rounded-xl animated-entry border-2 border-yellow-400 shadow-lg shadow-yellow-400/20" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-bold text-center mb-3">SELECIONE A LANE</h2>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {LANES.map(lane => (
                    <button 
                        key={lane}
                        onClick={() => onSelectLane(lane)}
                        className={`lane-btn font-semibold py-2 rounded text-sm sm:text-base ${activeLane === lane ? 'active' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {lane}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LaneSelector;