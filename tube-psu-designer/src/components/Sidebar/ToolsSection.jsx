import React from 'react';

const ToolsSection = ({
    onImport, onExport, onExportCSV,
    showChart, setShowChart,
    showAdvanced, setShowAdvanced
}) => {
    return (
        <div className="psu-card space-y-5">
            <h3 className="text-lg font-semibold">Narzędzia</h3>

            {/* Import/Export */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={onExport}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-base flex items-center justify-center gap-2"
                    title="Eksportuj konfigurację do pliku JSON"
                >
                    📤 Export
                </button>
                <label className="relative">
                    <input
                        type="file"
                        accept=".json"
                        onChange={onImport}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="block px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-base text-center cursor-pointer">
                        📥 Import
                    </span>
                </label>
            </div>

            {/* Dodatkowe eksporty */}
            <div className="grid grid-cols-1 gap-3">
                <button
                    onClick={onExportCSV}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-base"
                    title="Eksportuj analizę do CSV"
                >
                    📊 Eksport CSV
                </button>
            </div>

            {/* Toggle wykres */}
            <button
                onClick={() => setShowChart(!showChart)}
                className={`w-full px-4 py-3 rounded-lg transition-colors text-base ${showChart
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
            >
                {showChart ? "🔽 Ukryj wykres" : "📊 Pokaż wykres napięć"}
            </button>

            {/* Toggle zaawansowane */}
            <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`w-full px-4 py-3 rounded-lg transition-colors text-base ${showAdvanced
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
            >
                {showAdvanced ? "🔼 Ukryj zaawansowane" : "⚙️ Opcje zaawansowane"}
            </button>
        </div>
    );
};

export default ToolsSection;