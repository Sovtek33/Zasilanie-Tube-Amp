import React from 'react';
import StageRow from './StageRow';

const StagesTable = ({
    stages,
    results,
    onUpdateStage,
    onAddStage,
    onDeleteStage
}) => {
    return (
        <div className="psu-card">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Łańcuch RC / LC</h2>
                <button
                    onClick={onAddStage}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-base transition-colors"
                    title="Dodaj nową sekcję filtrowania"
                >
                    + Dodaj sekcję
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-base">
                    <thead className="text-indigo-400 border-b border-slate-700">
                        <tr>
                            <th className="text-left p-3">Sekcja</th>
                            <th className="text-left p-3">Obciążenie</th>
                            <th className="text-center p-3">Filtr</th>
                            <th className="text-center p-3">R/L</th>
                            <th className="text-center p-3">C [μF]</th>
                            <th className="text-center p-3">U [V]</th>
                            <th className="text-center p-3">I [mA]</th>
                            <th className="text-center p-3">Ripple</th>
                            <th className="text-center p-3 min-w-[200px]">V na pinach</th>
                            <th className="text-center p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => {
                            const originalStage = stages.find(s => s.id === result.id);
                            return (
                                <StageRow
                                    key={result.id}
                                    result={result}
                                    stage={originalStage}
                                    onUpdate={onUpdateStage}
                                    onDelete={onDeleteStage}
                                    canDelete={stages.length > 1}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <p className="mt-4 text-xs text-slate-400">
                *Ripple obliczane modelem RC/LC 100 Hz. Wartości dla pełnego obciążenia.
                Uwzględniono spadki napięć na DCR transformatora i rezystorach obciążenia.
            </p>
        </div>
    );
};

export default StagesTable;