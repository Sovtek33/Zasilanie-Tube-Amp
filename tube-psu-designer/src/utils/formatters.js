/*  formatters.js — Funkcje formatowania wyświetlania
 *  (c) 2025 Wiśnia / PSU Designer
 *  ------------------------------------------------- */

// Funkcja formatowania wyświetlania tętnień
export const fRipple = (mV) => {
    if (mV < 1) return `${(mV * 1000).toFixed(0)}μV`;
    if (mV < 1000) return `${mV.toFixed(1)}mV`;
    return `${(mV / 1000).toFixed(2)}V`;
};

// Formatowanie wartości rezystora do wyświetlania
export const formatResistor = (ohms) => {
    if (ohms >= 1000000) return `${(ohms / 1000000).toFixed(1)}M`;
    if (ohms >= 1000) return `${(ohms / 1000).toFixed(1)}k`;
    return `${ohms}`;
};

// Formatowanie mocy do wyświetlania
export const formatPower = (watts) => {
    if (watts < 1) return `${(watts * 1000).toFixed(0)}mW`;
    return `${watts.toFixed(1)}W`;
};

// Formatowanie napięcia do wyświetlania
export const formatVoltage = (volts) => {
    if (volts < 1) return `${(volts * 1000).toFixed(0)}mV`;
    return `${volts.toFixed(1)}V`;
};

// Formatowanie prądu do wyświetlania
export const formatCurrent = (mA) => {
    if (mA < 1) return `${(mA * 1000).toFixed(0)}μA`;
    if (mA >= 1000) return `${(mA / 1000).toFixed(2)}A`;
    return `${mA.toFixed(1)}mA`;
};

// Formatowanie pojemności kondensatora
export const formatCapacitor = (uF) => {
    if (uF < 1) return `${(uF * 1000).toFixed(0)}nF`;
    if (uF >= 1000) return `${(uF / 1000).toFixed(1)}mF`;
    return `${uF}μF`;
};

// Formatowanie indukcyjności
export const formatInductor = (H) => {
    if (H < 1) return `${(H * 1000).toFixed(0)}mH`;
    return `${H.toFixed(1)}H`;
};