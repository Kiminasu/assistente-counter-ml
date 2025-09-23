import React from 'react';
import { Role, ROLES } from '../types';

interface RoleSelectorProps {
    activeRole: Role;
    onSelectRole: (role: Role) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ activeRole, onSelectRole }) => {
    return (
        <div className="glassmorphism p-4 rounded-xl animated-entry border-2 border-yellow-400 shadow-lg shadow-yellow-400/20" style={{ animationDelay: '150ms' }}>
            <h2 className="text-xl font-bold text-center mb-3">QUAL SUA FUNÇÃO?</h2>
            <div className="flex flex-wrap justify-center gap-2">
                {ROLES.map(role => (
                    <button 
                        key={role}
                        onClick={() => onSelectRole(role)}
                        className={`lane-btn font-semibold py-2 px-3 rounded text-xs sm:text-sm transition-colors duration-200 ${activeRole === role ? 'active' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {role}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RoleSelector;