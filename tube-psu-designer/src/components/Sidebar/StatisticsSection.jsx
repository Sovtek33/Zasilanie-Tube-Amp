import React from 'react';
import { fRipple } from '../../utils/formatters';

const StatisticsSection = ({ statistics }) => {
    return (
        <div className="psu-card space-y-4">
            <h3 className="text-lg font-semibold">Statystyki</h3>
            <div className="grid grid-cols-1 gap-4 text-base">
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Całkowity prąd:</span>
                    <span className="font-medium text-amber-300 tabular-nums text-lg">
                        {statistics.totalCurrent.toFixed(1)} mA
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Moc na R:</span>
                    <span className="font-medium text-red-300 tabular-nums text-lg">
                        {statistics.totalPowerOnResistors.toFixed(1)} W
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Spadek V:</span>
                    <span className="font-medium text-blue-300 tabular-nums text-lg">
                        {statistics.voltageDrop.toFixed(1)} V
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Końcowe tętnienia:</span>
                    <span className="font-medium text-green-300 tabular-nums text-lg">
                        {fRipple(statistics.finalRipple)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-400">Sprawność:</span>
                    <span className="font-medium text-purple-300 tabular-nums text-lg">
                        {statistics.efficiency.toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatisticsSection;