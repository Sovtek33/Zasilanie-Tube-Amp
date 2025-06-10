import { useState } from 'react';

/**
 * Custom hook do zarz�dzania konfiguracj� lamp mocy
 * Przechowuje typ lampy i konfiguracj� (SE/PP/PPP)
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