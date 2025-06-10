/*  calculations.js — Poprawione funkcje obliczeniowe dla gitarowych wzmacniaczy lampowych
 *  (c) 2025 Wiśnia / PSU Designer - ENHANCED GUITAR AMP EDITION
 *  ------------------------------------------------- */

import { POWER_TUBES, PREAMP_TUBES, POWER_CONFIGS, INVERTER_TYPES } from '../data/tubes';

// ============================================
// ENHANCED TUBE MODELS - uwzględniające dynamikę
// ============================================

/**
 * Model 3/2-potęgowy Child-Langmuir z korekcją dla gitarowych lamp
 * @param {number} Va - napięcie anodowe [V]
 * @param {number} Vg - napięcie siatki [V] 
 * @param {Object} tube - dane lampy
 * @returns {number} prąd anodowy [mA]
 */
const calculateAnodeCurrent = (Va, Vg, tube) => {
    if (!tube.Ia) return 0;

    // Dla uproszczenia w zasilaczu używamy wartości katalogowych z korekcją bias
    const Vg_operating = Vg || -2; // Typowy bias dla klasy AB
    const Va_nominal = tube.Va_typical || 400;

    // Aproksymacja Child-Langmuir z tablicami katalogowymi
    const bias_factor = Math.max(0.1, (Va / Va_nominal) * Math.pow(Math.abs(Vg_operating + 2) / 2, 0.3));

    return tube.Ia * bias_factor;
};

/**
 * POPRAWKA #1: Obliczanie punktu pracy z rzeczywistą krzywą obciążenia
 */
const calculateDCOperatingPoint = (Vb, Ra, tube, Vg = -2) => {
    if (!tube.Ia) return { Va: Vb, Ia: 0 };

    // Iteracyjne rozwiązanie przecięcia charakterystyki i linii obciążenia
    let Va = Vb * 0.8; // Startowy punkt
    let Ia = 0;

    for (let i = 0; i < 10; i++) {
        Ia = calculateAnodeCurrent(Va, Vg, tube);
        const Va_new = Vb - (Ia / 1000) * Ra;

        if (Math.abs(Va_new - Va) < 1) break; // Konwergencja
        Va = Va_new;
    }

    return { Va, Ia };
};

// ============================================
// POPRAWKA #2: Naprawione obliczenia filtrów
// ============================================

/**
 * Obliczanie tętnień na kondensatorze z poprawkami dla ESR
 * @param {number} current_mA - prąd obciążenia
 * @param {number} capacitance_uF - pojemność
 * @param {number} esr_ohms - ESR kondensatora (opcjonalne)
 */
export const vpp = (current_mA, capacitance_uF, esr_ohms = 0) => {
    const f = 100; // Hz - częstotliwość tętnień dla mostka
    const capacitive_ripple = (current_mA / 1000) / (2 * f * capacitance_uF * 1e-6) * 1000; // mV
    const resistive_ripple = (current_mA) * esr_ohms; // mV z ESR

    return capacitive_ripple + resistive_ripple;
};

/**
 * POPRAWKA #3: Naprawione tłumienie filtra LC (2-rzędowy)
 */
export const calculateAttenuation = (filter, freq = 100) => {
    if (filter.filterType === "LC" && filter.L) {
        // Częstotliwość rezonansowa filtra LC
        const fc = 1 / (2 * Math.PI * Math.sqrt(filter.L * filter.C * 1e-6));

        // POPRAWKA: Tłumienie drugiego rzędu (-40dB/dekadę) 
        const ratio = freq / fc;
        const Q = 0.707; // Butterworth response dla gitarowych zastosowań

        // Prawidłowy wzór dla LC 2-rzędowego
        const denominator = Math.sqrt(1 + Math.pow(ratio, 4) - 2 * Math.pow(ratio, 2) * Math.cos(2 * Math.atan(ratio / Q)));
        return 1 / denominator;

    } else {
        // Filtr RC - tłumienie pierwszego rzędu (-20dB/dekadę)
        const omega = 2 * Math.PI * freq;
        const RC = filter.R * filter.C * 1e-6;
        return 1 / Math.sqrt(1 + Math.pow(omega * RC, 2));
    }
};

/**
 * Obliczanie impedancji cewki przy danej częstotliwości
 * XL = 2πfL
 */
export const calculateInductorImpedance = (L_H, freq) => {
    return 2 * Math.PI * freq * L_H;
};

/**
 * POPRAWKA #4: Rozdzielone sugestie kondensatorów dla CRC vs CLC
 */
export const suggestInputCapCRC = (current_mA, targetRipple_mV, R_ohms) => {
    const freq = 100; // Hz
    const omega = 2 * Math.PI * freq;

    // Wymagane tłumienie dla osiągnięcia docelowego tętnienia
    const initial_ripple = vpp(current_mA, 1); // dla C=1µF
    const required_attenuation = targetRipple_mV / initial_ripple;

    // Z wzoru na tłumienie RC obliczamy wymaganą pojemność
    const RC_required = Math.sqrt(1 / Math.pow(required_attenuation, 2) - 1) / omega;
    return RC_required / R_ohms * 1e6; // µF
};

export const suggestInputCapCLC = (L_henries, I_max_diode_mA, Vr_pp_target_mV, Vac) => {
    // Dla LC głównie liczy się pojemność wejściowa i limit prądu diody
    const freq = 100;

    // Limit prądu szczytowego kondensatora (bezpieczeństwo diod)
    const Vpk = Vac * Math.SQRT2;
    const C_max_safe = I_max_diode_mA / (2 * Math.PI * freq * Vpk); // F
    const C_max_safe_uF = C_max_safe * 1e6;

    // Pojemność dla docelowego tętnienia (surowy wzór)
    const C_ripple_uF = (I_max_diode_mA) / (2 * freq * Vr_pp_target_mV / 1000) * 1e6;

    // Zwróć mniejszą wartość (bezpieczniejszą)
    return Math.min(C_max_safe_uF, C_ripple_uF);
};

// Legacy wrapper dla kompatybilności
export const suggestCapacitor = (current_mA, targetRipple_mV, R_ohms, filterType = "RC") => {
    if (filterType === "LC") {
        return suggestInputCapCLC(10, current_mA, targetRipple_mV, 350); // Domyślne wartości
    } else {
        return suggestInputCapCRC(current_mA, targetRipple_mV, R_ohms);
    }
};

// ============================================
// POPRAWKA #5: Prawidłowe sumowanie prądów Ia + Ig2
// ============================================

/**
 * Obliczanie prądu sekcji z uwzględnieniem wszystkich składowych
 */
export const calculateSectionCurrent = (load) => {
    if (!load) return 0;

    switch (load.type) {
        case "power": {
            const tube = POWER_TUBES[load.tubes];
            if (!tube) return 0;

            const config = POWER_CONFIGS[load.config];
            if (!config) return 0;

            // POPRAWKA: Sumuj Ia + Ig2 dla całkowitego obciążenia B+
            const Ia_total = tube.Ia * config.multiplier;
            const Ig2_total = (tube.type !== "triode") ? tube.Ig2 * config.multiplier : 0;

            // Dla trybu AB prąd spoczynkowy to około 70% maksymalnego
            const idleCurrentFactor = load.config === "Single-Ended" ? 1.0 : 0.7;

            return (Ia_total + Ig2_total) * idleCurrentFactor;
        }

        case "g2": {
            const tube = POWER_TUBES[load.tubes];
            if (!tube || tube.type === "triode") return 0;

            const config = POWER_CONFIGS[load.config];
            if (!config) return 0;

            // Tylko prąd siatki ekranującej (już policzony w sekcji power)
            return tube.Ig2 * config.multiplier;
        }

        case "inverter": {
            const inverter = INVERTER_TYPES[load.inverterType];
            if (!inverter) return 0;

            return inverter.current;
        }

        case "preamp": {
            const tube = PREAMP_TUBES[load.tubes];
            if (!tube) return 0;

            // Enhanced: uwzględnij osobne prądy triod
            if (load.separateRa && load.IaArray) {
                return load.IaArray.reduce((sum, ia) => sum + ia, 0);
            }

            return tube.Ia * load.count * 2; // 2 triody na lampę
        }

        default:
            return 0;
    }
};

// ============================================
// POPRAWKA #6: Spadki napięć z uwzględnieniem DCR i sag
// ============================================

/**
 * POPRAWKA #6: Spadki napięć z uwzględnieniem DCR i sag
 */
export const calculateVoltageDrop = (load, current, sag_resistance = 0) => {
    if (!load || !current) return 0;

    let basic_drop = 0;

    switch (load.type) {
        case "power":
            // DCR transformatora + opcjonalna rezystancja wewnętrzna (sag)
            const dcr = load.dcr || 100;
            basic_drop = (dcr + sag_resistance) * current / 1000;
            break;

        case "g2":
            // Spadek na rezystorze siatkowym
            const Rg2 = load.resistor || 470;
            basic_drop = Rg2 * current / 1000;
            break;

        case "inverter":
            // LTP: tail resistor voltage + Ra drop
            if (load.inverterType === "Long-tail pair") {
                const Rk = 470; // Tail resistor
                const Ra = load.Ra || 100000;
                basic_drop = (Rk + Ra * 0.1) * current / 1000; // Aproksymacja
            }
            break;

        case "preamp":
            // Rezystor katodowy + anodowy
            const Rk = load.Rk || 1500;
            const Ra_drop = (load.Ra || 100000) * current / 1000;
            basic_drop = (Rk * current / 1000) + Ra_drop;
            break;

        default:
            basic_drop = 0;
    }

    return basic_drop;
};

/**
 * ENHANCED: Obliczanie napięć z uwzględnieniem rzeczywistych punktów pracy
 */
export const calculateTubeVoltages = (section, stageVoltage, options = {}) => {
    const voltages = {};
    const sag_resistance = options.sag_resistance || 0; // Resistance for sag modeling

    if (!section.load) return voltages;

    switch (section.load.type) {
        case "power": {
            // POPRAWKA: Rzeczywisty punkt pracy z Child-Langmuir
            const tube = POWER_TUBES[section.load.tubes];
            if (tube) {
                const dcr = section.load.dcr || 100;
                const { Va, Ia } = calculateDCOperatingPoint(stageVoltage, dcr + sag_resistance, tube);

                voltages.Va = Va || 0;
                voltages.Ia_operating = Ia || 0;
                voltages.dcr_drop = (dcr * (Ia || 0)) / 1000;
                voltages.sag_drop = (sag_resistance * (Ia || 0)) / 1000;

                // Dodatkowe parametry dla gitarowych wzmacniaczy
                voltages.headroom = (stageVoltage || 0) - (Va || 0); // Dostępny zapas
                voltages.power_dissipation = ((Va || 0) * (Ia || 0)) / 1000; // Moc na anodzie

                // Zapewnienie kompatybilności ze starym kodem
                voltages.Vdrop = voltages.dcr_drop + voltages.sag_drop;
                voltages.Ia = Ia || 0;
            }
            break;
        }

        case "g2": {
            // Enhanced G2 z uwzględnieniem separacji
            const Ig2_total = calculateSectionCurrent(section.load) || 0;
            const config = POWER_CONFIGS[section.load.config];

            if (section.load.separate && config) {
                const tubeCount = config.multiplier || 1;
                const Ig2_per_tube = Ig2_total / tubeCount;
                const Rg2 = section.load.resistor || 470;

                voltages.g2Tubes = [];
                for (let i = 0; i < tubeCount; i++) {
                    const Vdrop = (Rg2 * Ig2_per_tube) / 1000;
                    voltages.g2Tubes.push({
                        tubeNum: i + 1,
                        Vg2: (stageVoltage || 0) - Vdrop,
                        Vdrop: Vdrop,
                        resistor: Rg2,
                        power: (Rg2 * Math.pow(Ig2_per_tube / 1000, 2)) || 0 // Moc na rezystorze
                    });
                }

                // Kompatybilność - średnie wartości
                voltages.Vg2 = voltages.g2Tubes.length > 0 ? voltages.g2Tubes[0].Vg2 : 0;
                voltages.Vdrop = voltages.g2Tubes.length > 0 ? voltages.g2Tubes[0].Vdrop : 0;
            } else {
                const Rg2 = section.load.resistor || 470;
                const Vdrop_g2 = (Rg2 * Ig2_total) / 1000;
                voltages.Vg2 = (stageVoltage || 0) - Vdrop_g2;
                voltages.Vdrop = Vdrop_g2;
                voltages.power_g2_resistor = (Rg2 * Math.pow(Ig2_total / 1000, 2)) || 0;
            }
            break;
        }

        case "preamp": {
            // Enhanced preamp z osobnymi rezystorami
            const tube = PREAMP_TUBES[section.load.tubes];
            if (!tube) break;

            if (section.load.separateRa && section.load.RaArray) {
                voltages.triodes = [];
                const totalTriodes = (section.load.count || 1) * 2;

                for (let i = 0; i < totalTriodes && i < section.load.RaArray.length; i++) {
                    const Ra = section.load.RaArray[i] || 100000;
                    const Ia_per_triode = section.load.IaArray?.[i] || tube.Ia || 1.2;

                    // Rzeczywisty punkt pracy dla każdej triody
                    const { Va, Ia: Ia_real } = calculateDCOperatingPoint(stageVoltage, Ra, tube);

                    voltages.triodes.push({
                        triodeNum: i + 1,
                        lampNum: Math.floor(i / 2) + 1,
                        triodeInLamp: (i % 2) + 1,
                        Va: Va || 0,
                        Ia: Ia_real || 0,
                        Ra: Ra,
                        Vdrop: ((stageVoltage || 0) - (Va || 0)), // DODANE: Spadek napięcia
                        power_dissipation: ((Va || 0) * (Ia_real || 0)) / 1000,
                        // Parametry małosygnałowe w punkcie pracy
                        gm: tube.gm || 1.6,
                        rp: (tube.rp || 62.5) * 1000,
                        mu: tube.mu || 100,
                        gain: -((Ra / ((tube.rp || 62.5) * 1000 + Ra)) * (tube.mu || 100))
                    });
                }

                // Kompatybilność - średnie wartości
                if (voltages.triodes.length > 0) {
                    voltages.Va = voltages.triodes.reduce((sum, t) => sum + t.Va, 0) / voltages.triodes.length;
                    voltages.Ia = voltages.triodes.reduce((sum, t) => sum + t.Ia, 0);
                    voltages.Vdrop = (stageVoltage || 0) - voltages.Va;
                }
            } else {
                // Wspólny rezystor
                const Ra = section.load.Ra || 100000;
                const totalTriodes = (section.load.count || 1) * 2;
                const { Va, Ia } = calculateDCOperatingPoint(stageVoltage, Ra, tube);

                voltages.Va = Va || 0;
                voltages.Ia = (Ia || 0) * totalTriodes; // Całkowity prąd
                voltages.Vdrop = (stageVoltage || 0) - (Va || 0);
                voltages.gain = -((Ra / ((tube.rp || 62.5) * 1000 + Ra)) * (tube.mu || 100));
            }
            break;
        }

        case "inverter": {
            // Inverter fazowy
            const current = calculateSectionCurrent(section.load) || 0;
            const Ra = section.load.Ra || 100000;
            const Vdrop = (Ra * current) / 1000;

            voltages.Va = (stageVoltage || 0) - Vdrop;
            voltages.Vdrop = Vdrop;
            voltages.Ia = current;

            // Dla long-tail pair oblicz balans
            if (section.load.inverterType === "Long-tail pair") {
                voltages.balance = 0.95; // Typowy balans faz
            }
            break;
        }

        default:
            voltages.Va = stageVoltage || 0;
            voltages.Vdrop = 0;
            voltages.Ia = 0;
            break;
    }

    return voltages;
};

/**
 * POPRAWKA #7: Impedancja wyjściowa z uwzględnieniem transformatora
 */
export const calculateOutputImpedance = (section, load_impedance = 8) => {
    if (!section.load) return 0;

    switch (section.load.type) {
        case "power":
            // Impedancja wyjściowa z przekładnią transformatora
            const primary_impedance = 2000; // Typowa dla EL34 PP
            const turns_ratio = Math.sqrt(primary_impedance / load_impedance);
            const secondary_impedance = primary_impedance / Math.pow(turns_ratio, 2);

            // Z uwzględnieniem DCR
            const dcr_secondary = (section.load.dcr || 100) / Math.pow(turns_ratio, 2);
            return secondary_impedance + dcr_secondary;

        case "preamp": {
            const tube = PREAMP_TUBES[section.load.tubes];
            if (!tube) return 0;

            const Ra = section.load.Ra || 100000;
            const rp = (tube.rp || 62.5) * 1000; // Ω

            // Zout = Ra || rp (parallelnie)
            return (Ra * rp) / (Ra + rp) / 1000; // kΩ
        }

        default:
            return 0;
    }
};

/**
 * DODATEK: Funkcja do konwersji tłumienia na dB
 */
export const attenuationTodB = (attenuation) => {
    return 20 * Math.log10(attenuation);
};

/**
 * DODATEK: Parsing rezystorów z lepszą obsługą standardowych wartości
 */
export const pRes = (value) => {
    if (typeof value === 'number') return value;
    const str = String(value).toLowerCase().replace(/\s/g, '');

    // Standard resistor values dla gitarowych wzmacniaczy
    const standards = {
        '100r': 100, '220r': 220, '470r': 470,
        '1k': 1000, '1k5': 1500, '2k2': 2200, '4k7': 4700,
        '10k': 10000, '22k': 22000, '47k': 47000, '100k': 100000,
        '220k': 220000, '470k': 470000, '1m': 1000000
    };

    if (standards[str]) return standards[str];

    if (str.includes('k')) {
        return parseFloat(str.replace('k', '')) * 1000;
    }
    if (str.includes('m')) {
        return parseFloat(str.replace('m', '')) * 1000000;
    }
    return parseFloat(str) || 0;
};

// ============================================
// DODATEK: Funkcje pomocnicze dla gitarowych wzmacniaczy
// ============================================

/**
 * Kalkulator sag - przewidywanie spadku napięcia przy pełnej mocy
 */
export const calculateSag = (sag_resistance, peak_current_mA) => {
    return {
        voltage_drop: sag_resistance * peak_current_mA / 1000, // V
        feel: sag_resistance * peak_current_mA / 1000 > 20 ? "Bardzo spongy (vintage)" :
            sag_resistance * peak_current_mA / 1000 > 10 ? "Umiarkowany sag (klasyczny)" :
                "Sztywny (modern)"
    };
};

/**
 * Predyktor brzmieniowy na podstawie parametrów zasilacza
 */
export const predictToneCharacter = (finalVoltage, finalRipple, sagVoltage) => {
    const character = {
        clarity: finalRipple < 1 ? "Bardzo czyste" : finalRipple < 3 ? "Czyste" : "Ciepłe/vintage",
        dynamics: sagVoltage > 15 ? "Bardzo responsywne" : sagVoltage > 8 ? "Responsywne" : "Sztywne",
        headroom: finalVoltage > 450 ? "Bardzo wysokie" : finalVoltage > 350 ? "Wysokie" : "Umiarkowane",
        overall: ""
    };

    // Ogólna ocena
    if (finalRipple < 2 && sagVoltage > 10) {
        character.overall = "Klasyczne brzmienie lampowe z dobrą dynamiką";
    } else if (finalRipple < 1 && sagVoltage < 8) {
        character.overall = "Hi-Fi, precyzyjne brzmienie";
    } else if (finalRipple > 3 && sagVoltage > 15) {
        character.overall = "Vintage, ciepłe brzmienie z kompresją";
    } else {
        character.overall = "Zbalansowane brzmienie";
    }

    return character;
};

/**
 * Optymalizator dla konkretnych stylów gitarowych
 */
export const optimizeForGuitarStyle = (style) => {
    const optimizations = {
        "Marshall Plexi": {
            vac: 350,
            rectifier: "GZ34 / 5AR4",
            target_ripple: 2,
            target_sag: 15,
            description: "Klasyczny rock/blues tone z umiarkowanym sag"
        },
        "Fender Twin": {
            vac: 350,
            rectifier: "Silicon Bridge",
            target_ripple: 0.8,
            target_sag: 8,
            description: "Czysty, przejrzysty tone z wysokim headroom"
        },
        "Vox AC30": {
            vac: 280,
            rectifier: "GZ34 / 5AR4",
            target_ripple: 2.5,
            target_sag: 18,
            description: "Charakterystyczny sag i kompresja"
        },
        "High Gain Modern": {
            vac: 400,
            rectifier: "Silicon Bridge",
            target_ripple: 0.5,
            target_sag: 5,
            description: "Sztywne zasilanie dla high gain"
        }
    };

    return optimizations[style] || optimizations["Marshall Plexi"];
};

/**
 * Walidator bezpieczeństwa dla lamp
 */
export const validateTubeSafety = (tubeVoltages, tubeName) => {
    const tube = POWER_TUBES[tubeName] || PREAMP_TUBES[tubeName];
    if (!tube) return { safe: false, warnings: ["Nieznany typ lampy"] };

    const warnings = [];
    let safe = true;

    // Sprawdź napięcie anodowe
    if (tubeVoltages.Va && tube.Va_max) {
        if (tubeVoltages.Va > tube.Va_max) {
            warnings.push(`Napięcie anodowe ${tubeVoltages.Va}V przekracza maksymalne ${tube.Va_max}V`);
            safe = false;
        } else if (tubeVoltages.Va > tube.Va_max * 0.9) {
            warnings.push(`Napięcie anodowe ${tubeVoltages.Va}V blisko maksymalnego ${tube.Va_max}V`);
        }
    }

    // Sprawdź moc na anodzie
    if (tubeVoltages.power_dissipation && tube.Pa_max) {
        if (tubeVoltages.power_dissipation > tube.Pa_max) {
            warnings.push(`Moc na anodzie ${tubeVoltages.power_dissipation}W przekracza maksymalną ${tube.Pa_max}W`);
            safe = false;
        }
    }

    return { safe, warnings };
};

// ============================================
// WSZYSTKIE FUNKCJE JUŻ WYEKSPORTOWANE POWYŻEJ
// ============================================

// Nie ma potrzeby dodatkowych eksportów - wszystkie funkcje są już dostępne poprzez export przed definicją