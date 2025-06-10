/*  LoadEditor.jsx — Komponent do edycji parametrów obciążenia sekcji
 *  (c) 2025 Wiśnia / PSU Designer
 *  ------------------------------------------------- */

import React from 'react';
import { POWER_TUBES, PREAMP_TUBES, POWER_CONFIGS, INVERTER_TYPES } from '../data/tubes';
import { formatResistor } from '../utils/formatters';

const LoadEditor = React.memo(({ section, onChange, hideMainConfig = false }) => {
    const load = section.load || {};

    const handleChange = (field, value) => {
        onChange(section.id, 'load', { ...load, [field]: value });
    };

    // Renderowanie w zależności od typu sekcji
    switch (load.type) {
        case "power":
            // Tylko DCR dla sekcji lamp mocy - bez wyboru lamp
            return (
                <div className="space-y-2">
                    <div className="text-xs text-slate-400">
                        {load.config} {load.tubes}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="text-slate-400">DCR trafka:</span>
                        <input
                            type="number"
                            value={load.dcr || 100}
                            onChange={e => handleChange('dcr', +e.target.value)}
                            className="w-16 text-right"
                            placeholder="DCR"
                            title="Rezystancja uzwojenia wtórnego transformatora"
                            min="0"
                            max="1000"
                            step="10"
                        />
                        <span className="text-slate-400">Ω</span>
                    </div>
                </div>
            );

        case "g2":
            // Tylko rezystor G2 - bez wyboru lamp
            return (
                <div className="space-y-2">
                    <div className="text-xs text-slate-400">
                        G2 dla {load.tubes}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <input
                            type="number"
                            value={load.resistor || 470}
                            onChange={e => handleChange('resistor', +e.target.value)}
                            className="w-16 text-right"
                            title="Rezystor w linii G2"
                            min="100"
                            max="10000"
                            step="10"
                        />
                        <span className="text-slate-400">Ω</span>
                        {load.config && POWER_CONFIGS[load.config]?.multiplier > 1 && (
                            <button
                                onClick={() => handleChange('separate', !load.separate)}
                                className={`px-2 py-1 rounded text-xs transition-colors ${load.separate
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                        : 'bg-slate-600 hover:bg-slate-700 text-slate-200'
                                    }`}
                                title={load.separate ? "Przełącz na wspólny rezystor" : "Przełącz na osobne rezystory dla każdej lampy"}
                            >
                                {load.separate ? '⚡ Osobne' : '🔗 Wspólny'}
                            </button>
                        )}
                    </div>
                    {load.separate && POWER_CONFIGS[load.config] && (
                        <div className="text-xs text-orange-400">
                            ⚡ Osobne rezystory dla {POWER_CONFIGS[load.config].multiplier} lamp
                        </div>
                    )}
                </div>
            );

        case "inverter":
            return (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-xs">
                        <select
                            value={load.inverterType || "Long-tail pair"}
                            onChange={e => handleChange('inverterType', e.target.value)}
                            className="w-32"
                            title="Typ inwertera fazowego"
                        >
                            {Object.keys(INVERTER_TYPES).map(t => <option key={t}>{t}</option>)}
                        </select>
                        <input
                            type="text"
                            value={formatResistor(load.Ra || 100000)}
                            onChange={e => handleChange('Ra', e.target.value)}
                            className="w-20 text-right"
                            title="Rezystor anodowy - możesz użyć k, M"
                            placeholder="np. 100k"
                        />
                        <span className="text-slate-400">Ω Ra</span>
                    </div>
                    <div className="text-xs text-slate-500">
                        Prąd: {INVERTER_TYPES[load.inverterType || "Long-tail pair"]?.current}mA
                        {" • "}Rezystory: {INVERTER_TYPES[load.inverterType || "Long-tail pair"]?.resistors}
                    </div>
                </div>
            );

        case "preamp":
            return (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2 text-xs">
                        <input
                            type="number"
                            value={load.count || 2}
                            min="1" max="12"
                            onChange={e => {
                                const newCount = +e.target.value;
                                handleChange('count', newCount);

                                // Dostosuj tablice rezystorów i prądów do nowej liczby triod
                                if (load.separateRa && load.RaArray) {
                                    const currentArray = load.RaArray;
                                    const defaultRa = load.Ra || 100000;
                                    const totalTriodes = newCount * 2; // Każda lampa ma 2 triody!
                                    let newArray;

                                    if (totalTriodes > currentArray.length) {
                                        // Dodaj nowe rezystory z wartością domyślną
                                        newArray = [...currentArray];
                                        for (let i = currentArray.length; i < totalTriodes; i++) {
                                            newArray.push(defaultRa);
                                        }
                                    } else {
                                        // Usuń nadmiarowe rezystory
                                        newArray = currentArray.slice(0, totalTriodes);
                                    }

                                    handleChange('RaArray', newArray);
                                }

                                // Dostosuj tablicę prądów
                                if (load.IaArray) {
                                    const currentIaArray = load.IaArray;
                                    const defaultIa = PREAMP_TUBES[load.tubes || "12AX7"]?.Ia || 1.2;
                                    const totalTriodes = newCount * 2;
                                    let newIaArray;

                                    if (totalTriodes > currentIaArray.length) {
                                        newIaArray = [...currentIaArray];
                                        for (let i = currentIaArray.length; i < totalTriodes; i++) {
                                            newIaArray.push(defaultIa);
                                        }
                                    } else {
                                        newIaArray = currentIaArray.slice(0, totalTriodes);
                                    }

                                    handleChange('IaArray', newIaArray);
                                }
                            }}
                            className="w-12 text-right"
                            title="Liczba lamp (każda ma 2 triody)"
                        />
                        <span className="text-slate-400">×</span>
                        <select
                            value={load.tubes || "12AX7"}
                            onChange={e => handleChange('tubes', e.target.value)}
                            className="w-24"
                            title="Typ lampy przedwzmacniacza"
                        >
                            {Object.keys(PREAMP_TUBES).map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>

                        {!load.separateRa && (
                            <>
                                <input
                                    type="text"
                                    value={formatResistor(load.Ra || 100000)}
                                    onChange={e => handleChange('Ra', e.target.value)}
                                    className="w-20 text-right"
                                    title="Rezystor anodowy - możesz użyć k, M"
                                    placeholder="np. 100k"
                                />
                                <span className="text-slate-400">Ω</span>
                            </>
                        )}

                        {load.count > 0 && (
                            <button
                                onClick={() => {
                                    if (load.separateRa) {
                                        // Przełącz na wspólny
                                        handleChange('separateRa', false);
                                        handleChange('Ra', load.RaArray?.[0] || 100000);
                                        handleChange('RaArray', null);
                                        handleChange('IaArray', null);
                                    } else {
                                        // Przełącz na osobne
                                        handleChange('separateRa', true);
                                        const totalTriodes = (load.count || 2) * 2; // Każda lampa ma 2 triody!
                                        const raArray = new Array(totalTriodes).fill(load.Ra || 100000);
                                        const defaultIa = PREAMP_TUBES[load.tubes || "12AX7"]?.Ia || 1.2;
                                        const iaArray = new Array(totalTriodes).fill(defaultIa);
                                        handleChange('RaArray', raArray);
                                        handleChange('IaArray', iaArray);
                                    }
                                }}
                                className={`px-2 py-1 rounded text-xs transition-colors ${load.separateRa
                                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                    : 'bg-slate-600 hover:bg-slate-700 text-slate-200'
                                    }`}
                                title={load.separateRa ? "Przełącz na wspólny rezystor" : "Przełącz na osobne rezystory"}
                            >
                                {load.separateRa ? '⚡ Osobne Ra' : '🔗 Wspólny Ra'}
                            </button>
                        )}
                    </div>

                    {/* Osobne inputy dla każdego rezystora */}
                    {load.separateRa && load.RaArray && (
                        <div className="mt-3 p-2 bg-slate-800/50 rounded-lg">
                            <div className="text-xs text-slate-400 mb-2 font-medium">
                                Rezystory anodowe ({load.count} lamp{load.count === 1 ? 'a' : 'y'} = {load.count * 2} triod{load.count * 2 === 1 ? 'a' : 'y'}):
                            </div>
                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                {load.RaArray.map((ra, idx) => {
                                    const lampNum = Math.floor(idx / 2) + 1;
                                    const triodeInLamp = (idx % 2) + 1;
                                    const ia = load.IaArray?.[idx] || PREAMP_TUBES[load.tubes || "12AX7"]?.Ia || 1.2;

                                    return (
                                        <div key={idx} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded">
                                            <span className="text-xs text-slate-400 w-16">
                                                L{lampNum}T{triodeInLamp}:
                                            </span>

                                            {/* Rezystor */}
                                            <input
                                                type="text"
                                                value={formatResistor(ra)}
                                                onChange={e => {
                                                    const newArray = [...load.RaArray];
                                                    newArray[idx] = e.target.value;
                                                    handleChange('RaArray', newArray);
                                                }}
                                                className="w-20 text-right text-sm py-1"
                                                title={`Rezystor anodowy - Lampa ${lampNum}, Trioda ${triodeInLamp}`}
                                                placeholder="np. 100k"
                                            />
                                            <span className="text-xs text-slate-400">Ω</span>

                                            {/* Prąd */}
                                            <span className="text-xs text-slate-400 ml-2">Ia:</span>
                                            <input
                                                type="number"
                                                value={ia}
                                                onChange={e => {
                                                    const newIaArray = [...(load.IaArray || new Array(load.RaArray.length).fill(PREAMP_TUBES[load.tubes || "12AX7"]?.Ia || 1.2))];
                                                    newIaArray[idx] = parseFloat(e.target.value) || 1.2;
                                                    handleChange('IaArray', newIaArray);
                                                }}
                                                className="w-14 text-right text-sm py-1"
                                                title={`Prąd anodowy - Lampa ${lampNum}, Trioda ${triodeInLamp}`}
                                                min="0.1"
                                                max="10"
                                                step="0.1"
                                            />
                                            <span className="text-xs text-slate-400">mA</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-2 text-xs text-slate-500">
                                💡 Wskazówka: Różne prądy pozwalają optymalizować punkt pracy każdej triody
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-slate-500">
                        Ia nominalne: {PREAMP_TUBES[load.tubes || "12AX7"]?.Ia}mA
                        {" • "}µ: {PREAMP_TUBES[load.tubes || "12AX7"]?.mu}
                        {" • "}Całkowity prąd: {
                            load.separateRa && load.IaArray
                                ? load.IaArray.reduce((sum, ia) => sum + ia, 0).toFixed(1)
                                : ((load.count || 2) * 2 * PREAMP_TUBES[load.tubes || "12AX7"]?.Ia).toFixed(1)
                        }mA
                        {load.separateRa && load.count > 0 && (
                            <div className="text-orange-400 mt-1">
                                ⚡ Osobne rezystory anodowe ({load.count * 2} rezystorów)
                            </div>
                        )}
                    </div>
                </div>
            );

        default:
            return (
                <div className="space-y-2">
                    <div className="text-xs text-slate-500">Wybierz typ obciążenia</div>
                    <select
                        value={load.type || ""}
                        onChange={e => handleChange('type', e.target.value)}
                        className="w-full text-xs"
                    >
                        <option value="">-- Wybierz typ --</option>
                        <option value="power">Lampy mocy</option>
                        <option value="g2">Siatki G2</option>
                        <option value="inverter">Inverter fazowy</option>
                        <option value="preamp">Przedwzmacniacz</option>
                    </select>
                </div>
            );
    }
}, (prevProps, nextProps) => {
    // Głębsze porównanie dla obiektu load
    return prevProps.section.id === nextProps.section.id &&
        JSON.stringify(prevProps.section.load) === JSON.stringify(nextProps.section.load) &&
        prevProps.hideMainConfig === nextProps.hideMainConfig;
});

export default LoadEditor;