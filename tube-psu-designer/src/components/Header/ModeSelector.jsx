import React from 'react';

const ModeSelector = ({ mode, onModeChange }) => {
    return (
        <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700">
                <button
                    onClick={() => onModeChange("expert")}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${mode === "expert"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                    title="Tryb eksperta - pełna kontrola nad wszystkimi parametrami"
                >
                    🔧 Ekspert
                </button>
                <button
                    onClick={() => onModeChange("wizard")}
                    className={`px-4 py-2 rounded-md transition-all duration-200 ${mode === "wizard"
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                    title="Kreator - prowadzony proces projektowania"
                >
                    🧙 Kreator
                </button>
            </div>
        </div>
    );
};

export default ModeSelector;