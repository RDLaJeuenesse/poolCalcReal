//constant declarations
//change in pool size can be made to poolVolume
const poolVolume = 26000;
const galsPerCubicFoot = 7.5;
const divGalsBy = 10000;
const poolFactor = poolVolume/divGalsBy;
//perfect test results
const idealResults = {
    'freeChlorine': 3,
    'combinedChlorine': 0,
    'pH': 7.4,
    'totalAlkalinity': 110,
    'calciumHardness': 300,
    'cyanuricAcid': 40
};
//chemicals and amounts to change water chem by the given ppm
const chemicalDosageGuide = [
    //increase chlorine
    {
        name: "Calcium Hypochlorite",
        divUnit: 16,
        unit: 'oz',
        ppmChange: 1,
        amountNeeded: 2
    },
    //increase total alkalinity
    {
        name: "Sodium Bicarbonate",
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: 1.5
    },
    //decrease total ph
    {
        name: "Muriatic Acid",
        divUnit: 128,
        unit: 'flOz',
        ppmChange: 10,
        amountNeeded: 26
    },
    //increase calcium hardness......RICHARD:: CHECK TO SEE IF WE ARE USING 77% OR 100% THIS IS BASED ON 100%
    {
        name: "Calcium Chloride",
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: .9
    },
    //increase stabalizer (cyanuric acid)
    {
        name: "Cyanuric Acid",
        divUnit: 16,
        unit: 'oz',
        ppmChange: 10,
        amountNeeded: 13
    },
    //neutralize chlorine
    {
        name: "Sodium Thiosulfate",
        divUnit: 16,
        unit: 'oz',
        ppmChange: 1,
        amountNeeded: 2.6
    }
];

//activate results button
let btnResults = document.getElementById('results');
//rounds all results to 2 decimal places
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
//results array is global so we can see all results without accessing the actual test functions
let resultsArray = [];





function chemAmount(a, b){
    let current = a;
    let currentLevel = b;
    
    console.log(current);
    console.log(currentLevel);
}



//Equation for amount of chemical to add
//let chemChange = idealResults.freeChlorine - a;
//let addAmountLow = round((poolFactor*(chemChange/chemicalDosageGuide[0].ppmChange)*chemicalDosageGuide[0].amountNeeded),2);

//determines combined chlorine and determines the need for breakPoint()
function chlorineTest(a, b) {
    let free = Number(a.value);
    let total = Number(b.value);
    let combined = round(total - free, 2);
    let currentLevel = "okay";
    if(free < 3 && combined === 0){
        currentLevel = "low";
        console.log(currentLevel);
        chemAmount(free, currentLevel);
    }else if(free > 3){
        console.log('Your chlorine is high!');
        chemAmount(free);
    }else if(combined > 0){
        console.log("You have nasty chlorimines in the water. Time for a breakpoint chlorination!");
        breakPoint(combined, free);
    }
}
//calculates the amount of chemical need for breakpoint chlorination
function breakPoint(a, b) {
    let breakPointChlorination = a * 10;
    let chemChange = round(breakPointChlorination - b, 2);
    let addAmountBreakpoint = round((chemicalDosageGuide[0].amountNeeded * poolFactor* chemChange),2);
    console.log(addAmountBreakpoint);
    return addAmountBreakpoint;
}











//runs all the associated chemical tests or issues an error this is called by pushing the results button
function runTests() {
    let testInputs = Array.from(document.querySelectorAll('input'));
    console.log("Here are the inputs");
    console.log(testInputs);
    chlorineTest(testInputs[0], testInputs[1]);
    //testInputs[2] is the calculated combinedChlorine
/*     pH(testInputs[3]);
    totalAlkalinity(testInputs[4]);
    cyanuricAcid(testInputs[5]);
    calciumHardness(testInputs[6]); */
    //resultsMessage(testInputs);
}
//this event listener updates the cobined chlorine total before the inputs array has been created
document.getElementById('total').addEventListener('blur', function () {
    document.getElementById('combined').value = document.getElementById('total').value - document.getElementById('free').value;
});
btnResults.addEventListener('click', function () {
    runTests();
})

console.log("Chemical Dosage Guide: ");
console.log(chemicalDosageGuide);

/**
 * Standard chemical dosage equation
 * *****INCREASE CHEMICAL
 * PoolFactor*((ideal - current) / ppmChange)*amountNeeded
 * 
 */
