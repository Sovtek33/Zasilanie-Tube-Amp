/*  App.js — Główny komponent aplikacji Tube PSU Designer
 *  (c) 2025 Wiśnia / PSU Designer v6.0 Professional Edition
 *  ------------------------------------------------- */

import React, { useState } from 'react';

// Import custom hooks
import { useStages } from './hooks/useStages';
import { usePowerConfig } from './hooks/usePowerConfig';
import { useCalculations } from './hooks/useCalculations';
import { useImportExport } from './hooks/useImportExport';

// Import komponentów
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainPanel from './components/MainPanel/MainPanel';
import WizardMode from './components/WizardMode';

function App() {
    // Stan podstawowy
    const [vac, setVac] = useState(350);
    const [rect, setRect] = useState("Silicon Bridge");
    const [mode, setMode] = useState("expert");
    const [showChart, setShowChart] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Custom hooks
    const { powerTubeType, powerConfig, setPowerTubeType, setPowerConfig } = usePowerConfig();
    const { stages, updateStage, addStage, deleteStage, setStages, syncPowerTubes } = useStages(powerTubeType, powerConfig);
    const { results, statistics } = useCalculations(vac, rect, stages);
    const { handleImport, handleExport, handleExportCSV, loadPreset } = useImportExport({
        vac, setVac,
        rect, setRect,
        powerTubeType, setPowerTubeType,
        powerConfig, setPowerConfig,
        stages, setStages,
        setMode
    });

    // Aplikowanie konfiguracji z kreatora
    const applyWizardConfig = (config) => {
        setVac(config.vac);
        setRect(config.rectifier);
        if (config.powerTubeType) setPowerTubeType(config.powerTubeType);
        if (config.powerConfig) setPowerConfig(config.powerConfig);
        setStages(config.stages);
    };

    return (
        <main className="w-full px-6 lg:px-12 xl:px-16 2xl:px-20 py-8">
            <Header mode={mode} onModeChange={setMode} />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-[420px] xl:w-[480px] 2xl:w-[520px] space-y-6">
                    {mode === "wizard" ? (
                        <WizardMode
                            onApplyConfig={applyWizardConfig}
                            onSwitchToExpert={() => setMode("expert")}
                        />
                    ) : (
                        <Sidebar
                            vac={vac}
                            setVac={setVac}
                            rect={rect}
                            setRect={setRect}
                            powerTubeType={powerTubeType}
                            setPowerTubeType={setPowerTubeType}
                            powerConfig={powerConfig}
                            setPowerConfig={setPowerConfig}
                            onLoadPreset={loadPreset}
                            onImport={handleImport}
                            onExport={handleExport}
                            onExportCSV={() => handleExportCSV(results)}
                            showChart={showChart}
                            setShowChart={setShowChart}
                            showAdvanced={showAdvanced}
                            setShowAdvanced={setShowAdvanced}
                            statistics={statistics}
                            currentConfig={{ vac, rectifier: rect, stages, powerTubeType, powerConfig }}
                        />
                    )}
                </aside>

                {/* Main panel */}
                <section className="flex-1 space-y-8">
                    {mode === "expert" && (
                        <MainPanel
                            stages={stages}
                            results={results}
                            onUpdateStage={updateStage}
                            onAddStage={addStage}
                            onDeleteStage={deleteStage}
                            showChart={showChart}
                            showAdvanced={showAdvanced}
                            vac={vac}
                            rect={rect}
                            statistics={statistics}
                        />
                    )}
                </section>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-xs text-slate-500 border-t border-slate-800 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>PSU Designer v6.0 © 2025 | Professional Edition</div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                        <span>Rozszerzona baza lamp: 10 prostowników</span>
                        <span>•</span>
                        <span>Wsparcie filtrów LC/RC</span>
                        <span>•</span>
                        <span>Analiza napięć na pinach</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}

export default App;