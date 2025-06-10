import React from 'react';
import { formatResistor } from '../../utils/formatters';

const TubeVoltagesDisplay = ({ tubeVoltages }) => {
    if (!tubeVoltages) return null;

    // Osobne rezystory dla triod
    if (tubeVoltages.triodes) {
        return (
            <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-semibold mb-1">
                    {tubeVoltages.separateRa ? 'Osobne rezystory:' : 'Wspólny rezystor:'}
                </div>
                {tubeVoltages.triodes.map((t, idx) => (
                    <div key={idx} className="text-blue-300 border border-slate-700 rounded p-1 bg-slate-800/50">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-[10px]">
                                L{t.lampNum}T{t.triodeInLamp}:
                            </span>
                            <span className="text-amber-300 font-medium">
                                Va={t.Va.toFixed(0)}V
                            </span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                            Ra={formatResistor(t.Ra)}, Ia={t.Ia.toFixed(1)}mA, ΔV={t.Vdrop.toFixed(0)}V, Av={t.gain.toFixed(0)}
                        </div>
                    </div>
                ))}
                {tubeVoltages.totalTriodes > tubeVoltages.triodes.length && (
                    <div className="text-[10px] text-orange-400 text-center">
                        ⚠️ Wyświetlono {tubeVoltages.triodes.length} z {tubeVoltages.totalTriodes} triod
                    </div>
                )}
            </div>
        );
    }

    // Wspólny rezystor dla triod
    if (tubeVoltages.commonRa) {
        return (
            <div className="space-y-1">
                <div className="text-blue-300">
                    <span className="text-slate-500">Va:</span> {tubeVoltages.Va.toFixed(0)}V
                </div>
                <div className="text-[10px] text-slate-400">
                    Wspólny Ra={formatResistor(tubeVoltages.commonRa)}
                </div>
                <div className="text-[10px] text-slate-400">
                    {tubeVoltages.totalTriodes} triod, ΔV={tubeVoltages.Vdrop.toFixed(0)}V
                </div>
            </div>
        );
    }

    // Osobne rezystory G2
    if (tubeVoltages.g2Tubes) {
        return (
            <div className="space-y-1">
                <div className="text-[10px] text-slate-500 font-semibold mb-1">
                    Osobne rezystory G2:
                </div>
                {tubeVoltages.g2Tubes.map((g, idx) => (
                    <div key={idx} className="text-purple-300 border border-slate-700 rounded p-1 bg-slate-800/50">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-[10px]">
                                Lampa {g.tubeNum}:
                            </span>
                            <span className="font-medium">
                                Vg2={g.Vg2.toFixed(0)}V
                            </span>
                        </div>
                        <div className="text-[9px] text-slate-400">
                            R={g.resistor}Ω, ΔV={g.Vdrop.toFixed(0)}V
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Standardowe wyświetlanie
    return (
        <>
            {tubeVoltages.Va && (
                <div className="text-blue-300">
                    <span className="text-slate-500">Va:</span> {tubeVoltages.Va.toFixed(0)}V
                </div>
            )}
            {tubeVoltages.Vg2 && (
                <div className="text-purple-300">
                    <span className="text-slate-500">Vg2:</span> {tubeVoltages.Vg2.toFixed(0)}V
                </div>
            )}
            {tubeVoltages.Vdrop && (
                <div className="text-red-300">
                    <span className="text-slate-500">ΔV:</span> {tubeVoltages.Vdrop.toFixed(0)}V
                </div>
            )}
            {tubeVoltages.resistorConfig && (
                <div className="text-yellow-300 text-[10px]">
                    {tubeVoltages.resistorConfig}
                </div>
            )}
        </>
    );
};

export default TubeVoltagesDisplay;