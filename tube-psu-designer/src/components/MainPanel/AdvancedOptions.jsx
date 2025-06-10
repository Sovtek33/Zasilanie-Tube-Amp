import React from 'react';

const AdvancedOptions = ({ statistics }) => {
    return (
        <div className="psu-card">
            <h3 className="text-lg font-semibold mb-4">Opcje zaawansowane</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-medium mb-2">Analiza bezpieczeństwa</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Max napięcie izolacji:</span>
                            <span className={statistics.peakVoltage > 400 ? "text-orange-300" : "text-green-300"}>
                                {statistics.peakVoltage.toFixed(0)}V
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Zapas prądowy:</span>
                            <span className="text-blue-300">
                                {((300 - statistics.totalCurrent) / 300 * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium mb-2">Zalecenia</h4>
                    <div className="space-y-1 text-xs">
                        {statistics.finalRipple > 5 && (
                            <div className="text-orange-300">⚠️ Wysokie tętnienia - zwiększ kondensatory</div>
                        )}
                        {statistics.efficiency < 70 && (
                            <div className="text-yellow-300">💡 Niska sprawność - rozważ filtry LC</div>
                        )}
                        {statistics.totalPowerOnResistors > 20 && (
                            <div className="text-red-300">🔥 Wysoka moc na rezystorach</div>
                        )}
                        {statistics.finalRipple <= 1 && statistics.efficiency > 80 && (
                            <div className="text-green-300">✅ Optymalna konfiguracja</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedOptions;