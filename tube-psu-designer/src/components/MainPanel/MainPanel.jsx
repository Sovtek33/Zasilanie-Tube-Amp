import React from 'react';
import StagesTable from './StagesTable';
import VoltageChart from '../VoltageChart';
import AdvancedOptions from './AdvancedOptions';
import Schematic from '../Schematic';
import { RECTIFIERS } from '../../data/tubes';

const MainPanel = ({
    stages,
    results,
    onUpdateStage,
    onAddStage,
    onDeleteStage,
    showChart,
    showAdvanced,
    vac,
    rect,
    statistics
}) => {
    return (
        <>
            {/* Tabela konfiguracji */}
            <StagesTable
                stages={stages}
                results={results}
                onUpdateStage={onUpdateStage}
                onAddStage={onAddStage}
                onDeleteStage={onDeleteStage}
            />

            {/* Wykres napięć */}
            {showChart && results.length > 0 && (
                <VoltageChart
                    results={results}
                    vPeak={vac * Math.SQRT2 - RECTIFIERS[rect].drop}
                />
            )}

            {/* Zaawansowane opcje */}
            {showAdvanced && (
                <AdvancedOptions statistics={statistics} />
            )}

            {/* Schemat */}
            <Schematic stages={stages} results={results} />
        </>
    );
};

export default MainPanel;