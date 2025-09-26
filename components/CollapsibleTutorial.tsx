import React, { useState } from 'react';

interface CollapsibleTutorialProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleTutorial: React.FC<CollapsibleTutorialProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="text-sm text-gray-400 bg-black bg-opacity-20 rounded-2xl border border-slate-700 w-full animated-entry">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 flex justify-between items-center cursor-pointer text-left"
                aria-expanded={isOpen}
                aria-controls={`tutorial-content-${title.replace(/\s+/g, '-')}`}
            >
                <p className="font-bold text-amber-400">{title}</p>
                <div className={`text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </button>
            <div
                id={`tutorial-content-${title.replace(/\s+/g, '-')}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="px-4 pb-3">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CollapsibleTutorial;
