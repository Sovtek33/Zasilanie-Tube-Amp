/*  presets.js — Presety zasilaczy
 *  (c) 2025 Wiœnia / PSU Designer
 *  ------------------------------------------------- */

/* -------- PRESETY ZASILACZY -------- */
export const PSU_PRESETS = {
    "Fender Twin Reverb": {
        description: "Klasyczny zasilacz Twin Reverb - solidny i niezawodny",
        category: "Fender",
        vac: 325, rectifier: "Silicon Bridge", triodes: 4, powerStage: "6L6GC PP",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 1000, C: 47 },
            { name: "C", R: 4700, C: 22 },
            { name: "D", R: 100000, C: 22 }
        ]
    },
    "Fender Deluxe Reverb": {
        description: "Kultowy combo 22W - ciep³y, dynamiczny ton",
        category: "Fender",
        vac: 325, rectifier: "GZ34 / 5AR4", triodes: 3, powerStage: "6V6 SE",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 1500, C: 47 },
            { name: "C", R: 10000, C: 22 },
            { name: "D", R: 47000, C: 22 }
        ]
    },
    "Fender Princeton Reverb": {
        description: "Ma³y combo z wielkim charakterem - idea³ do studia",
        category: "Fender",
        vac: 300, rectifier: "GZ34 / 5AR4", triodes: 3, powerStage: "6V6 SE",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 2200, C: 47 },
            { name: "C", R: 15000, C: 22 },
            { name: "D", R: 68000, C: 22 }
        ]
    },
    "Marshall JCM800": {
        description: "Legendarny British Rock Sound - agresywny i przebojowy",
        category: "Marshall",
        vac: 340, rectifier: "Silicon Bridge", triodes: 6, powerStage: "EL34 PP",
        stages: [
            { name: "A", R: 0, C: 100 },
            { name: "B", R: 1000, C: 47 },
            { name: "C", R: 10000, C: 22 },
            { name: "D", R: 47000, C: 22 }
        ]
    },
    "Marshall JTM45": {
        description: "Vintage Marshall z lat 60. - ciep³y crunch",
        category: "Marshall",
        vac: 325, rectifier: "GZ34 / 5AR4", triodes: 4, powerStage: "EL34 PP",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 1500, C: 47 },
            { name: "C", R: 22000, C: 16 },
            { name: "D", R: 100000, C: 16 }
        ]
    },
    "Marshall JCM900": {
        description: "90s British Metal - precyzyjny, mocny drive",
        category: "Marshall",
        vac: 350, rectifier: "Silicon Bridge", triodes: 7, powerStage: "EL34 PP",
        stages: [
            { name: "A", R: 0, C: 100 },
            { name: "B", R: 470, C: 100 },
            { name: "C", R: 4700, C: 47 },
            { name: "D", R: 22000, C: 22 }
        ]
    },
    "Vox AC30": {
        description: "Brytyjski klasyk - charakterystyczne EL84 w klasie A",
        category: "Vox",
        vac: 340, rectifier: "GZ34 / 5AR4", triodes: 5, powerStage: "EL84 PP",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 1000, C: 47 },
            { name: "C", R: 10000, C: 32 },
            { name: "D", R: 68000, C: 16 }
        ]
    },
    "Vox AC15": {
        description: "Mniejszy brat AC30 - œwietny kompromis mocy i brzmienia",
        category: "Vox",
        vac: 320, rectifier: "GZ34 / 5AR4", triodes: 4, powerStage: "EL84 PP",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 1500, C: 47 },
            { name: "C", R: 15000, C: 22 },
            { name: "D", R: 100000, C: 16 }
        ]
    },
    "Williamson Amplifier": {
        description: "Klasyczny hi-fi design - ultra-niska zniekszta³cenia",
        category: "Hi-Fi",
        vac: 350, rectifier: "5U4G", triodes: 2, powerStage: "EL34 PP",
        stages: [
            { name: "A", R: 0, C: 100 },
            { name: "B", R: 470, C: 100 },
            { name: "C", R: 4700, C: 47 },
            { name: "D", R: 47000, C: 22 }
        ]
    },
    "Quad II": {
        description: "Legendarny brytyjski hi-fi - muzyczna precyzja",
        category: "Hi-Fi",
        vac: 330, rectifier: "GZ34 / 5AR4", triodes: 2, powerStage: "EL34 PP",
        stages: [
            { name: "A", R: 0, C: 100 },
            { name: "B", R: 1000, C: 100 },
            { name: "C", R: 10000, C: 47 },
            { name: "D", R: 100000, C: 22 }
        ]
    },
    "Dumble Style": {
        description: "Inspirowany Dumble - smooth overdrive, kompresja",
        category: "Boutique",
        vac: 330, rectifier: "Silicon Bridge", triodes: 6, powerStage: "6L6GC PP",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 2200, C: 47 },
            { name: "C", R: 15000, C: 22 },
            { name: "D", R: 68000, C: 22 }
        ]
    },
    "Matchless DC30": {
        description: "Boutique Class A - ciep³y, kompresyjny charakter",
        category: "Boutique",
        vac: 340, rectifier: "GZ34 / 5AR4", triodes: 5, powerStage: "EL84 PP",
        stages: [
            { name: "A", R: 0, C: 47 },
            { name: "B", R: 1200, C: 47 },
            { name: "C", R: 12000, C: 32 },
            { name: "D", R: 82000, C: 16 }
        ]
    },
    "Modern High Gain": {
        description: "Wspó³czesny metal/rock - wysokie napiêcia, stabilnoœæ",
        category: "Modern",
        vac: 380, rectifier: "Silicon Bridge", triodes: 8, powerStage: "EL34 PP",
        stages: [
            { name: "A", R: 0, C: 100 },
            { name: "B", R: 470, C: 100 },
            { name: "C", R: 2200, C: 47 },
            { name: "D", R: 10000, C: 47 },
            { name: "E", R: 47000, C: 22 }
        ]
    },
    "Mesa Boogie Style": {
        description: "Californian High Gain - tight, precyzyjny metal tone",
        category: "Modern",
        vac: 385,
        rectifier: "Silicon Bridge",
        triodes: 7,
        powerStage: "6L6GC PP",
        stages: [
            { name: "A", R: 0, C: 100 },
            { name: "B", R: 680, C: 100 },
            { name: "C", R: 3300, C: 47 },
            { name: "D", R: 15000, C: 33 },
            { name: "E", R: 68000, C: 22 },
        ],
    },
};