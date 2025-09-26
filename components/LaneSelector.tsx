import React from 'react';
import { LaneOrNone, LANES_WITH_NONE } from '../types';
import { LANE_ICONS } from '../constants';

interface LaneSelectorProps {
    activeLane: LaneOrNone;
    onSelectLane: (lane: LaneOrNone) => void;
    isDisabled?: boolean;
}

const LaneSelector: React.FC<LaneSelectorProps> = ({ activeLane, onSelectLane, isDisabled = false }) => {
    return (
        <div className={`glassmorphism p-4 rounded-2xl animated-entry border-2 panel-glow-primary transition-opacity duration-300 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <h2 className="text-xl font-bold text-center mb-3">SELECIONE A LANE</h2>
            <div className="flex flex-wrap justify-center gap-2">
                {LANES_WITH_NONE.map(lane => (
                    <button 
                        key={lane}
                        onClick={() => onSelectLane(lane)}
                        disabled={isDisabled}
                        className={`lane-btn font-semibold text-sm py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200 ${activeLane === lane ? 'active' : 'bg-slate-800 hover:bg-slate-700'} disabled:opacity-70 disabled:hover:bg-slate-800 disabled:cursor-not-allowed`}
                    >
                        <img src={LANE_ICONS[lane]} alt={lane} className="w-5 h-5 object-contain" />
                        <span>{lane}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LaneSelector;
