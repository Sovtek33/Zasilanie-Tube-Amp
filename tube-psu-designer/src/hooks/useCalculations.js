import { useMemo } from 'react';
import { RECTIFIERS } from '../data/tubes';
import {
    calculateSectionCurrent,
    calculateVoltageDrop,
    calculateTubeVoltages,
    calculateAttenuation,
    vpp
} from '../utils/calculations';

/**
 * Custom hook do wszystkich obliczeñ zasilacza
 * @param {number} vac - napiêcie AC transformatora
 * @param {string} rect - typ prostownika
 * @param {Array} stages - tablica sekcji
 * @returns {Object} - wyniki obliczeñ i statystyki
 */
export const useCalculations = (vac, rect, stages) => {
    // Obliczenia wyników dla ka¿dej sekcji
    const results = useMemo(() => {
        const rectDrop = RECTIFIERS[rect].drop;
        const Vpk = vac * Math.SQRT2 - rectDrop;
        let V = Vpk;

        return stages.map((s, i) => {
            // Oblicz pr¹d na podstawie typu obci¹¿enia
            const I = calculateSectionCurrent(s.load);

            // Dodatkowy spadek napiêcia (DCR, rezystor G2)
            const additionalDrop = calculateVoltageDrop(s.load, I);

            // Ca³kowity spadek: dodatkowy + RC/LC
            V -= additionalDrop;

            // Dla LC, spadek jest minimalny (tylko rezystancja DCR cewki)
            if (s.filterType === 'LC' && s.L) {
                const dcr_coil = 10; // Typowe DCR cewki w omach
                V -= dcr_coil * I / 1000;
            } else {
                V -= s.R * I / 1000;
            }

            // Têtnienia z uwzglêdnieniem typu filtra
            const rawRipple = vpp(I, s.C);
            const attenuation = calculateAttenuation(s, 100);
            const mV = rawRipple * attenuation;

            // Oblicz napiêcia na pinach lamp
            const tubeVoltages = calculateTubeVoltages(s, V);

            // Opis obci¹¿enia
            let loadDesc = "";
            if (s.load) {
                switch (s.load.type) {
                    case "power":
                        loadDesc = `${s.load.config} ${s.load.tubes}`;
                        break;
                    case "g2":
                        loadDesc = `G2 ${s.load.tubes}`;
                        break;
                    case "inverter":
                        loadDesc = s.load.inverterType;
                        break;
                    case "preamp":
                        loadDesc = `${s.load.count}× ${s.load.tubes}`;
                        break;
                    default:
                        loadDesc = "";
                        break;
                }
            }

            return {
                ...s,
                U: V.toFixed(1),
                I: I.toFixed(1),
                mV,
                loadDesc,
                tubeVoltages
            };
        });
    }, [vac, rect, stages]);

    // Obliczenia statystyk
    const statistics = useMemo(() => {
        const totalCurrent = results.reduce((sum, r) => sum + parseFloat(r.I), 0);
        const totalPowerOnResistors = results.reduce((sum, r) => sum + (r.R * Math.pow(r.I / 1000, 2)), 0);
        const voltageDrop = results.length > 0 ? parseFloat(results[0]?.U) - parseFloat(results[results.length - 1]?.U) : 0;
        const finalRipple = results.length > 0 ? results[results.length - 1]?.mV : 0;
        const peakVoltage = vac * Math.SQRT2 - RECTIFIERS[rect].drop;
        const efficiency = results.length > 0 ? (parseFloat(results[results.length - 1]?.U || 0) / peakVoltage) * 100 : 0;

        return {
            totalCurrent,
            totalPowerOnResistors,
            voltageDrop,
            finalRipple,
            peakVoltage,
            efficiency
        };
    }, [results, vac, rect]);

    return {
        results,
        statistics
    };
};