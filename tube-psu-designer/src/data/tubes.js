/*  tubes.js — Definicje lamp i konfiguracji - ENHANCED GUITAR AMP EDITION
 *  (c) 2025 Wiśnia / PSU Designer
 *  Rozszerzona baza danych z parametrami dla gitarowych wzmacniaczy
 *  ------------------------------------------------- */

// ============================================
// LAMPY MOCY - rozszerzona lista z parametrami gitarowymi
// ============================================
export const POWER_TUBES = {
    // === KLASYCZNE PENTODY/BEAM TETRODY ===
    "EL34": {
        Ia: 40,           // Prąd anodowy spoczynkowy [mA]
        Ig2: 5,           // Prąd siatki ekranującej [mA]
        Vg2: 250,         // Napięcie siatki ekranującej [V]
        type: "pentode",
        Va_typical: 400,  // Typowe napięcie anodowe [V]
        Va_max: 500,      // Maksymalne napięcie anodowe [V]
        Pa_max: 25,       // Maksymalna moc na anodzie [W]
        guitar_amps: ["Marshall Plexi", "Marshall JCM800", "Orange OR50", "Hiwatt DR103"],
        tone_character: "Agresywny, środkowy, rock/metal",
        vintage_year: 1953
    },

    "6L6GC": {
        Ia: 35,
        Ig2: 4,
        Vg2: 250,
        type: "beam",
        Va_typical: 400,
        Va_max: 500,
        Pa_max: 30,
        guitar_amps: ["Fender Twin Reverb", "Mesa Boogie Mark", "Fender Bassman"],
        tone_character: "Czysty, przejrzysty, amerykański",
        vintage_year: 1936
    },

    "EL84": {
        Ia: 30,
        Ig2: 4.5,
        Vg2: 250,
        type: "pentode",
        Va_typical: 300,
        Va_max: 400,
        Pa_max: 12,
        guitar_amps: ["Vox AC30", "Vox AC15", "Marshall Class 5"],
        tone_character: "Średnie, kompresyjne, brytyjskie",
        vintage_year: 1953
    },

    "6V6GT": {
        Ia: 22.5,
        Ig2: 2.5,
        Vg2: 250,
        type: "beam",
        Va_typical: 350,
        Va_max: 450,
        Pa_max: 14,
        guitar_amps: ["Fender Princeton", "Fender Deluxe", "Supro Delta King"],
        tone_character: "Ciepły, vintage, małe combo",
        vintage_year: 1937
    },

    // === NOWOCZESNE WYSOKOWYDAJNE ===
    "KT88": {
        Ia: 50,
        Ig2: 6,
        Vg2: 300,
        type: "beam",
        Va_typical: 450,
        Va_max: 600,
        Pa_max: 42,
        guitar_amps: ["Marshall Major", "Hiwatt Custom 100", "Orange OR100"],
        tone_character: "Potężny, hi-fi, high headroom",
        vintage_year: 1956
    },

    "KT66": {
        Ia: 32,
        Ig2: 3.5,
        Vg2: 250,
        type: "beam",
        Va_typical: 400,
        Va_max: 500,
        Pa_max: 25,
        guitar_amps: ["Marshall JTM45", "Vox AC50", "Selmer Treble N Bass"],
        tone_character: "Vintage, ciepły, brytyjski rock",
        vintage_year: 1937
    },

    "6550": {
        Ia: 42,
        Ig2: 5,
        Vg2: 300,
        type: "beam",
        Va_typical: 450,
        Va_max: 600,
        Pa_max: 35,
        guitar_amps: ["Ampeg SVT", "Mesa Boogie 400+", "Sunn Model T"],
        tone_character: "Potężny, basowy, American power",
        vintage_year: 1955
    },

    "KT120": {
        Ia: 55,
        Ig2: 7,
        Vg2: 300,
        type: "beam",
        Va_typical: 500,
        Va_max: 650,
        Pa_max: 60,
        guitar_amps: ["Modern high-gain heads", "Mesa Boogie", "PRS"],
        tone_character: "Modern, tight, high-gain",
        vintage_year: 2010
    },

    "KT150": {
        Ia: 70,
        Ig2: 8,
        Vg2: 350,
        type: "beam",
        Va_typical: 600,
        Va_max: 700,
        Pa_max: 70,
        guitar_amps: ["Mesa Boogie", "PRS", "Modern boutique"],
        tone_character: "Ultra-modern, massive headroom",
        vintage_year: 2012
    },

    // === TRIODY MOCY ===
    "300B": {
        Ia: 60,
        Ig2: 0,
        Vg2: 0,
        type: "triode",
        Va_typical: 400,
        Va_max: 450,
        Pa_max: 40,
        guitar_amps: ["Boutique SE amps", "Custom builds"],
        tone_character: "Łagodny, ciepły, SE harmonie",
        vintage_year: 1938
    },

    "2A3": {
        Ia: 45,
        Ig2: 0,
        Vg2: 0,
        type: "triode",
        Va_typical: 250,
        Va_max: 300,
        Pa_max: 15,
        guitar_amps: ["Low-power SE", "Studio monitors"],
        tone_character: "Sweet, vintage, low power",
        vintage_year: 1932
    },

    "45": {
        Ia: 34,
        Ig2: 0,
        Vg2: 0,
        type: "triode",
        Va_typical: 275,
        Va_max: 350,
        Pa_max: 10,
        guitar_amps: ["Vintage reproduction", "Studio SE"],
        tone_character: "Classic vintage, sweet",
        vintage_year: 1929
    },

    "50": {
        Ia: 55,
        Ig2: 0,
        Vg2: 0,
        type: "triode",
        Va_typical: 400,
        Va_max: 450,
        Pa_max: 50,
        guitar_amps: ["High-end SE", "Boutique builds"],
        tone_character: "Powerful SE, refined",
        vintage_year: 1933
    },

    // === SPECJALNE/VINTAGE ===
    "6AQ5": {
        Ia: 22,
        Ig2: 3,
        Vg2: 200,
        type: "beam",
        Va_typical: 250,
        Va_max: 350,
        Pa_max: 9,
        guitar_amps: ["Small vintage combo", "Practice amps"],
        tone_character: "Small, sweet, practice tone",
        vintage_year: 1950
    },

    "6BQ5": {
        Ia: 30,
        Ig2: 4.5,
        Vg2: 250,
        type: "pentode",
        Va_typical: 300,
        Va_max: 400,
        Pa_max: 12,
        guitar_amps: ["Identical to EL84", "Vox", "European"],
        tone_character: "Same as EL84",
        vintage_year: 1953
    },

    "7189": {
        Ia: 35,
        Ig2: 5,
        Vg2: 250,
        type: "pentode",
        Va_typical: 350,
        Va_max: 450,
        Pa_max: 14,
        guitar_amps: ["Ampeg guitar amps", "Vintage American"],
        tone_character: "American EL84 equivalent",
        vintage_year: 1960
    },

    "7591": {
        Ia: 35,
        Ig2: 5,
        Vg2: 250,
        type: "beam",
        Va_typical: 400,
        Va_max: 500,
        Pa_max: 19,
        guitar_amps: ["Ampeg", "Dynaco", "American vintage"],
        tone_character: "American, punchy, 60s rock",
        vintage_year: 1957
    }
};

// ============================================
// LAMPY PRZEDWZMACNIACZA - rozszerzona lista
// ============================================
export const PREAMP_TUBES = {
    // === POPULARNE DUAL-TRIODY ===
    "12AX7": {
        Ia: 1.2,          // Prąd anodowy na triodę [mA]
        mu: 100,          // Współczynnik wzmocnienia
        gm: 1.6,          // Transkonduktancja [mA/V]
        rp: 62.5,         // Rezystancja wewnętrzna [kΩ]
        type: "dual-triode",
        Ra_typical: 100000,  // Typowy rezystor anodowy [Ω]
        Va_max: 300,      // Maksymalne napięcie anodowe [V]
        guitar_usage: "Główny preamp we wszystkich wzmacniaczach",
        tone_character: "Wysokie wzmocnienie, klasyczny gitarowy",
        vintage_year: 1947,
        noise_level: "średni"
    },

    "12AT7": {
        Ia: 2.5,
        mu: 60,
        gm: 5.5,
        rp: 10.9,
        type: "dual-triode",
        Ra_typical: 47000,
        Va_max: 300,
        guitar_usage: "Driver, reverb, tremolo",
        tone_character: "Średnie wzmocnienie, więcej headroom",
        vintage_year: 1947,
        noise_level: "niski"
    },

    "12AU7": {
        Ia: 2.2,
        mu: 20,
        gm: 2.2,
        rp: 9.1,
        type: "dual-triode",
        Ra_typical: 22000,
        Va_max: 300,
        guitar_usage: "Cathode follower, tone stack driver",
        tone_character: "Niskie wzmocnienie, czysty",
        vintage_year: 1947,
        noise_level: "bardzo niski"
    },

    "12AY7": {
        Ia: 1.5,
        mu: 40,
        gm: 1.8,
        rp: 22.0,
        type: "dual-triode",
        Ra_typical: 68000,
        Va_max: 300,
        guitar_usage: "Vintage Fender, input stage",
        tone_character: "Vintage, sweet, kompresyjny",
        vintage_year: 1960,
        noise_level: "niski"
    },

    "12AV7": {
        Ia: 1.8,
        mu: 37,
        gm: 2.5,
        rp: 15.0,
        type: "dual-triode",
        Ra_typical: 47000,
        Va_max: 330,
        guitar_usage: "Marshall JTM45, vintage British",
        tone_character: "Brytyjski vintage, średnie mu",
        vintage_year: 1960,
        noise_level: "niski"
    },

    // === STARSZE DUAL-TRIODY (OCTAL) ===
    "6SL7": {
        Ia: 2.3,
        mu: 70,
        gm: 2.2,
        rp: 44.0,
        type: "dual-triode",
        Ra_typical: 47000,
        Va_max: 300,
        guitar_usage: "Hi-fi, vintage preamp",
        tone_character: "Hi-fi, neutralny, vintage",
        vintage_year: 1940,
        noise_level: "niski"
    },

    "6SN7": {
        Ia: 7.5,
        mu: 20,
        gm: 2.6,
        rp: 7.7,
        type: "dual-triode",
        Ra_typical: 22000,
        Va_max: 300,
        guitar_usage: "Driver, high-current applications",
        tone_character: "Potężny, czysty, driver",
        vintage_year: 1939,
        noise_level: "bardzo niski"
    },

    "6SC7": {
        Ia: 2.0,
        mu: 70,
        gm: 2.0,
        rp: 35.0,
        type: "dual-triode",
        Ra_typical: 47000,
        Va_max: 300,
        guitar_usage: "Vintage applications",
        tone_character: "Vintage, podobny do 6SL7",
        vintage_year: 1940,
        noise_level: "średni"
    },

    "6CG7": {
        Ia: 8.0,
        mu: 20,
        gm: 2.5,
        rp: 8.0,
        type: "dual-triode",
        Ra_typical: 22000,
        Va_max: 300,
        guitar_usage: "High-current, driver",
        tone_character: "Podobny do 6SN7",
        vintage_year: 1955,
        noise_level: "niski"
    },

    // === PENTODY PRZEDWZMACNIACZA ===
    "EF86": {
        Ia: 3.0,
        mu: 0,    // Pentoda - mu nie stosuje się
        gm: 2.0,
        rp: 0,    // Bardzo wysokie dla pentod
        type: "pentode",
        Ra_typical: 220000,
        Va_max: 300,
        guitar_usage: "Vox AC30, input stage",
        tone_character: "Bardzo wysokie wzmocnienie, syczący",
        vintage_year: 1954,
        noise_level: "wysoki"
    },

    "EF83": {
        Ia: 3.0,
        mu: 0,
        gm: 1.8,
        rp: 0,
        type: "pentode",
        Ra_typical: 220000,
        Va_max: 300,
        guitar_usage: "European amps, high gain",
        tone_character: "Wysokie wzmocnienie, europejski",
        vintage_year: 1960,
        noise_level: "wysoki"
    },

    "6267": {
        Ia: 3.0,
        mu: 0,
        gm: 2.0,
        rp: 0,
        type: "pentode",
        Ra_typical: 220000,
        Va_max: 300,
        guitar_usage: "American version of EF86",
        tone_character: "Wysokie wzmocnienie, amerykański",
        vintage_year: 1960,
        noise_level: "wysoki"
    },

    // === SPECJALNE/AUDIOPHILE ===
    "5751": {
        Ia: 1.0,
        mu: 70,
        gm: 1.2,
        rp: 58.0,
        type: "dual-triode",
        Ra_typical: 100000,
        Va_max: 300,
        guitar_usage: "Military spec, lower gain 12AX7",
        tone_character: "Ciszszy, bardziej liniowy",
        vintage_year: 1950,
        noise_level: "bardzo niski"
    },

    "7025": {
        Ia: 1.2,
        mu: 100,
        gm: 1.6,
        rp: 62.5,
        type: "dual-triode",
        Ra_typical: 100000,
        Va_max: 300,
        guitar_usage: "Low-noise 12AX7, studio",
        tone_character: "Identyczny z 12AX7, ciszszy",
        vintage_year: 1960,
        noise_level: "bardzo niski"
    },

    "6DJ8": {
        Ia: 15,
        mu: 33,
        gm: 12.5,
        rp: 2.7,
        type: "dual-triode",
        Ra_typical: 10000,
        Va_max: 300,
        guitar_usage: "Hi-fi, cathode followers",
        tone_character: "Hi-fi, szybki, liniowy",
        vintage_year: 1958,
        noise_level: "bardzo niski"
    },

    "6922": {
        Ia: 15,
        mu: 33,
        gm: 12.5,
        rp: 2.7,
        type: "dual-triode",
        Ra_typical: 10000,
        Va_max: 300,
        guitar_usage: "Premium 6DJ8, studio",
        tone_character: "Premium hi-fi, bardzo liniowy",
        vintage_year: 1960,
        noise_level: "ekstremalnie niski"
    }
};

// ============================================
// TYPY INWERTERÓW FAZOWYCH
// ============================================
export const INVERTER_TYPES = {
    "Long-tail pair": {
        current: 2.5,     // Typowy prąd [mA]
        resistors: 2,     // Liczba rezystorów anodowych
        description: "Klasyczny differential pair",
        balance: 0.95,    // Balans faz (0-1)
        gain: -0.5,       // Wzmocnienie każdej fazy
        guitar_usage: "Standard we wszystkich PP wzmacniaczach"
    },

    "Cathodyne": {
        current: 1.5,
        resistors: 1,
        description: "Split-load cathode follower",
        balance: 0.85,
        gain: 0.8,
        guitar_usage: "Proste, tanie rozwiązanie"
    },

    "Paraphase": {
        current: 2.0,
        resistors: 2,
        description: "Dwie triody w cascade",
        balance: 0.90,
        gain: -1.0,
        guitar_usage: "Vintage Fender, dobry balans"
    },

    "Floating paraphase": {
        current: 1.8,
        resistors: 2,
        description: "Floating paraphase inverter",
        balance: 0.92,
        gain: -0.9,
        guitar_usage: "Specjalne zastosowania vintage"
    },

    "Concertina": {
        current: 3.0,
        resistors: 3,
        description: "Accordion-style inverter",
        balance: 0.98,
        gain: -1.2,
        guitar_usage: "Hi-fi, bardzo dobry balans"
    }
};

// ============================================
// KONFIGURACJE LAMP MOCY
// ============================================
export const POWER_CONFIGS = {
    "Single-Ended": {
        multiplier: 1,
        class: "A",
        efficiency: 0.25,    // 25% sprawności
        thd_typical: 5.0,    // Typowe zniekształcenia [%]
        power_factor: 0.5,   // Współczynnik mocy vs. katalogowa
        description: "Klasa A, jedna lampa"
    },

    "Push-Pull": {
        multiplier: 2,
        class: "AB",
        efficiency: 0.65,    // 65% sprawności
        thd_typical: 1.0,
        power_factor: 0.8,
        description: "Klasa AB, para lamp"
    },

    "Parallel Push-Pull": {
        multiplier: 4,
        class: "AB",
        efficiency: 0.65,
        thd_typical: 0.8,
        power_factor: 0.85,
        description: "Klasa AB, dwie pary równolegle"
    },

    "Triode Push-Pull": {
        multiplier: 2,
        class: "AB",
        efficiency: 0.50,
        thd_typical: 0.5,
        power_factor: 0.6,
        description: "PP triody, niższe zniekształcenia"
    }
};

// ============================================
// PROSTOWNIKI - rozszerzona lista
// ============================================
export const RECTIFIERS = {
    // === KRZEM ===
    "Silicon Bridge": {
        drop: 1.4,        // Spadek napięcia [V]
        type: "solid_state",
        regulation: 0.95, // Regulacja (0-1)
        description: "Mostek krzemowy",
        guitar_character: "Sztywny, modern, wysokie headroom",
        max_current: 1000 // mA
    },

    "Schottky Bridge": {
        drop: 0.8,
        type: "solid_state",
        regulation: 0.98,
        description: "Mostek Schottky'ego",
        guitar_character: "Bardzo sztywny, ultra-modern",
        max_current: 500
    },

    // === LAMPY PROSTOWNICZE ===
    "GZ34 / 5AR4": {
        drop: 17,
        type: "tube",
        regulation: 0.85,
        description: "Klasyczna lampa prostownicza",
        guitar_character: "Sag, vintage feel, kompresja",
        max_current: 225,
        warm_up_time: 30 // sekundy
    },

    "5U4G": {
        drop: 44,
        type: "tube",
        regulation: 0.75,
        description: "Duży sag, vintage",
        guitar_character: "Bardzo spongy, vintage compression",
        max_current: 175,
        warm_up_time: 45
    },

    "5Y3": {
        drop: 60,
        type: "tube",
        regulation: 0.70,
        description: "Ekstremalny sag",
        guitar_character: "Extreme vintage sag, bluesy",
        max_current: 125,
        warm_up_time: 30
    },

    "5R4": {
        drop: 67,
        type: "tube",
        regulation: 0.68,
        description: "Bardzo duży sag",
        guitar_character: "Massive sag, vintage feel",
        max_current: 150,
        warm_up_time: 60
    },

    "274B": {
        drop: 50,
        type: "tube",
        regulation: 0.72,
        description: "Mesh plate rectifier",
        guitar_character: "Smooth sag, audiophile",
        max_current: 85,
        warm_up_time: 120
    },

    "5Z3": {
        drop: 45,
        type: "tube",
        regulation: 0.76,
        description: "Średni sag, uniwersalny",
        guitar_character: "Balanced vintage character",
        max_current: 100,
        warm_up_time: 45
    },

    "83": {
        drop: 22,
        type: "tube",
        regulation: 0.82,
        description: "Mercury vapor (historyczny)",
        guitar_character: "Tight vintage, rzadki",
        max_current: 250,
        warm_up_time: 180
    },

    "5V4": {
        drop: 25,
        type: "tube",
        regulation: 0.80,
        description: "Kompromis sag vs headroom",
        guitar_character: "Moderate sag, good balance",
        max_current: 175,
        warm_up_time: 30
    }
};

// ============================================
// ROZSZERZONA STRUKTURA SEKCJI
// ============================================
export const SECTION_TYPES = {
    "A": {
        label: "Anody lamp mocy (B+)",
        priority: 1,
        typical_voltage: 400,
        defaultLoad: {
            type: "power",
            tubes: "EL34",
            config: "Push-Pull",
            dcr: 100
        },
        description: "Główne zasilanie anod lamp wyjściowych"
    },

    "B": {
        label: "Siatki G2 lamp mocy",
        priority: 2,
        typical_voltage: 350,
        defaultLoad: {
            type: "g2",
            tubes: "EL34",
            config: "Push-Pull",
            resistor: 470
        },
        description: "Zasilanie siatek ekranujących"
    },

    "C": {
        label: "Inverter fazowy",
        priority: 3,
        typical_voltage: 320,
        defaultLoad: {
            type: "inverter",
            inverterType: "Long-tail pair",
            Ra: 100000
        },
        description: "Zasilanie inwertera fazowego"
    },

    "D": {
        label: "Preamp - Input & Gain stages",
        priority: 4,
        typical_voltage: 300,
        defaultLoad: {
            type: "preamp",
            tubes: "12AX7",
            count: 2,
            Ra: 100000,
            separateRa: false
        },
        description: "Pierwsze stopnie przedwzmacniacza"
    },

    "E": {
        label: "Preamp - Tone stack & Effects",
        priority: 5,
        typical_voltage: 280,
        defaultLoad: {
            type: "preamp",
            tubes: "12AX7",
            count: 1,
            Ra: 100000
        },
        description: "Tone stack driver, efekty"
    },

    "F": {
        label: "Negative supply",
        priority: 6,
        typical_voltage: -45,
        defaultLoad: {
            type: "bias",
            description: "Bias supply dla lamp mocy"
        },
        description: "Ujemne zasilanie bias"
    }
};

// ============================================
// STARE DEFINICJE (kompatybilność wsteczna)
// ============================================
export const POWER_STAGES = {
    Brak: { Ia: 0, Ig2: 0 },
    "EL34 PP": { Ia: 80, Ig2: 10 },
    "6L6GC PP": { Ia: 70, Ig2: 8 },
    "EL84 PP": { Ia: 60, Ig2: 9 },
    "6V6 SE": { Ia: 45, Ig2: 5 },
    "KT88 PP": { Ia: 100, Ig2: 12 },
    "300B SE": { Ia: 60, Ig2: 0 }
};

// ============================================
// DODATKOWE STAŁE DLA GITAROWYCH ZASTOSOWAŃ
// ============================================

// Typowe wartości rezystorów dla gitarowych wzmacniaczy
export const GUITAR_RESISTOR_VALUES = {
    plate_resistors: [22000, 47000, 68000, 100000, 220000],
    cathode_resistors: [820, 1000, 1500, 2200, 2700],
    grid_stoppers: [470, 1000, 2200, 5600],
    screen_resistors: [470, 1000, 1500, 2200]
};

// Typowe pojemności kondensatorów
export const GUITAR_CAPACITOR_VALUES = {
    filter_caps: [10, 22, 47, 68, 100, 220, 470],  // µF
    coupling_caps: [0.022, 0.047, 0.1, 0.22, 0.47], // µF
    cathode_bypass: [22, 25, 47, 100, 220] // µF
};

// Charakterystyki brzmieniowe stylów
export const GUITAR_TONE_STYLES = {
    "Vintage British": {
        tubes: ["EL34", "KT66", "EL84"],
        rectifier: "GZ34 / 5AR4",
        target_sag: 15,
        character: "Warm, compressed, rock"
    },

    "American Clean": {
        tubes: ["6L6GC", "6V6GT"],
        rectifier: "Silicon Bridge",
        target_sag: 8,
        character: "Clean, punchy, headroom"
    },

    "Modern High-Gain": {
        tubes: ["KT120", "KT150", "6550"],
        rectifier: "Silicon Bridge",
        target_sag: 5,
        character: "Tight, aggressive, metal"
    },

    "Vintage SE": {
        tubes: ["300B", "2A3", "45"],
        rectifier: "5Y3",
        target_sag: 20,
        character: "Sweet, harmonic, low power"
    }
};

// ============================================
// PREDEFINIOWANE KONFIGURACJE GITAROWYCH WZMACNIACZY
// ============================================
export const GUITAR_AMP_PRESETS = {
    "Marshall Plexi 50W": {
        power_tube: "EL34",
        power_config: "Push-Pull",
        preamp_tubes: ["12AX7", "12AX7", "12AT7"],
        rectifier: "GZ34 / 5AR4",
        vac: 350,
        expected_power: 50,
        tone_character: "Classic British rock",
        famous_users: ["Hendrix", "Page", "Clapton"]
    },

    "Fender Twin Reverb": {
        power_tube: "6L6GC",
        power_config: "Push-Pull",
        preamp_tubes: ["12AX7", "12AX7", "12AT7", "12AU7"],
        rectifier: "Silicon Bridge",
        vac: 350,
        expected_power: 85,
        tone_character: "Clean American tone",
        famous_users: ["SRV", "Knopfler", "Gilmour"]
    },

    "Vox AC30": {
        power_tube: "EL84",
        power_config: "Push-Pull",
        preamp_tubes: ["EF86", "12AX7", "12AX7"],
        rectifier: "GZ34 / 5AR4",
        vac: 280,
        expected_power: 30,
        tone_character: "British chime and jangle",
        famous_users: ["Brian May", "The Edge", "Johnny Marr"]
    },

    "Fender Princeton Reverb": {
        power_tube: "6V6GT",
        power_config: "Single-Ended",
        preamp_tubes: ["12AX7", "12AX7", "12AT7"],
        rectifier: "5Y3",
        vac: 320,
        expected_power: 12,
        tone_character: "Sweet vintage breakup",
        famous_users: ["BB King", "Larry Carlton"]
    },

    "Marshall JCM800": {
        power_tube: "EL34",
        power_config: "Push-Pull",
        preamp_tubes: ["12AX7", "12AX7", "12AX7", "12AT7"],
        rectifier: "Silicon Bridge",
        vac: 350,
        expected_power: 100,
        tone_character: "High-gain British rock",
        famous_users: ["Slash", "Zakk Wylde", "Angus Young"]
    },

    "Mesa Boogie Rectifier": {
        power_tube: "6L6GC",
        power_config: "Push-Pull",
        preamp_tubes: ["12AX7", "12AX7", "12AX7", "12AX7"],
        rectifier: "Silicon Bridge",
        vac: 400,
        expected_power: 100,
        tone_character: "Modern high-gain",
        famous_users: ["Hetfield", "Petrucci", "7-string metal"]
    },

    "Orange OR50": {
        power_tube: "EL34",
        power_config: "Push-Pull",
        preamp_tubes: ["12AX7", "12AX7", "12AT7"],
        rectifier: "GZ34 / 5AR4",
        vac: 350,
        expected_power: 50,
        tone_character: "Thick British midrange",
        famous_users: ["Jimmy Page", "Doom/Stoner rock"]
    },

    "Supro Delta King": {
        power_tube: "6V6GT",
        power_config: "Push-Pull",
        preamp_tubes: ["12AX7", "12AX7"],
        rectifier: "5Y3",
        vac: 320,
        expected_power: 10,
        tone_character: "Vintage American blues",
        famous_users: ["Jimmy Page studio", "Joe Bonamassa"]
    }
};

// ============================================
// TABELE KONWERSJI I WSPÓŁCZYNNIKÓW
// ============================================

// Współczynniki korekcji dla różnych klas pracy
export const OPERATING_CLASS_FACTORS = {
    "A": {
        idle_current_factor: 1.0,
        efficiency: 0.25,
        thd_factor: 1.5,
        description: "Klasa A - lampa przewodzi przez cały cykl"
    },
    "AB": {
        idle_current_factor: 0.7,
        efficiency: 0.65,
        thd_factor: 1.0,
        description: "Klasa AB - kompromis wydajność/jakość"
    },
    "B": {
        idle_current_factor: 0.1,
        efficiency: 0.78,
        thd_factor: 2.0,
        description: "Klasa B - każda lampa przewodzi pół cyklu"
    }
};

// Czynniki korekcji temperatury dla lamp
export const TEMPERATURE_FACTORS = {
    cold: 0.8,    // Zimne lampy
    warm: 1.0,    // Normalna temperatura pracy
    hot: 1.15     // Gorące lampy (po długiej grze)
};

// Faktory starzenia się lamp
export const TUBE_AGING_FACTORS = {
    new: 1.0,           // Nowe lampy
    broken_in: 1.05,    // Po wgraniu (100h)
    seasoned: 0.95,     // Doświadczone (1000h)
    worn: 0.85,         // Zużyte (5000h)
    dying: 0.7          // Umierające (10000h+)
};

// ============================================
// WALIDACJA I BEZPIECZEŃSTWO
// ============================================

// Maksymalne bezpieczne wartości
export const SAFETY_LIMITS = {
    max_plate_voltage: {
        "12AX7": 300,
        "12AT7": 300,
        "12AU7": 300,
        "EL34": 500,
        "6L6GC": 500,
        "EL84": 400,
        "6V6GT": 450,
        "KT88": 600,
        "300B": 450
    },

    max_plate_dissipation: {
        "12AX7": 1.0,   // W
        "12AT7": 2.5,
        "12AU7": 2.75,
        "EL34": 25,
        "6L6GC": 30,
        "EL84": 12,
        "6V6GT": 14,
        "KT88": 42,
        "300B": 40
    },

    recommended_bias_range: {
        "EL34": { min: -45, max: -35 },      // mV bias voltage
        "6L6GC": { min: -52, max: -42 },
        "EL84": { min: -12.5, max: -7.5 },
        "6V6GT": { min: -20, max: -12 },
        "KT88": { min: -60, max: -45 }
    }
};

// Ostrzeżenia dla projektantów
export const DESIGN_WARNINGS = {
    high_voltage: "Napięcie powyżej 400V - zachowaj ostrożność!",
    tube_overdissipation: "Moc na anodzie przekracza bezpieczne limity!",
    insufficient_filtering: "Tętnienia powyżej 5mV mogą być słyszalne",
    excessive_sag: "Sag powyżej 25V może wpłynąć na stabilność",
    bias_drift: "Sprawdź stabilność bias przy różnych temperaturach"
};

// ============================================
// FUNKCJE POMOCNICZE EKSPORTOWANE
// ============================================

/**
 * Sprawdź czy lampa jest odpowiednia do danego zastosowania
 */
export const isValidTubeForApplication = (tubeName, application) => {
    const tube = POWER_TUBES[tubeName] || PREAMP_TUBES[tubeName];
    if (!tube) return false;

    const validApplications = {
        "guitar_preamp": ["12AX7", "12AT7", "12AU7", "12AY7", "EF86"],
        "guitar_power": ["EL34", "6L6GC", "EL84", "6V6GT", "KT88"],
        "hifi_preamp": ["12AU7", "6SN7", "6DJ8", "6922"],
        "hifi_power": ["300B", "2A3", "KT88", "6550"]
    };

    return validApplications[application]?.includes(tubeName) || false;
};

/**
 * Pobierz rekomendowane napięcie zasilania dla konfiguracji
 */
export const getRecommendedSupplyVoltage = (powerTube, config, targetPower) => {
    const tube = POWER_TUBES[powerTube];
    if (!tube) return 350; // Default

    const powerConfig = POWER_CONFIGS[config];
    const baseVoltage = tube.Va_typical;

    // Dodaj zapas 15% + spadek na prostowniku
    const headroomFactor = 1.15;
    const rectifierDrop = 20; // Średni spadek

    return Math.ceil((baseVoltage * headroomFactor + rectifierDrop) / 10) * 10;
};

/**
 * Oblicz przewidywaną moc wyjściową
 */
export const estimateOutputPower = (powerTube, config, supplyVoltage) => {
    const tube = POWER_TUBES[powerTube];
    const powerConfig = POWER_CONFIGS[config];

    if (!tube || !powerConfig) return 0;

    const Va_operating = supplyVoltage * 0.85; // 85% po spadkach
    const Ia_rms = tube.Ia * powerConfig.multiplier * 0.7; // RMS current

    // Uproszczona formuła mocy
    const estimatedPower = (Va_operating * Ia_rms / 1000) * powerConfig.efficiency;

    return Math.round(estimatedPower);
};

// ============================================
// EXPORT GŁÓWNYCH OBIEKTÓW
// ============================================
export default {
    POWER_TUBES,
    PREAMP_TUBES,
    INVERTER_TYPES,
    POWER_CONFIGS,
    RECTIFIERS,
    SECTION_TYPES,
    POWER_STAGES,
    GUITAR_TONE_STYLES,
    GUITAR_AMP_PRESETS,
    SAFETY_LIMITS,
    isValidTubeForApplication,
    getRecommendedSupplyVoltage,
    estimateOutputPower
};