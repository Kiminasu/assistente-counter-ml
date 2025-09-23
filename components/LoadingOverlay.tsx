
import React from 'react';

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center z-50 transition-opacity duration-300">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
            <p className="mt-4 text-xl text-white">{message}</p>
        </div>
    );
};

export default LoadingOverlay;
