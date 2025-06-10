/*  VoltageChart.jsx — Wykres spadków napięć
 *  (c) 2025 Wiśnia / PSU Designer
 *  ------------------------------------------------- */

import React from 'react';

const VoltageChart = React.memo(({ results, vPeak }) => {
    const maxVoltage = Math.max(vPeak, ...results.map(r => parseFloat(r.U)));
    const minVoltage = Math.min(0, ...results.map(r => parseFloat(r.U)));
    const voltageRange = maxVoltage - minVoltage;

    const chartHeight = 200;
    const chartWidth = 600;
    const padding = 50;
    const gridPadding = 20;

    // Oblicz skalę napięć dla siatki
    const getGridLines = () => {
        const step = voltageRange > 400 ? 100 : voltageRange > 200 ? 50 : 25;
        const lines = [];
        const start = Math.floor(minVoltage / step) * step;
        const end = Math.ceil(maxVoltage / step) * step;

        for (let voltage = start; voltage <= end; voltage += step) {
            lines.push(voltage);
        }
        return lines;
    };

    const gridLines = getGridLines();

    // Funkcja konwersji napięcia na pozycję Y
    const voltageToY = (voltage) => {
        return chartHeight + padding - ((voltage - minVoltage) / voltageRange) * chartHeight;
    };

    return (
        <div className="psu-card">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Wykres spadków napięć</h3>
                <div className="flex gap-4 text-xs text-slate-400">
                    <span>Szczyt: {vPeak.toFixed(1)}V</span>
                    <span>Spadek całkowity: {(parseFloat(results[0]?.U) - parseFloat(results[results.length - 1]?.U)).toFixed(1)}V</span>
                </div>
            </div>

            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight + padding * 2}`}
                className="w-full h-auto border border-slate-700 rounded-lg bg-slate-800"
            >
                {/* Gradient tła */}
                <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(15,23,42,0.8)" />
                        <stop offset="100%" stopColor="rgba(30,41,59,0.9)" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#84cc16" />
                    </linearGradient>
                </defs>

                {/* Tło wykresu */}
                <rect
                    x={padding} y={padding}
                    width={chartWidth - 2 * padding} height={chartHeight}
                    fill="url(#chartGradient)"
                />

                {/* Osie */}
                <line
                    x1={padding} y1={padding}
                    x2={padding} y2={chartHeight + padding}
                    stroke="#64748b" strokeWidth="2"
                />
                <line
                    x1={padding} y1={chartHeight + padding}
                    x2={chartWidth - padding} y2={chartHeight + padding}
                    stroke="#64748b" strokeWidth="2"
                />

                {/* Linie siatki poziomej */}
                {gridLines.map(voltage => {
                    const y = voltageToY(voltage);
                    const isMajor = voltage % 100 === 0;

                    return (
                        <g key={voltage}>
                            <line
                                x1={padding} y1={y}
                                x2={chartWidth - padding} y2={y}
                                stroke={isMajor ? "#374151" : "#1f2937"}
                                strokeWidth={isMajor ? "1" : "0.5"}
                                strokeDasharray={isMajor ? "none" : "2,2"}
                            />
                            <text
                                x={padding - 5} y={y + 4}
                                textAnchor="end" fontSize="10" fill="#94a3b8"
                            >
                                {voltage}V
                            </text>
                        </g>
                    );
                })}

                {/* Linie siatki pionowej */}
                {results.map((r, i) => {
                    const x = padding + (i / (results.length - 1)) * (chartWidth - 2 * padding);
                    return (
                        <line
                            key={`grid-${i}`}
                            x1={x} y1={padding}
                            x2={x} y2={chartHeight + padding}
                            stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2,2"
                        />
                    );
                })}

                {/* Obszar pod krzywą */}
                <path
                    d={`M${padding},${chartHeight + padding} ` +
                        results.map((r, i) => {
                            const x = padding + (i / (results.length - 1)) * (chartWidth - 2 * padding);
                            const voltage = parseFloat(r.U);
                            const y = voltageToY(voltage);
                            return `L${x},${y}`;
                        }).join(' ') +
                        ` L${padding + (chartWidth - 2 * padding)},${chartHeight + padding} Z`}
                    fill="rgba(245,158,11,0.1)"
                    stroke="none"
                />

                {/* Linia główna */}
                <polyline
                    points={results.map((r, i) => {
                        const x = padding + (i / (results.length - 1)) * (chartWidth - 2 * padding);
                        const voltage = parseFloat(r.U);
                        const y = voltageToY(voltage);
                        return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Punkty danych */}
                {results.map((r, i) => {
                    const x = padding + (i / (results.length - 1)) * (chartWidth - 2 * padding);
                    const voltage = parseFloat(r.U);
                    const y = voltageToY(voltage);

                    return (
                        <g key={r.id}>
                            {/* Punkt główny */}
                            <circle
                                cx={x} cy={y} r="5"
                                fill="#0f172a" stroke="#f59e0b" strokeWidth="3"
                            />
                            <circle
                                cx={x} cy={y} r="2"
                                fill="#f59e0b"
                            />

                            {/* Etykieta sekcji */}
                            <text
                                x={x} y={chartHeight + padding + 15}
                                textAnchor="middle" fontSize="12"
                                fill="#e2e8f0" fontWeight="600"
                            >
                                {r.name}
                            </text>

                            {/* Wartość napięcia */}
                            <g>
                                <rect
                                    x={x - 15} y={y - 25}
                                    width="30" height="16"
                                    fill="rgba(15,23,42,0.9)"
                                    stroke="rgba(245,158,11,0.5)"
                                    strokeWidth="1"
                                    rx="3"
                                />
                                <text
                                    x={x} y={y - 13}
                                    textAnchor="middle" fontSize="10"
                                    fill="#f59e0b" fontWeight="600"
                                >
                                    {r.U}V
                                </text>
                            </g>

                            {/* Opis obciążenia */}
                            {r.loadDesc && (
                                <text
                                    x={x} y={chartHeight + padding + 28}
                                    textAnchor="middle" fontSize="9"
                                    fill="#94a3b8"
                                >
                                    {r.loadDesc}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Legenda */}
                <g transform={`translate(${chartWidth - 150}, ${padding + 10})`}>
                    <rect x="0" y="0" width="140" height="60"
                        fill="rgba(15,23,42,0.9)" stroke="rgba(100,116,139,0.3)"
                        strokeWidth="1" rx="4" />
                    <text x="8" y="15" fontSize="11" fill="#e2e8f0" fontWeight="600">Legenda</text>
                    <circle cx="12" cy="28" r="3" fill="#f59e0b" />
                    <text x="22" y="32" fontSize="9" fill="#e2e8f0">Napięcie wyjściowe</text>
                    <line x1="8" y1="42" x2="28" y2="42" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
                    <text x="32" y="46" fontSize="9" fill="#e2e8f0">Siatka napięć</text>
                </g>
            </svg>

            {/* Dodatkowe informacje */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-slate-800/50 p-2 rounded">
                    <div className="text-xs text-slate-400">Spadek na sekcję</div>
                    <div className="text-sm font-semibold text-blue-300">
                        {results.length > 1 ? (
                            ((parseFloat(results[0].U) - parseFloat(results[results.length - 1].U)) / (results.length - 1)).toFixed(1)
                        ) : 0}V
                    </div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded">
                    <div className="text-xs text-slate-400">Sprawność</div>
                    <div className="text-sm font-semibold text-green-300">
                        {((parseFloat(results[results.length - 1]?.U || 0) / vPeak) * 100).toFixed(1)}%
                    </div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded">
                    <div className="text-xs text-slate-400">Regulacja</div>
                    <div className="text-sm font-semibold text-yellow-300">
                        {((vPeak - parseFloat(results[results.length - 1]?.U || 0)) / vPeak * 100).toFixed(1)}%
                    </div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded">
                    <div className="text-xs text-slate-400">Zakres</div>
                    <div className="text-sm font-semibold text-purple-300">
                        {voltageRange.toFixed(0)}V
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Porównanie głębokie wyników i vPeak
    return prevProps.vPeak === nextProps.vPeak &&
        JSON.stringify(prevProps.results) === JSON.stringify(nextProps.results);
});

export default VoltageChart;