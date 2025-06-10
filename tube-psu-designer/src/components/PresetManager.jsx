/*  PresetManager.jsx — Zaawansowany manager presetów zasilaczy
 *  (c) 2025 Wiśnia / PSU Designer
 *  Wersja bez localStorage - przechowuje ulubione tylko w pamięci sesji
 *  ------------------------------------------------- */

import React, { useState, useMemo } from 'react';
import { PSU_PRESETS } from '../data/presets';

const PresetManager = React.memo(({ onLoadPreset, currentConfig }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name');
    // Ulubione przechowywane tylko w state (bez localStorage)
    const [favorites, setFavorites] = useState([]);

    // Kategorie z licznikami
    const categoriesWithCounts = useMemo(() => {
        const counts = {};
        Object.values(PSU_PRESETS).forEach(preset => {
            counts[preset.category] = (counts[preset.category] || 0) + 1;
        });

        const total = Object.keys(PSU_PRESETS).length;
        return [
            { name: 'All', count: total },
            { name: 'Favorites', count: favorites.length },
            ...Object.entries(counts).map(([category, count]) => ({ name: category, count }))
        ];
    }, [favorites]);

    // Filtrowanie i sortowanie presetów
    const filteredAndSortedPresets = useMemo(() => {
        let presets = Object.entries(PSU_PRESETS);

        // Filtrowanie po kategorii
        if (selectedCategory === 'Favorites') {
            presets = presets.filter(([name]) => favorites.includes(name));
        } else if (selectedCategory !== 'All') {
            presets = presets.filter(([, preset]) => preset.category === selectedCategory);
        }

        // Filtrowanie po wyszukiwaniu
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            presets = presets.filter(([name, preset]) =>
                name.toLowerCase().includes(term) ||
                preset.description.toLowerCase().includes(term) ||
                preset.category.toLowerCase().includes(term) ||
                preset.powerStage?.toLowerCase().includes(term)
            );
        }

        // Sortowanie
        presets.sort(([nameA, presetA], [nameB, presetB]) => {
            switch (sortBy) {
                case 'name':
                    return nameA.localeCompare(nameB);
                case 'category':
                    return presetA.category.localeCompare(presetB.category) || nameA.localeCompare(nameB);
                case 'voltage':
                    return presetB.vac - presetA.vac;
                case 'stages':
                    return presetB.stages.length - presetA.stages.length;
                default:
                    return 0;
            }
        });

        return presets;
    }, [selectedCategory, searchTerm, sortBy, favorites]);

    // Zarządzanie ulubionymi (tylko w pamięci)
    const toggleFavorite = (presetName) => {
        const newFavorites = favorites.includes(presetName)
            ? favorites.filter(name => name !== presetName)
            : [...favorites, presetName];

        setFavorites(newFavorites);
    };

    // Porównanie z aktualną konfiguracją
    const compareWithCurrent = (preset) => {
        if (!currentConfig || !currentConfig.stages) return null;

        const differences = [];
        if (currentConfig.vac !== preset.vac) {
            differences.push(`Napięcie: ${currentConfig.vac}V → ${preset.vac}V`);
        }
        if (currentConfig.rectifier !== preset.rectifier) {
            differences.push(`Prostownik: ${preset.rectifier}`);
        }
        if (currentConfig.stages.length !== preset.stages.length) {
            differences.push(`Sekcje: ${currentConfig.stages.length} → ${preset.stages.length}`);
        }

        return differences;
    };

    // Komponent karty presetu
    const PresetCard = ({ name, preset }) => {
        const isFavorite = favorites.includes(name);
        const differences = compareWithCurrent(preset);
        const isCurrent = differences && differences.length === 0;

        return (
            <div
                className={`preset-card ${isCurrent ? 'border-green-500/50 bg-green-900/10' : ''}`}
                onClick={() => {
                    onLoadPreset(preset);
                    setShowModal(false);
                }}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-200">{name}</h3>
                            {isCurrent && (
                                <span className="text-xs px-1.5 py-0.5 bg-green-600 text-white rounded">
                                    Aktualny
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(name);
                            }}
                            className={`p-1 rounded transition-colors ${isFavorite
                                ? 'text-yellow-400 hover:text-yellow-300'
                                : 'text-slate-500 hover:text-yellow-400'
                                }`}
                            title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                        >
                            {isFavorite ? '★' : '☆'}
                        </button>

                        <span className="text-xs px-2 py-1 rounded spec-badge">
                            {preset.category}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                    {preset.description}
                </p>

                {/* Specyfikacja techniczna */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Napięcie:</span>
                        <span className="text-slate-300">{preset.vac}V</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Sekcje:</span>
                        <span className="text-slate-300">{preset.stages.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Prostownik:</span>
                        <span className="text-slate-300 truncate" title={preset.rectifier}>
                            {preset.rectifier.length > 12 ? preset.rectifier.substring(0, 12) + '...' : preset.rectifier}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Lampy:</span>
                        <span className="text-slate-300">{preset.powerStage || 'N/A'}</span>
                    </div>
                </div>

                {/* Różnice z aktualną konfiguracją */}
                {differences && differences.length > 0 && (
                    <div className="text-xs text-orange-300 border-t border-slate-700 pt-2">
                        <div className="font-semibold mb-1">Zmiany:</div>
                        {differences.slice(0, 2).map((diff, i) => (
                            <div key={i} className="text-orange-400">• {diff}</div>
                        ))}
                        {differences.length > 2 && (
                            <div className="text-slate-500">... i {differences.length - 2} więcej</div>
                        )}
                    </div>
                )}

                {/* Szybki podgląd sekcji */}
                <div className="mt-2 pt-2 border-t border-slate-700">
                    <div className="flex flex-wrap gap-1">
                        {preset.stages.slice(0, 4).map((stage, i) => (
                            <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">
                                {stage.name}: {stage.C}µF
                            </span>
                        ))}
                        {preset.stages.length > 4 && (
                            <span className="text-xs px-1.5 py-0.5 bg-slate-600 rounded">
                                +{preset.stages.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Modal presetów
    const PresetModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
            onClick={() => setShowModal(false)}>
            <div className="modal-container max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden rounded-xl modal-content"
                onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-300">Presety zasilaczy</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                {filteredAndSortedPresets.length} z {Object.keys(PSU_PRESETS).length} presetów
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-slate-400 hover:text-white text-2xl transition-colors"
                            title="Zamknij"
                        >
                            ×
                        </button>
                    </div>

                    {/* Kontrolki */}
                    <div className="space-y-4 mb-6">
                        {/* Wyszukiwanie */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Szukaj presetów..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:border-indigo-500"
                            >
                                <option value="name">Sortuj: Nazwa</option>
                                <option value="category">Sortuj: Kategoria</option>
                                <option value="voltage">Sortuj: Napięcie</option>
                                <option value="stages">Sortuj: Liczba sekcji</option>
                            </select>
                        </div>

                        {/* Filtry kategorii */}
                        <div className="flex flex-wrap gap-2">
                            {categoriesWithCounts.map(({ name, count }) => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedCategory(name)}
                                    className={`px-3 py-1 rounded-full text-sm transition-all category-pill ${selectedCategory === name ? 'active' : ''
                                        }`}
                                    title={`${count} presetów w kategorii ${name}`}
                                >
                                    {name}
                                    <span className="ml-1 text-xs opacity-70">({count})</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista presetów */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                        {filteredAndSortedPresets.length > 0 ? (
                            filteredAndSortedPresets.map(([name, preset]) => (
                                <PresetCard key={name} name={name} preset={preset} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-slate-400">
                                <div className="text-4xl mb-2">🔍</div>
                                <div>Nie znaleziono presetów</div>
                                <div className="text-sm mt-1">
                                    Spróbuj zmienić kryteria wyszukiwania
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Statystyki */}
                    <div className="mt-6 pt-4 border-t border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                            <div className="text-lg font-bold text-indigo-300">
                                {Object.keys(PSU_PRESETS).length}
                            </div>
                            <div className="text-slate-400">Wszystkich</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-yellow-300">
                                {favorites.length}
                            </div>
                            <div className="text-slate-400">Ulubionych</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-300">
                                {categoriesWithCounts.length - 2}
                            </div>
                            <div className="text-slate-400">Kategorii</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-300">
                                {filteredAndSortedPresets.length}
                            </div>
                            <div className="text-slate-400">Wyświetlanych</div>
                        </div>
                    </div>

                    {/* Informacja o braku localStorage */}
                    {favorites.length > 0 && (
                        <div className="mt-4 text-xs text-slate-500 text-center">
                            ℹ️ Ulubione są przechowywane tylko podczas tej sesji
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-3">
            <h3 className="text-base font-semibold flex items-center gap-2">
                <span>Presety</span>
                {favorites.length > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-600 text-white rounded-full">
                        {favorites.length} ★
                    </span>
                )}
            </h3>

            <button
                onClick={() => setShowModal(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
                <span className="text-lg">🎛️</span>
                <span>Przeglądaj presety</span>
                <span className="text-xs opacity-75">({Object.keys(PSU_PRESETS).length})</span>
            </button>

            {/* Szybki dostęp do ulubionych */}
            {favorites.length > 0 && (
                <div className="space-y-2">
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                        <span>★</span>
                        <span>Ulubione:</span>
                    </div>
                    <div className="space-y-1">
                        {favorites.slice(0, 3).map(name => (
                            <button
                                key={name}
                                onClick={() => onLoadPreset(PSU_PRESETS[name])}
                                className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
                                title={PSU_PRESETS[name]?.description}
                            >
                                <div className="font-medium">{name}</div>
                                <div className="text-xs text-slate-400">
                                    {PSU_PRESETS[name]?.category} • {PSU_PRESETS[name]?.vac}V
                                </div>
                            </button>
                        ))}
                        {favorites.length > 3 && (
                            <button
                                onClick={() => {
                                    setSelectedCategory('Favorites');
                                    setShowModal(true);
                                }}
                                className="w-full text-center px-3 py-1 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                            >
                                +{favorites.length - 3} więcej ulubionych
                            </button>
                        )}
                    </div>
                </div>
            )}

            {showModal && <PresetModal />}
        </div>
    );
}, (prevProps, nextProps) => {
    // Porównanie głębokie konfiguracji
    return JSON.stringify(prevProps.currentConfig) === JSON.stringify(nextProps.currentConfig);
});

export default PresetManager;