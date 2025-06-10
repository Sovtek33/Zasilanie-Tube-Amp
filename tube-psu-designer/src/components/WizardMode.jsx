import React, { useState, useMemo } from 'react';
import { POWER_TUBES, PREAMP_TUBES, INVERTER_TYPES, SECTION_TYPES } from '../data/tubes';
import { calculateSectionCurrent } from '../utils/calculations';

const WizardMode = React.memo(({ onApplyConfig, onSwitchToExpert }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [wizardConfig, setWizardConfig] = useState({
        // Krok 1: Typ wzmacniacza
        ampType: "guitar", // guitar, hifi, bass
        powerLevel: "medium", // low, medium, high

        // Krok 2: Lampy mocy
        powerTubes: "EL34",
        powerConfig: "Push-Pull",
        targetPower: 50,

        // Krok 3: Przedwzmacniacz
        preampStages: 3,
        preampTube: "12AX7",
        inverterType: "Long-tail pair",

        // Krok 4: Filtry
        useLC: false,
        targetRipple: 1, // mV
        filterQuality: "standard", // basic, standard, premium

        // Krok 5: Zaawansowane
        headroom: 20, // % zapasu napięciowego
        safetyMargin: 15, // % zapasu prądowego
    });

    // Definicje kroków
    const steps = [
        {
            title: "Typ wzmacniacza",
            description: "Wybierz zastosowanie i poziom mocy",
            icon: "🎸"
        },
        {
            title: "Lampy mocy",
            description: "Konfiguracja stopnia wyjściowego",
            icon: "⚡"
        },
        {
            title: "Przedwzmacniacz",
            description: "Stopnie wzmocnienia i inverter",
            icon: "📡"
        },
        {
            title: "Filtry",
            description: "Jakość zasilania i tętnienia",
            icon: "🔧"
        },
        {
            title: "Podsumowanie",
            description: "Przegląd i generowanie",
            icon: "✅"
        }
    ];

    // Zalecenia na podstawie typu wzmacniacza
    const ampTypeRecommendations = {
        guitar: {
            tubes: ["EL34", "6L6GC", "EL84", "6V6GT"],
            preamp: ["12AX7", "12AT7"],
            ripple: 2,
            description: "Optymalizacja pod kątem charakteru dźwięku i dynamiki"
        },
        hifi: {
            tubes: ["EL34", "KT88", "300B", "2A3"],
            preamp: ["12AU7", "6SN7", "12AX7"],
            ripple: 0.5,
            description: "Najwyższa jakość dźwięku i minimalne zniekształcenia"
        },
        bass: {
            tubes: ["6550", "KT88", "KT120", "KT150"],
            preamp: ["12AX7", "12AT7"],
            ripple: 1.5,
            description: "Wysokie napięcia i prądy dla niskich częstotliwości"
        }
    };

    // Kalkulacje na podstawie konfiguracji
    const calculations = useMemo(() => {
        const powerTube = POWER_TUBES[wizardConfig.powerTubes];
        const config = wizardConfig.powerConfig;
        const multiplier = config === "Push-Pull" ? 2 : config === "Parallel Push-Pull" ? 4 : 1;

        // Prądy
        const powerCurrent = powerTube.Ia * multiplier;
        const g2Current = powerTube.type !== "triode" ? powerTube.Ig2 * multiplier : 0;
        const inverterCurrent = INVERTER_TYPES[wizardConfig.inverterType]?.current || 2.5;
        const preampCurrent = (PREAMP_TUBES[wizardConfig.preampTube]?.Ia || 1.2) * wizardConfig.preampStages;
        const totalCurrent = powerCurrent + g2Current + inverterCurrent + preampCurrent;

        // Napięcia
        const baseVoltage = powerTube.Va_typical || 400;
        const recommendedVac = Math.ceil((baseVoltage * (1 + wizardConfig.headroom / 100) + 50) / 10) * 10;

        // Moc
        const estimatedPower = powerTube.type === "triode"
            ? powerCurrent * baseVoltage / 2000 * multiplier
            : powerCurrent * baseVoltage / 3000 * multiplier;

        return {
            powerCurrent,
            g2Current,
            inverterCurrent,
            preampCurrent,
            totalCurrent,
            recommendedVac,
            estimatedPower,
            baseVoltage
        };
    }, [wizardConfig]);

    // Generowanie konfiguracji
    const generateConfiguration = () => {
        const stages = [];
        const calc = calculations;
        const recommendations = ampTypeRecommendations[wizardConfig.ampType];

        // Sekcja A - Anody lamp mocy
        stages.push({
            id: Date.now(),
            name: "A",
            R: 0,
            C: wizardConfig.useLC ? 10 : wizardConfig.filterQuality === "premium" ? 100 : 47,
            filterType: wizardConfig.useLC ? "LC" : "RC",
            L: wizardConfig.useLC ? 5 : undefined,
            load: {
                type: "power",
                tubes: wizardConfig.powerTubes,
                config: wizardConfig.powerConfig,
                dcr: calc.estimatedPower > 30 ? 150 : 100
            }
        });

        // Sekcja B - G2 (tylko dla pentod/beam)
        if (POWER_TUBES[wizardConfig.powerTubes].type !== "triode") {
            stages.push({
                id: Date.now() + 1,
                name: "B",
                R: 1000,
                C: wizardConfig.filterQuality === "premium" ? 100 : 47,
                filterType: "RC",
                load: {
                    type: "g2",
                    tubes: wizardConfig.powerTubes,
                    config: wizardConfig.powerConfig,
                    resistor: wizardConfig.powerConfig === "Push-Pull" ? 470 : 220
                }
            });
        }

        // Sekcja C - Inverter
        stages.push({
            id: Date.now() + 2,
            name: String.fromCharCode(65 + stages.length),
            R: wizardConfig.filterQuality === "basic" ? 15000 : 10000,
            C: wizardConfig.filterQuality === "premium" ? 47 : 22,
            filterType: "RC",
            load: {
                type: "inverter",
                inverterType: wizardConfig.inverterType,
                Ra: 100000
            }
        });

        // Sekcje D+ - Preamp
        const preampSections = Math.ceil(wizardConfig.preampStages / 2);
        for (let i = 0; i < preampSections; i++) {
            const tubesInSection = Math.min(2, wizardConfig.preampStages - i * 2);
            const resistance = wizardConfig.filterQuality === "basic" ? 100000 :
                i === 0 ? 47000 : 82000;

            stages.push({
                id: Date.now() + 3 + i,
                name: String.fromCharCode(65 + stages.length),
                R: resistance,
                C: wizardConfig.filterQuality === "premium" ? 33 : 22,
                filterType: "RC",
                load: {
                    type: "preamp",
                    tubes: wizardConfig.preampTube,
                    count: tubesInSection,
                    Ra: 100000
                }
            });
        }

        return {
            vac: calc.recommendedVac,
            rectifier: wizardConfig.ampType === "hifi" ? "GZ34 / 5AR4" :
                calc.totalCurrent > 150 ? "Silicon Bridge" : "GZ34 / 5AR4",
            stages
        };
    };

    // Walidacja kroku
    const validateStep = (stepIndex) => {
        switch (stepIndex) {
            case 0:
                return wizardConfig.ampType && wizardConfig.powerLevel;
            case 1:
                return wizardConfig.powerTubes && wizardConfig.powerConfig;
            case 2:
                return wizardConfig.preampTube && wizardConfig.inverterType && wizardConfig.preampStages > 0;
            case 3:
                return wizardConfig.targetRipple > 0;
            default:
                return true;
        }
    };

    // Renderowanie kroków
    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Typ wzmacniacza</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {Object.entries(ampTypeRecommendations).map(([type, rec]) => (
                                    <button
                                        key={type}
                                        onClick={() => setWizardConfig({ ...wizardConfig, ampType: type })}
                                        className={`p-4 rounded-lg border-2 transition-all ${wizardConfig.ampType === type
                                            ? 'border-indigo-500 bg-indigo-500/20'
                                            : 'border-slate-600 hover:border-slate-500'
                                            } text-left`}
                                    >
                                        <div className="text-lg font-semibold capitalize mb-2">{type}</div>
                                        <div className="text-xs text-slate-400 leading-relaxed">
                                            {rec.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Poziom mocy</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: "low", label: "Niski", desc: "< 15W", icon: "🔋" },
                                    { key: "medium", label: "Średni", desc: "15-50W", icon: "⚡" },
                                    { key: "high", label: "Wysoki", desc: "> 50W", icon: "🚀" }
                                ].map(({ key, label, desc, icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setWizardConfig({ ...wizardConfig, powerLevel: key })}
                                        className={`p-3 rounded-lg border transition-all ${wizardConfig.powerLevel === key
                                            ? 'border-indigo-500 bg-indigo-500/20'
                                            : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{icon}</div>
                                        <div className="font-medium">{label}</div>
                                        <div className="text-xs text-slate-400">{desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 1:
                const recommendations = ampTypeRecommendations[wizardConfig.ampType];
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Lampa mocy</label>
                            <select
                                value={wizardConfig.powerTubes}
                                onChange={e => setWizardConfig({ ...wizardConfig, powerTubes: e.target.value })}
                                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
                            >
                                {recommendations.tubes.map(tube => (
                                    <option key={tube} value={tube}>
                                        {tube} - {POWER_TUBES[tube].type} ({POWER_TUBES[tube].Ia}mA)
                                    </option>
                                ))}
                            </select>
                            {POWER_TUBES[wizardConfig.powerTubes] && (
                                <div className="mt-2 text-sm text-slate-400">
                                    Typowe napięcie: {POWER_TUBES[wizardConfig.powerTubes].Va_typical}V
                                    {POWER_TUBES[wizardConfig.powerTubes].type !== "triode" && (
                                        <>, Prąd G2: {POWER_TUBES[wizardConfig.powerTubes].Ig2}mA</>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Konfiguracja</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {["Single-Ended", "Push-Pull", "Parallel Push-Pull"].map(config => (
                                    <button
                                        key={config}
                                        onClick={() => setWizardConfig({ ...wizardConfig, powerConfig: config })}
                                        className={`p-3 rounded-lg border transition-all ${wizardConfig.powerConfig === config
                                            ? 'border-indigo-500 bg-indigo-500/20'
                                            : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{config}</div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {config === "Single-Ended" ? "Klasa A" :
                                                config === "Push-Pull" ? "Klasa AB" : "2x Push-Pull"}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-sm text-slate-400 mb-2">Szacowana moc wyjściowa:</div>
                            <div className="text-2xl font-bold text-amber-300">
                                ~{calculations.estimatedPower.toFixed(0)}W
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                                Prąd anodowy: {calculations.powerCurrent.toFixed(0)}mA
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Liczba stopni przedwzmacniacza</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="1"
                                    max="8"
                                    value={wizardConfig.preampStages}
                                    onChange={e => setWizardConfig({ ...wizardConfig, preampStages: +e.target.value })}
                                    className="flex-1"
                                />
                                <span className="text-xl font-bold text-indigo-300 w-12 text-center">
                                    {wizardConfig.preampStages}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-slate-400">
                                Typowo: 2-3 dla hi-fi, 3-5 dla gitary, 4-8 dla high gain
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Lampa przedwzmacniacza</label>
                            <select
                                value={wizardConfig.preampTube}
                                onChange={e => setWizardConfig({ ...wizardConfig, preampTube: e.target.value })}
                                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
                            >
                                {ampTypeRecommendations[wizardConfig.ampType].preamp.map(tube => (
                                    <option key={tube} value={tube}>
                                        {tube} - μ={PREAMP_TUBES[tube].mu} ({PREAMP_TUBES[tube].Ia}mA)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Typ inwertera fazowego</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.entries(INVERTER_TYPES).map(([type, data]) => (
                                    <button
                                        key={type}
                                        onClick={() => setWizardConfig({ ...wizardConfig, inverterType: type })}
                                        className={`p-3 rounded-lg border transition-all ${wizardConfig.inverterType === type
                                            ? 'border-indigo-500 bg-indigo-500/20'
                                            : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="font-medium text-sm">{type}</div>
                                        <div className="text-xs text-slate-400">
                                            {data.current}mA, {data.resistors} rez.
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <div className="text-sm text-slate-400 mb-2">Całkowity prąd przedwzmacniacza:</div>
                            <div className="text-lg font-bold text-green-300">
                                {(calculations.preampCurrent + calculations.inverterCurrent).toFixed(1)}mA
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-3">Jakość filtrowania</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { key: "basic", label: "Podstawowa", desc: "Dobra do prób", icon: "🔌" },
                                    { key: "standard", label: "Standardowa", desc: "Większość zastosowań", icon: "⚡" },
                                    { key: "premium", label: "Premium", desc: "Hi-Fi / Studio", icon: "💎" }
                                ].map(({ key, label, desc, icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setWizardConfig({ ...wizardConfig, filterQuality: key })}
                                        className={`p-3 rounded-lg border transition-all ${wizardConfig.filterQuality === key
                                            ? 'border-indigo-500 bg-indigo-500/20'
                                            : 'border-slate-600 hover:border-slate-500'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">{icon}</div>
                                        <div className="font-medium text-sm">{label}</div>
                                        <div className="text-xs text-slate-400">{desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={wizardConfig.useLC}
                                    onChange={e => setWizardConfig({ ...wizardConfig, useLC: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <div>
                                    <div className="font-medium">Użyj filtrów LC</div>
                                    <div className="text-xs text-slate-400">
                                        Lepsze tłumienie tętnień, wyższy koszt
                                    </div>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">
                                Docelowe tętnienia: {wizardConfig.targetRipple}mV
                            </label>
                            <input
                                type="range"
                                min="0.1"
                                max="5"
                                step="0.1"
                                value={wizardConfig.targetRipple}
                                onChange={e => setWizardConfig({ ...wizardConfig, targetRipple: +e.target.value })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Hi-Fi (0.1mV)</span>
                                <span>Guitar (5mV)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">
                                Zapas napięciowy: {wizardConfig.headroom}%
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                value={wizardConfig.headroom}
                                onChange={e => setWizardConfig({ ...wizardConfig, headroom: +e.target.value })}
                                className="w-full"
                            />
                        </div>
                    </div>
                );

            case 4:
                const config = generateConfiguration();
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-4 rounded-lg border border-indigo-500/30">
                            <h4 className="text-lg font-semibold mb-3">Podsumowanie konfiguracji</h4>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="text-slate-400">Typ wzmacniacza:</div>
                                    <div className="font-medium capitalize">{wizardConfig.ampType}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400">Szacowana moc:</div>
                                    <div className="font-medium text-amber-300">~{calculations.estimatedPower.toFixed(0)}W</div>
                                </div>
                                <div>
                                    <div className="text-slate-400">Lampy mocy:</div>
                                    <div className="font-medium">{wizardConfig.powerConfig} {wizardConfig.powerTubes}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400">Całkowity prąd:</div>
                                    <div className="font-medium text-green-300">{calculations.totalCurrent.toFixed(0)}mA</div>
                                </div>
                                <div>
                                    <div className="text-slate-400">Zalecane napięcie:</div>
                                    <div className="font-medium text-blue-300">{config.vac}V AC</div>
                                </div>
                                <div>
                                    <div className="text-slate-400">Prostownik:</div>
                                    <div className="font-medium">{config.rectifier}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Wygenerowane sekcje ({config.stages.length}):</h4>
                            <div className="space-y-2">
                                {config.stages.map((stage, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-indigo-300">{stage.name}</span>
                                            <span className="text-slate-400">
                                                {stage.filterType} {stage.R}Ω/{stage.C}µF
                                            </span>
                                        </div>
                                        <div className="text-slate-500">
                                            {stage.load.type === "power" ? "Lampy mocy" :
                                                stage.load.type === "g2" ? "Siatki G2" :
                                                    stage.load.type === "inverter" ? "Inverter" :
                                                        stage.load.type === "preamp" ? `Preamp ${stage.load.count}x` : ""}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-yellow-600/10 border border-yellow-600/30 p-3 rounded-lg">
                            <div className="text-sm text-yellow-300">
                                ⚠️ Uwaga: To są wartości wyjściowe. Po zastosowaniu możesz dostosować parametry w trybie eksperta.
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="psu-card">
                <h3 className="text-lg font-semibold mb-4">Kreator konfiguracji</h3>

                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        {steps.map((step, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col items-center cursor-pointer flex-1 ${idx <= currentStep ? 'text-indigo-300' : 'text-slate-500'
                                    }`}
                                onClick={() => idx < currentStep && setCurrentStep(idx)}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${idx < currentStep ? 'bg-indigo-600' :
                                    idx === currentStep ? 'bg-indigo-500' :
                                        'bg-slate-700'
                                    }`}>
                                    {idx < currentStep ? '✓' : step.icon}
                                </div>
                                <div className="text-xs text-center hidden sm:block">{step.title}</div>
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Current step info */}
                <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-1">{steps[currentStep].title}</h4>
                    <p className="text-sm text-slate-400">{steps[currentStep].description}</p>
                </div>

                {/* Step content */}
                <div className="min-h-[300px]">
                    {renderStep()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
                    <div className="flex gap-2">
                        <button
                            onClick={onSwitchToExpert}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Przełącz na tryb eksperta
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                ← Wstecz
                            </button>
                        )}

                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={!validateStep(currentStep)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                Dalej →
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    onApplyConfig(generateConfiguration());
                                    onSwitchToExpert();
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg transition-all font-medium"
                            >
                                ✓ Zastosuj konfigurację
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default WizardMode;