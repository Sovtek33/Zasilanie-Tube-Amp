import { useCallback } from 'react';
import { exportConfig, importConfig, exportToCSV } from '../utils/fileUtils';
import { POWER_TUBES, SECTION_TYPES } from '../data/tubes';

/**
 * Custom hook do obs³ugi importu/eksportu konfiguracji
 * @param {Object} params - parametry aplikacji i funkcje setterów
 * @returns {Object} - funkcje do importu/eksportu
 */
export const useImportExport = ({
    vac, setVac,
    rect, setRect,
    powerTubeType, setPowerTubeType,
    powerConfig, setPowerConfig,
    stages, setStages,
    setMode
}) => {

    // Import konfiguracji z pliku
    const handleImport = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            importConfig(file, (config) => {
                if (config.vac) setVac(config.vac);
                if (config.rectifier) setRect(config.rectifier);

                // Import konfiguracji lamp mocy
                if (config.powerTubeType) setPowerTubeType(config.powerTubeType);
                if (config.powerConfig) setPowerConfig(config.powerConfig);

                if (config.stages) {
                    setStages(config.stages.map((s, idx) => ({
                        ...s,
                        id: Date.now() + idx
                    })));
                }
            });
        }
        // Reset input
        e.target.value = '';
    }, [setVac, setRect, setPowerTubeType, setPowerConfig, setStages]);

    // Eksport konfiguracji do pliku
    const handleExport = useCallback(() => {
        const configToExport = {
            vac,
            rectifier: rect,
            powerTubeType,
            powerConfig,
            stages
        };
        exportConfig(
            configToExport.vac,
            configToExport.rectifier,
            configToExport.stages,
            configToExport.powerTubeType,
            configToExport.powerConfig
        );
    }, [vac, rect, stages, powerTubeType, powerConfig]);

    // Eksport do CSV
    const handleExportCSV = useCallback((results) => {
        exportToCSV(results, vac, rect);
    }, [vac, rect]);

    // £adowanie presetu
    const loadPreset = useCallback((preset) => {
        setVac(preset.vac);
        setRect(preset.rectifier);

        // Ustaw konfiguracjê lamp mocy z presetu
        if (preset.powerStage) {
            const parts = preset.powerStage.split(' ');
            const tubeType = parts[0];
            const config = parts[1] === "PP" ? "Push-Pull" :
                parts[1] === "SE" ? "Single-Ended" : "Push-Pull";

            if (POWER_TUBES[tubeType]) {
                setPowerTubeType(tubeType);
                setPowerConfig(config);
            }
        }

        // Konwersja starego formatu na nowy
        const newStages = preset.stages.map((stage, idx) => {
            const sectionType = SECTION_TYPES[stage.name];
            let load = sectionType?.defaultLoad || {
                type: "preamp",
                tubes: "12AX7",
                count: 1,
                Ra: 100000
            };

            // Dostosowanie dla presetu - sekcja A (lampy mocy)
            if (idx === 0 && preset.powerStage) {
                const parts = preset.powerStage.split(' ');
                const tubeType = parts[0];

                // SprawdŸ czy typ lampy istnieje w POWER_TUBES
                if (POWER_TUBES[tubeType]) {
                    const config = parts[1] === "PP" ? "Push-Pull" :
                        parts[1] === "SE" ? "Single-Ended" : "Push-Pull";
                    load = {
                        type: "power",
                        tubes: tubeType,
                        config: config,
                        dcr: 100
                    };
                }
            }
            // Sekcja B (siatki G2 - tylko dla pentod/beam tetrode)
            else if (idx === 1 && preset.powerStage) {
                const parts = preset.powerStage.split(' ');
                const tubeType = parts[0];

                // Tylko dla lamp z siatk¹ G2 (nie triody)
                if (POWER_TUBES[tubeType] && POWER_TUBES[tubeType].type !== "triode") {
                    const config = parts[1] === "PP" ? "Push-Pull" :
                        parts[1] === "SE" ? "Single-Ended" : "Push-Pull";
                    load = {
                        type: "g2",
                        tubes: tubeType,
                        config: config,
                        resistor: 470
                    };
                }
            }
            // Sekcja C - zwykle inverter fazowy
            else if (idx === 2 && preset.powerStage) {
                load = {
                    type: "inverter",
                    inverterType: "Long-tail pair",
                    Ra: 100000
                };
            }
            // Sekcja D i dalsze - preamp
            else if (idx >= 3 || (idx >= 2 && !preset.powerStage)) {
                const triodeCount = preset.triodes || 4;
                const triodePerSection = Math.max(1, Math.floor(triodeCount / (preset.stages.length - 2)));
                load = {
                    type: "preamp",
                    tubes: "12AX7",
                    count: Math.min(triodePerSection, 2),
                    Ra: 100000
                };
            }

            return {
                ...stage,
                id: Date.now() + idx,
                filterType: stage.filterType || "RC",
                L: stage.L,
                load: load
            };
        });

        setStages(newStages);
        setMode("expert"); // Prze³¹cz na tryb expert po za³adowaniu presetu
    }, [setVac, setRect, setPowerTubeType, setPowerConfig, setStages, setMode]);

    return {
        handleImport,
        handleExport,
        handleExportCSV,
        loadPreset
    };
};