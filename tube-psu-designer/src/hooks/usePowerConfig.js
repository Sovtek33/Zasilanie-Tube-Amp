import { useState } from 'react';

/**
 * Custom hook do zarz¹dzania konfiguracj¹ lamp mocy
 * Przechowuje typ lampy i konfiguracjê (SE/PP/PPP)
 */
export const usePowerConfig = () => {
    const [powerTubeType, setPowerTubeType] = useState("EL34");
    const [powerConfig, setPowerConfig] = useState("Push-Pull");

    return {
        powerTubeType,
        powerConfig,
        setPowerTubeType,
        setPowerConfig
    };
};