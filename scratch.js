//chemicals and amounts to change water chem by the given ppm
const chemicalDosageGuide = [
    //increase chlorine
    //RICHARD:: check to see what we use "refresh"
    calciumHypochlorite = {
        divUnit: 16,
        unit: 'oz',
        ppmChange: 1,
        amountNeeded: 2
    },
    //increase total alkalinity
    sodiumBicarboate = {
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: 1.5
    },
    //decrease total ph
    muriaticAcid = {
        divUnit: 128,
        unit: 'flOz',
        ppmChange: 10,
        amountNeeded: 26
    },
    //increase calcium hardness......RICHARD:: CHECK TO SEE IF WE ARE USING 77% OR 100% THIS IS BASED ON 100%
    calciumChloride = {
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: .9
    },
    //increase stabalizer (cyanuric acid)
    cyanuricAcid = {
        divUnit: 16,
        unit: 'oz',
        ppmChange: 10,
        amountNeeded: 13
    },
    //neutralize chlorine
    sodiumThiosulfate = {
        name: 'Sodium Thiosulfate',
        divUnit: 16,
        unit: 'oz',
        ppmChange: 1,
        amountNeeded: 2.6
    }
];