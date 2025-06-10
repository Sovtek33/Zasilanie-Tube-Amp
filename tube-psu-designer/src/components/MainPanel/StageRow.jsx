import React from 'react';
import LoadEditor from '../LoadEditor';
import { FilterTypeSelector } from '../FilterControls';
import TubeVoltagesDisplay from './TubeVoltagesDisplay';
import { formatResistor, fRipple } from '../../utils/formatters';

const StageRow = ({ result, stage, onUpdate, onDelete, canDelete }) => {
    return (
        <tr className="border-t border-slate-700 hover:bg-slate-800/30">
            {/* Nazwa sekcji */}
            <td className="p-3">
                <span className="font-semibold text-indigo-300 text-lg">
                    {result.name}
                </span>
            </td>

            {/* Edytor obciążenia */}
            <td className="p-3">
                <LoadEditor
                    section={stage}
                    onChange={onUpdate}
                    hideMainConfig={
                        stage.load?.type === "power" ||
                        stage.load?.type === "g2"
                    }
                />
            </td>

            {/* Typ filtra */}
            <td className="p-3 text-center">
                <FilterTypeSelector
                    section={stage}
                    onChange={onUpdate}
                />
            </td>

            {/* Rezystor/Induktor */}
            <td className="p-3 text-center">
                {stage.filterType === "LC" ? (
                    <div className="flex items-center gap-1 justify-center">
                        <input
                            type="number"
                            className="w-16 text-right text-xs"
                            value={stage.L || 10}
                            onChange={(e) => onUpdate(result.id, "L", +e.target.value)}
                            min="0.1"
                            step="0.1"
                            title="Indukcyjność cewki"
                        />
                        <span className="text-xs text-slate-400">H</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1 justify-center">
                        <input
                            type="text"
                            className="w-20 text-right text-xs"
                            value={formatResistor(result.R)}
                            onChange={(e) => onUpdate(result.id, "R", e.target.value)}
                            title="Rezystancja – możesz użyć k, M"
                            placeholder="np. 4.7k"
                        />
                        <span className="text-xs text-slate-400">Ω</span>
                    </div>
                )}
            </td>

            {/* Kondensator */}
            <td className="p-2 text-center">
                <input
                    type="number"
                    className="w-16 text-right text-xs"
                    value={stage.C}
                    onChange={(e) => onUpdate(result.id, "C", +e.target.value)}
                    min="1"
                    title="Pojemność kondensatora"
                />
            </td>

            {/* Napięcie */}
            <td className="text-right tabular-nums font-semibold text-amber-300 p-2">
                {result.U}
            </td>

            {/* Prąd */}
            <td className="text-right tabular-nums p-2">
                {result.I}
            </td>

            {/* Ripple */}
            <td className="text-right tabular-nums text-green-300 p-2">
                {fRipple(result.mV)}
            </td>

            {/* Napięcia na pinach */}
            <td className="text-xs p-2">
                <TubeVoltagesDisplay tubeVoltages={result.tubeVoltages} />
            </td>

            {/* Przycisk usuwania */}
            <td className="p-2 text-center">
                <button
                    onClick={() => onDelete(result.id)}
                    disabled={!canDelete}
                    className="hover:text-red-400 p-1 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                    title={!canDelete ? "Nie można usunąć ostatniej sekcji" : "Usuń sekcję"}
                >
                    ✕
                </button>
            </td>
        </tr>
    );
};

export default StageRow;