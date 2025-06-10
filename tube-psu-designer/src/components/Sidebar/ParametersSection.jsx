import React from 'react';
import { RECTIFIERS } from '../../data/tubes';

const ParametersSection = ({ vac, setVac, rect, setRect }) => {
    return (
        <>
            {/* Napięcie */}
            <div className="space-y-3">
                <label className="text-base font-medium">Napięcie transformatora</label>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        className="flex-1 text-right text-lg py-2"
                        value={vac}
                        min="200"
                        max="450"
                        step="5"
                        onChange={e => setVac(+e.target.value)}
                        title="Napięcie skuteczne uzwojenia wtórnego"
                    />
                    <span className="text-base text-slate-400">VAC</span>
                </div>
                <div className="text-sm text-slate-500 mt-1">
                    <div>Szczyt: {(vac * Math.SQRT2).toFixed(1)}V</div>
                    <div>Po prostowaniu: {(vac * Math.SQRT2 - RECTIFIERS[rect].drop).toFixed(1)}V</div>
                </div>
            </div>

            {/* Prostownik */}
            <div className="space-y-3">
                <label className="text-base font-medium">Prostownik</label>
                <select
                    value={rect}
                    onChange={e => setRect(e.target.value)}
                    className="w-full text-base py-2"
                    title="Typ prostownika - wpływa na spadek napięcia"
                >
                    {Object.entries(RECTIFIERS).map(([k, v]) => (
                        <option key={k} value={k}>
                            {k} (spadek: {v.drop}V)
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default ParametersSection;