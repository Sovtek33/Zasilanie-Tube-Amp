import React from 'react';
import { POWER_TUBES, POWER_CONFIGS } from '../../data/tubes';

const PowerTubesConfig = ({
    powerTubeType, setPowerTubeType,
    powerConfig, setPowerConfig
}) => {
    return (
        <div className="border-t border-slate-700 pt-4 space-y-3">
            <label className="text-base font-medium">Lampy mocy</label>

            {/* Typ lampy */}
            <div className="space-y-2">
                <label className="text-sm text-slate-400">Typ lampy</label>
                <select
                    value={powerTubeType}
                    onChange={e => setPowerTubeType(e.target.value)}
                    className="w-full text-base py-2"
                    title="Wybierz typ lampy mocy"
                >
                    {Object.entries(POWER_TUBES).map(([tube, data]) => (
                        <option key={tube} value={tube}>
                            {tube} ({data.type}, {data.Ia}mA)
                        </option>
                    ))}
                </select>
            </div>

            {/* Konfiguracja */}
            <div className="space-y-2">
                <label className="text-sm text-slate-400">Konfiguracja</label>
                <select
                    value={powerConfig}
                    onChange={e => setPowerConfig(e.target.value)}
                    className="w-full text-base py-2"
                    title="Konfiguracja lamp mocy"
                >
                    {Object.keys(POWER_CONFIGS).map(config => (
                        <option key={config} value={config}>
                            {config}
                        </option>
                    ))}
                </select>
            </div>

            {/* Info o lampach */}
            <div className="text-sm text-slate-500 bg-slate-800/50 p-3 rounded">
                <div>
                    Prąd anodowy: {POWER_TUBES[powerTubeType]?.Ia * POWER_CONFIGS[powerConfig]?.multiplier}mA
                </div>
                {POWER_TUBES[powerTubeType]?.type !== "triode" && (
                    <div>
                        Prąd G2: {POWER_TUBES[powerTubeType]?.Ig2 * POWER_CONFIGS[powerConfig]?.multiplier}mA
                    </div>
                )}
            </div>
        </div>
    );
};

export default PowerTubesConfig;