import React from 'react';
import ModeSelector from './ModeSelector';

const Header = ({ mode, onModeChange }) => {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-indigo-300">
                        Tube PSU Designer v6.0
                    </h1>
                    <p className="text-slate-400">
                        Professional Edition - Zaawansowany projektant zasilaczy lampowych
                    </p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <span className="text-xs text-slate-500">Professional</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Prze³¹cznik trybu */}
            <ModeSelector mode={mode} onModeChange={onModeChange} />
        </>
    );
};

export default Header;