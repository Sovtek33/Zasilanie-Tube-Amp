import React, { useState, memo } from "react";
import { fRipple } from '../utils/formatters';

/* Symbol – rezystor (styl IEC) - zmemoizowany */
const Resistor = memo(({ x, y, label, value }) => {
    const width = 50;
    const height = 16;

    return (
        <g>
            <rect
                x={x - width / 2}
                y={y - height / 2}
                width={width}
                height={height}
                className="fill-slate-800 stroke-slate-400 stroke-2"
            />

            <text x={x} y={y - 14} textAnchor="middle" className="text-[12px] fill-slate-300 font-medium">
                {label} = {value}
            </text>
        </g>
    );
});

/* Symbol – cewka indukcyjna - zmemoizowany */
const Inductor = memo(({ x, y, label, value }) => {
    const coilRadius = 6;
    const numCoils = 4;
    const spacing = coilRadius * 2;
    const totalWidth = spacing * numCoils;

    let path = `M ${x - totalWidth / 2} ${y}`;
    for (let i = 0; i < numCoils; i++) {
        const cx = x - totalWidth / 2 + spacing / 2 + i * spacing;
        path += ` A ${coilRadius} ${coilRadius} 0 0 1 ${cx + coilRadius} ${y}`;
    }

    return (
        <g>
            <path
                d={path}
                className="fill-none stroke-slate-400 stroke-2"
            />

            <text x={x} y={y - 14} textAnchor="middle" className="text-[12px] fill-slate-300 font-medium">
                {label} = {value}
            </text>
        </g>
    );
});

/* Symbol – kondensator elektrolityczny (pionowy) - zmemoizowany */
const Capacitor = memo(({ x, y, label, value }) => {
    const plateW = 20;
    const plateH = 3;
    const gap = 10;

    return (
        <g>
            <rect x={x - plateW / 2} y={y - gap / 2 - plateH} width={plateW} height={plateH}
                className="fill-slate-400" />

            <rect x={x - plateW / 2} y={y + gap / 2} width={plateW} height={plateH}
                className="fill-slate-400" />

            <text x={x + plateW / 2 + 6} y={y - gap / 2 + 2} className="text-[12px] fill-slate-500 font-bold">+</text>

            <text x={x + plateW / 2 + 20} y={y - 2} textAnchor="start"
                className="text-[12px] fill-slate-300 font-medium">
                {label}
            </text>
            <text x={x + plateW / 2 + 20} y={y + 12} textAnchor="start"
                className="text-[11px] fill-slate-400">
                {value}
            </text>
        </g>
    );
});

/* Symbol – węzeł - zmemoizowany */
const Node = memo(({ x, y, name }) => (
    <g>
        <circle cx={x} cy={y} r={7} className="fill-indigo-400 stroke-indigo-600 stroke-2" />
        <text x={x} y={y - 35} textAnchor="middle"
            className="text-[14px] font-bold fill-indigo-300">{name}</text>
    </g>
));

/* Symbol – obciążenie - zmemoizowany */
const LoadSymbol = memo(({ x, y, loadDesc }) => {
    if (!loadDesc) return null;

    return (
        <g>
            <rect
                x={x - 60} y={y - 20}
                width={120} height={40}
                className="fill-slate-900/90 stroke-slate-600"
                rx={6}
            />

            <text x={x} y={y + 5} textAnchor="middle"
                className="text-[13px] font-medium fill-slate-200">
                {loadDesc}
            </text>
        </g>
    );
});

/* Box z napięciem i tętnieniami - zmemoizowany */
const VoltageBox = memo(({ x, y, voltage, ripple }) => (
    <g>
        <rect
            x={x - 45} y={y - 20}
            width={90} height={40}
            className="fill-slate-900/90 stroke-amber-600/60"
            strokeWidth="1"
            rx={6}
        />
        <text x={x} y={y - 2} textAnchor="middle"
            className="text-[14px] fill-amber-400 font-bold">
            {voltage}
        </text>
        <text x={x} y={y + 15} textAnchor="middle"
            className="text-[12px] fill-green-400">
            {ripple}
        </text>
    </g>
));

/* Komponent główny schematu */
const Schematic = ({ stages, results }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const STEP = 240;
    const Y_BUS = 80;
    const Y_CAPACITOR = 180;
    const Y_GND = 280;
    const Y_LOAD = 340;
    const startX = 100;
    const posX = idx => startX + idx * STEP;

    // Komponent modalny pełnoekranowy
    const FullscreenModal = () => (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-auto p-4" onClick={() => setIsFullscreen(false)}>
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative bg-slate-950 rounded-xl p-6 max-w-[95vw]"
                    onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white text-3xl z-10 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800"
                        title="Zamknij"
                    >
                        ×
                    </button>
                    <h3 className="text-xl font-semibold text-slate-200 mb-4">Schemat zasilacza - Widok pełnoekranowy</h3>
                    <div className="overflow-x-auto overflow-y-auto max-h-[85vh]">
                        {renderSchematic(true)}
                    </div>
                </div>
            </div>
        </div>
    );

    // Funkcja renderująca schemat
    const renderSchematic = (isLarge = false) => (
        <svg
            viewBox={`0 0 ${posX(stages.length - 1) + 150} 400`}
            className={isLarge ? "w-auto h-full" : "w-full h-auto"}
            style={isLarge ? { minWidth: `${posX(stages.length - 1) + 150}px`, height: '400px' } : {}}
        >
            <defs>
                <linearGradient id="busGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="50%" stopColor="#64748b" />
                    <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                <linearGradient id="gndGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                </linearGradient>
            </defs>

            {/* Etykiety szyn */}
            <text x="40" y={Y_BUS + 5} className="text-[16px] fill-slate-300 font-bold">B+</text>
            <text x="35" y={Y_GND + 5} className="text-[16px] fill-slate-400 font-bold">GND</text>
            <text x="25" y={Y_LOAD - 15} className="text-[14px] fill-slate-500 font-medium transform-origin-25-340"
                transform="rotate(-90, 25, 340)">Load</text>

            {/* Początek linii B+ */}
            <line x1={70} y1={Y_BUS} x2={posX(0) - 20} y2={Y_BUS}
                stroke="url(#busGradient)" strokeWidth="3" />

            {/* Linia GND ciągła */}
            <line x1={70} y1={Y_GND} x2={posX(stages.length - 1) + 50} y2={Y_GND}
                stroke="url(#gndGradient)" strokeWidth="3" />

            {/* Sekcje */}
            {stages.map((s, idx) => {
                const x = posX(idx);
                const isLC = s.filterType === 'LC';
                const res = results[idx];

                return (
                    <g key={s.id}>
                        {/* Połączenie B+ i element filtrujący dla sekcji > 0 */}
                        {idx > 0 && (
                            <>
                                <line
                                    x1={posX(idx - 1)} y1={Y_BUS}
                                    x2={(posX(idx - 1) + x) / 2 - 25} y2={Y_BUS}
                                    className="stroke-slate-400 stroke-3"
                                />

                                {isLC ? (
                                    <Inductor
                                        x={(posX(idx - 1) + x) / 2}
                                        y={Y_BUS}
                                        label={`L${s.name}`}
                                        value={`${s.L || 10}H`}
                                    />
                                ) : (
                                    <Resistor
                                        x={(posX(idx - 1) + x) / 2}
                                        y={Y_BUS}
                                        label={`R${s.name}`}
                                        value={`${s.R}Ω`}
                                    />
                                )}

                                <line
                                    x1={(posX(idx - 1) + x) / 2 + 25} y1={Y_BUS}
                                    x2={x} y2={Y_BUS}
                                    className="stroke-slate-400 stroke-3"
                                />
                            </>
                        )}

                        {/* Węzeł */}
                        <Node x={x} y={Y_BUS} name={s.name} />

                        {/* Box z napięciem - nad węzłem */}
                        <VoltageBox
                            x={x}
                            y={Y_BUS - 50}
                            voltage={`${res.U}V`}
                            ripple={fRipple(res.mV)}
                        />

                        {/* Linia pionowa do kondensatora */}
                        <line
                            x1={x} y1={Y_BUS + 7}
                            x2={x} y2={Y_CAPACITOR - 15}
                            className="stroke-slate-400 stroke-2"
                        />

                        {/* Kondensator pionowy */}
                        <Capacitor
                            x={x}
                            y={Y_CAPACITOR}
                            label={`C${s.name}`}
                            value={`${s.C}µF`}
                        />

                        {/* Linia od kondensatora do masy */}
                        <line
                            x1={x} y1={Y_CAPACITOR + 15}
                            x2={x} y2={Y_GND}
                            className="stroke-slate-400 stroke-2"
                        />

                        {/* Kropka połączenia z masą */}
                        <circle cx={x} cy={Y_GND} r={4} className="fill-slate-400" />

                        {/* Obciążenie */}
                        <LoadSymbol
                            x={x}
                            y={Y_LOAD}
                            loadDesc={res.loadDesc}
                        />

                        {/* Linia przerywana do obciążenia */}
                        <line
                            x1={x} y1={Y_GND + 5}
                            x2={x} y2={Y_LOAD - 25}
                            className="stroke-slate-600 stroke-1"
                            strokeDasharray="5 5"
                        />
                    </g>
                );
            })}

            {/* Status Box */}
            <g transform={`translate(${posX(stages.length - 1) + 60}, 20)`}>
                <rect x="0" y="0" width="80" height="70"
                    className="fill-slate-900/90 stroke-slate-700"
                    strokeWidth="1"
                    rx="8" />
                <text x="40" y="20" textAnchor="middle" className="text-[13px] fill-slate-300 font-bold">
                    Status:
                </text>
                {results.length > 0 && (
                    <>
                        {results[results.length - 1].mV < 1 ? (
                            <text x="40" y="40" textAnchor="middle" className="text-[13px] fill-green-400 font-bold">
                                ✓ Good
                            </text>
                        ) : results[results.length - 1].mV < 5 ? (
                            <text x="40" y="40" textAnchor="middle" className="text-[13px] fill-yellow-400 font-bold">
                                ◐ Fair
                            </text>
                        ) : (
                            <text x="40" y="40" textAnchor="middle" className="text-[13px] fill-orange-400 font-bold">
                                ⚠ Poor
                            </text>
                        )}
                        <text x="40" y="58" textAnchor="middle" className="text-[11px] fill-slate-400">
                            {fRipple(results[results.length - 1].mV)}
                        </text>
                    </>
                )}
            </g>
        </svg>
    );

    return (
        <>
            <div className="psu-card bg-slate-900/50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-200">Schemat zasilacza</h3>
                    <div className="flex items-center gap-4">
                        {/* Przycisk powiększenia */}
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm transition-colors flex items-center gap-1"
                            title="Powiększ schemat"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Powiększ
                        </button>

                        {/* Wskaźnik liczby sekcji */}
                        {stages.length > 4 && (
                            <span className="text-xs text-orange-400">
                                {stages.length} sekcji - użyj powiększenia
                            </span>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                                <span>Węzły</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-8 h-2 bg-slate-800 border border-slate-400"></div>
                                <span>RC/LC</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-slate-900 border border-slate-600 rounded"></div>
                                <span>Obciążenia</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-950 rounded-lg p-6 border border-slate-800 overflow-x-auto">
                    {renderSchematic(false)}
                </div>

                {/* Legenda */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-3 bg-slate-800 border-2 border-slate-400 rounded"></div>
                        <span className="text-slate-300">Rezystor</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="30" height="10">
                            <path d="M 0 5 A 5 5 0 0 1 10 5 A 5 5 0 0 1 20 5 A 5 5 0 0 1 30 5"
                                className="fill-none stroke-slate-400 stroke-2" />
                        </svg>
                        <span className="text-slate-300">Cewka</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg width="30" height="20">
                            <rect x="13" y="4" width="4" height="3" className="fill-slate-400" />
                            <rect x="13" y="13" width="4" height="3" className="fill-slate-400" />
                        </svg>
                        <span className="text-slate-300">Kondensator</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-400 rounded-full border-2 border-indigo-600"></div>
                        <span className="text-slate-300">Węzeł</span>
                    </div>
                </div>
            </div>

            {/* Modal pełnoekranowy */}
            {isFullscreen && <FullscreenModal />}
        </>
    );
};

// Eksportujemy zmemoizowany komponent
export default memo(Schematic);