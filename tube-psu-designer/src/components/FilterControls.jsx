/*  FilterControls.jsx — Kontrolki filtrów RC/LC i sugestie kondensatorów
 *  (c) 2025 Wiśnia / PSU Designer
 *  ------------------------------------------------- */

import React from 'react';
import { suggestCapacitor } from '../utils/calculations';
import { formatCapacitor } from '../utils/formatters';

// Komponent - edytor typu filtra
export const FilterTypeSelector = React.memo(({ section, onChange }) => {
    const filterType = section.filterType || 'RC';

    return (
        <div className="flex items-center gap-2 text-xs">
            <select
                value={filterType}
                onChange={e => onChange(section.id, 'filterType', e.target.value)}
                className="w-16"
                title="Typ filtra - RC lub LC"
            >
                <option value="RC">RC</option>
                <option value="LC">LC</option>
            </select>
            {filterType === 'LC' && (
                <>
                    <input
                        type="number"
                        value={section.L || 10}
                        onChange={e => onChange(section.id, 'L', +e.target.value)}
                        className="w-14 text-right"
                        min="0.1"
                        max="100"
                        step="0.1"
                        title="Indukcyjność cewki filtru"
                    />
                    <span className="text-slate-400">H</span>
                </>
            )}
        </div>
    );
});

// Komponent sugestii kondensatora
export const CapacitorSuggestion = React.memo(({ current, targetRipple = 1, R, filterType, className = "" }) => {
    const suggested = suggestCapacitor(current, targetRipple, R, filterType);

    // Standardowe wartości kondensatorów
    const standard = [10, 22, 33, 47, 68, 100, 150, 220, 330, 470, 680, 1000, 1500, 2200, 3300, 4700];
    const nearest = standard.reduce((prev, curr) =>
        Math.abs(curr - suggested) < Math.abs(prev - suggested) ? curr : prev
    );

    // Ocena jakości sugestii
    const quality = Math.abs(nearest - suggested) / suggested;
    const qualityClass = quality < 0.1 ? "text-green-400" : quality < 0.3 ? "text-yellow-400" : "text-orange-400";

    return (
        <div className={`text-xs ${className}`}>
            <div className="text-slate-400">
                Sugerowane: <span className={qualityClass}>{formatCapacitor(suggested)}</span>
            </div>
            <div className="text-slate-500">
                Standardowa: <span className="text-slate-300">{formatCapacitor(nearest)}</span>
                {quality > 0.3 && <span className="text-orange-400"> (!)</span>}
            </div>
        </div>
    );
});

// Komponent kontrolek wartości RC/LC
export const ValueControls = React.memo(({ section, onChange, result }) => {
    const isLC = section.filterType === 'LC';

    return (
        <div className="space-y-2">
            {/* Rezystor lub Cewka */}
            <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 w-8">
                    {isLC ? 'L:' : 'R:'}
                </label>
                {isLC ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            className="w-16 text-right text-xs"
                            value={section.L || 10}
                            onChange={e => onChange(section.id, "L", +e.target.value)}
                            min="0.1"
                            max="100"
                            step="0.1"
                            title="Indukcyjność cewki"
                        />
                        <span className="text-xs text-slate-400">H</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            className="w-20 text-right text-xs"
                            value={section.R}
                            onChange={e => onChange(section.id, "R", e.target.value)}
                            title="Rezystancja - możesz użyć k dla kiloomów, M dla megoomów"
                            placeholder="np. 4.7k"
                        />
                        <span className="text-xs text-slate-400">Ω</span>
                    </div>
                )}
            </div>

            {/* Kondensator */}
            <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 w-8">C:</label>
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        className="w-16 text-right text-xs"
                        value={section.C}
                        onChange={e => onChange(section.id, "C", +e.target.value)}
                        min="1"
                        max="10000"
                        step="1"
                        title="Pojemność kondensatora"
                    />
                    <span className="text-xs text-slate-400">µF</span>
                </div>
            </div>

            {/* Sugestia kondensatora */}
            {result && (
                <CapacitorSuggestion
                    current={parseFloat(result.I)}
                    targetRipple={1}
                    R={section.R}
                    filterType={section.filterType}
                    className="mt-1"
                />
            )}
        </div>
    );
});

// Komponenty pomocnicze dla standardowych wartości
export const StandardValues = React.memo(({ type, onSelect, className = "" }) => {
    const values = {
        resistor: ['1k', '2.2k', '4.7k', '10k', '22k', '47k', '100k', '220k', '470k', '1M'],
        capacitor: [10, 22, 47, 68, 100, 220, 330, 470, 680, 1000, 2200, 3300, 4700],
        inductor: [1, 2, 5, 10, 20, 30, 50, 100]
    };

    return (
        <div className={`flex flex-wrap gap-1 ${className}`}>
            <span className="text-xs text-slate-500">Standardowe:</span>
            {values[type]?.map(val => (
                <button
                    key={val}
                    onClick={() => onSelect(val)}
                    className="text-xs px-1 py-0.5 bg-slate-700 hover:bg-slate-600 rounded border border-slate-600 hover:border-slate-500 transition-colors"
                    title={`Ustaw ${val}${type === 'capacitor' ? 'µF' : type === 'inductor' ? 'H' : ''}`}
                >
                    {val}{type === 'capacitor' ? 'μ' : type === 'inductor' ? 'H' : ''}
                </button>
            ))}
        </div>
    );
});

export default { FilterTypeSelector, CapacitorSuggestion, ValueControls, StandardValues };