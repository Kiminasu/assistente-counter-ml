import React, { useState } from 'react';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabbedPanelProps {
    tabs: Tab[];
}

const TabbedPanel: React.FC<TabbedPanelProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <aside className="col-span-1 glassmorphism p-4 rounded-xl animated-entry flex flex-col lg:h-[85vh] border-2 panel-glow-primary">
            <nav className="flex-shrink-0 -mx-4 -mt-4 mb-4 flex" aria-label="Tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(index)}
                        className={`${
                            activeTab === index
                                ? 'bg-violet-600 text-white'
                                : 'bg-black bg-opacity-20 text-gray-400 hover:bg-gray-800 hover:text-white'
                        } flex-1 text-center whitespace-nowrap py-3 px-1 font-bold text-sm sm:text-base transition-colors first:rounded-tl-lg last:rounded-tr-lg`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            <div className="flex-1 overflow-y-auto">
                {tabs[activeTab].content}
            </div>
        </aside>
    );
};

export default TabbedPanel;