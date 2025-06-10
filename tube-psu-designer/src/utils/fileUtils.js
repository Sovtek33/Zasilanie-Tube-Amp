/*  fileUtils.js — Funkcje import/export konfiguracji
 *  (c) 2025 Wiśnia / PSU Designer
 *  ------------------------------------------------- */

// Eksport konfiguracji do pliku JSON
export const exportConfig = (vac, rectifier, stages, powerTubeType = null, powerConfig = null) => {
    const config = {
        version: "6.0",
        timestamp: new Date().toISOString(),
        vac,
        rectifier,
        powerTubeType,
        powerConfig,
        stages: stages.map(s => ({
            name: s.name,
            R: s.R,
            C: s.C,
            filterType: s.filterType,
            L: s.L,
            load: s.load
        }))
    };

    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `psu_config_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
};

// Import konfiguracji z pliku JSON
export const importConfig = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const config = JSON.parse(e.target.result);
            callback(config);
        } catch (err) {
            alert('Błąd podczas importu pliku: ' + err.message);
        }
    };
    reader.readAsText(file);
};

// Walidacja importowanej konfiguracji
export const validateConfig = (config) => {
    const errors = [];

    if (!config.version) {
        errors.push('Brak informacji o wersji');
    }

    if (!config.vac || config.vac < 200 || config.vac > 500) {
        errors.push('Nieprawidłowe napięcie transformatora');
    }

    if (!config.rectifier) {
        errors.push('Brak informacji o prostowniku');
    }

    if (!Array.isArray(config.stages) || config.stages.length === 0) {
        errors.push('Brak sekcji filtrowania');
    }

    // Walidacja każdej sekcji
    config.stages?.forEach((stage, idx) => {
        if (!stage.name) {
            errors.push(`Sekcja ${idx + 1}: Brak nazwy`);
        }

        if (typeof stage.R !== 'number' || stage.R < 0) {
            errors.push(`Sekcja ${stage.name}: Nieprawidłowa wartość rezystora`);
        }

        if (typeof stage.C !== 'number' || stage.C <= 0) {
            errors.push(`Sekcja ${stage.name}: Nieprawidłowa wartość kondensatora`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Eksport do CSV (dla analizy w arkuszu kalkulacyjnym)
export const exportToCSV = (results, vac, rectifier) => {
    const headers = [
        'Sekcja',
        'Typ obciążenia',
        'R [Ω]',
        'C [µF]',
        'U [V]',
        'I [mA]',
        'Ripple [mV]',
        'Moc na R [W]'
    ];

    const rows = results.map(r => [
        r.name,
        r.loadDesc || 'Brak',
        r.R,
        r.C,
        r.U,
        r.I,
        r.mV?.toFixed(2) || '0',
        (r.R * Math.pow(parseFloat(r.I) / 1000, 2)).toFixed(3)
    ]);

    // Dodaj nagłówek z podstawowymi parametrami
    const csvContent = [
        `# PSU Designer Export - ${new Date().toISOString()}`,
        `# Transformer: ${vac}V AC, Rectifier: ${rectifier}`,
        `#`,
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `psu_analysis_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();

    URL.revokeObjectURL(url);
};