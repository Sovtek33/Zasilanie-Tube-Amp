import { useState, useCallback, useEffect } from 'react';
import { SECTION_TYPES } from '../data/tubes';
import { pRes } from '../utils/calculations';

/**
 * Custom hook do zarz¹dzania sekcjami zasilacza
 * @param {string} powerTubeType - typ lampy mocy
 * @param {string} powerConfig - konfiguracja (SE/PP/PPP)
 */
export const useStages = (powerTubeType, powerConfig) => {
    // Inicjalizacja sekcji z domyœlnymi obci¹¿eniami
    const initStages = [
        {
            id: 1,
            name: "A",
            R: 0,
            C: 47,
            filterType: "RC",
            load: {
                type: "power",
                tubes: powerTubeType,
                config: powerConfig,
                dcr: 100
            }
        },
        {
            id: 2,
            name: "B",
            R: 1000,
            C: 47,
            filterType: "RC",
            load: {
                type: "g2",
                tubes: powerTubeType,
                config: powerConfig,
                resistor: 470
            }
        },
        {
            id: 3,
            name: "C",
            R: 10000,
            C: 22,
            filterType: "RC",
            load: SECTION_TYPES.C.defaultLoad
        },
        {
            id: 4,
            name: "D",
            R: 47000,
            C: 22,
            filterType: "RC",
            load: SECTION_TYPES.D.defaultLoad
        }
    ];

    const [stages, setStages] = useState(initStages);

    // Synchronizacja lamp mocy z sekcjami A i B
    useEffect(() => {
        setStages(prevStages => prevStages.map(stage => {
            if (stage.load?.type === "power") {
                return {
                    ...stage,
                    load: {
                        ...stage.load,
                        tubes: powerTubeType,
                        config: powerConfig
                    }
                };
            } else if (stage.load?.type === "g2") {
                return {
                    ...stage,
                    load: {
                        ...stage.load,
                        tubes: powerTubeType,
                        config: powerConfig
                    }
                };
            }
            return stage;
        }));
    }, [powerTubeType, powerConfig]);

    // Aktualizacja sekcji
    const updateStage = useCallback((id, key, value) => {
        setStages(prev => prev.map(stage =>
            stage.id === id
                ? { ...stage, [key]: key === "R" ? pRes(value) : value }
                : stage
        ));
    }, []);

    // Dodawanie nowej sekcji
    const addStage = useCallback(() => {
        setStages(prev => {
            const nextName = String.fromCharCode(65 + prev.length);
            const isPreampSection = prev.length >= 3;

            const defaultLoad = prev.length < 4 ?
                SECTION_TYPES[nextName]?.defaultLoad :
                {
                    type: "preamp",
                    tubes: "12AX7",
                    count: 2,
                    Ra: 100000,
                    separateRa: isPreampSection,
                    RaArray: isPreampSection ? new Array(4).fill(100000) : null
                };

            return [...prev, {
                id: Date.now(),
                name: nextName,
                R: 10000,
                C: 22,
                filterType: "RC",
                load: defaultLoad
            }];
        });
    }, []);

    // Usuwanie sekcji
    const deleteStage = useCallback((id) => {
        setStages(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
    }, []);

    return {
        stages,
        setStages,
        updateStage,
        addStage,
        deleteStage
    };
};