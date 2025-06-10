import React from 'react';
import PresetManager from '../PresetManager';
import ParametersSection from './ParametersSection';
import PowerTubesConfig from './PowerTubesConfig';
import ToolsSection from './ToolsSection';
import StatisticsSection from './StatisticsSection';

const Sidebar = ({
    vac, setVac,
    rect, setRect,
    powerTubeType, setPowerTubeType,
    powerConfig, setPowerConfig,
    onLoadPreset,
    onImport, onExport, onExportCSV,
    showChart, setShowChart,
    showAdvanced, setShowAdvanced,
    statistics,
    currentConfig
}) => {
    return (
        <div className="space-y-6">
            {/* PRESET MANAGER */}
            <PresetManager
                onLoadPreset={onLoadPreset}
                currentConfig={currentConfig}
            />

            {/* Podstawowe parametry */}
            <div className="psu-card space-y-5">
                <h3 className="text-lg font-semibold">Parametry podstawowe</h3>

                <ParametersSection
                    vac={vac}
                    setVac={setVac}
                    rect={rect}
                    setRect={setRect}
                />

                <PowerTubesConfig
                    powerTubeType={powerTubeType}
                    setPowerTubeType={setPowerTubeType}
                    powerConfig={powerConfig}
                    setPowerConfig={setPowerConfig}
                />
            </div>

            {/* Import/Export i narzędzia */}
            <ToolsSection
                onImport={onImport}
                onExport={onExport}
                onExportCSV={onExportCSV}
                showChart={showChart}
                setShowChart={setShowChart}
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
            />

            {/* Statystyki */}
            <StatisticsSection statistics={statistics} />
        </div>
    );
};

export default Sidebar;