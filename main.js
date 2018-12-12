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
    'cyanuricAcid': 50
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
    //increase total pH
    {
        name: "Soda Ash",
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: 1,
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

/**
 * Standard chemical dosage equation
 * *****INCREASE CHEMICAL
 * PoolFactor*((ideal - current) / ppmChange)*amountNeeded
 * 
 */

 //chemAmount takes current, ideal, and chemDosageGuide[chemical]
function chemAmount(a, b, c){
    let dosage = Math.abs(round(poolFactor*((b - a) / c.ppmChange)*c.amountNeeded,2));
    console.log(c.name);
    console.log(dosage +' '+c.unit);
    resultsArray.push(dosage+' '+c.unit);
}

//determines combined chlorine and determines the need for breakPoint()
function chlorineTest(a, b) {
    let free = Number(a.value);
    let total = Number(b.value);
    let combined = round(total - free, 2);

    if(combined < 0){
        console.log("RETEST!");
    }
    combined > 0 ? breakPoint(combined, free) : chlorineCorrection(free);
}

function chlorineCorrection(free){
    if(free < idealResults.freeChlorine){
        chemAmount(free, idealResults.freeChlorine, chemicalDosageGuide[0]);
    }else if(free > idealResults.freeChlorine){
        chemAmount(free, idealResults.freeChlorine, chemicalDosageGuide[6]);
    }else{
        resultsArray.push("Chlorine is within range.");
        console.log("Chlorine is within range!");
    };
    return (chemAmount);
}
//calculates the amount of chemical need for breakpoint chlorination
function breakPoint(a, b) {
    console.log("Nasty, breakpoint needed!");
    let breakPointChlorination = a * 10;
    let chemChange = round(breakPointChlorination - b, 2);
    let addAmountBreakpoint = round((chemicalDosageGuide[0].amountNeeded * poolFactor* chemChange),2);
    console.log(addAmountBreakpoint + ' ' +chemicalDosageGuide[0].unit);
    resultsArray.push(addAmountBreakpoint);
    return addAmountBreakpoint;
}
//pH test
function pH(a) {
    let pH = a.value;
    if (pH <= 7.6 && pH >= 7.2) {
        console.log("pH is within range!");
        resultsArray.push("pH is within range.")
    }
    else if(pH < 7.2){
        chemAmount(pH, idealResults.pH, chemicalDosageGuide[3]);
    }else{
        console.log("pH is high: "+pH);
        chemAmount(pH, idealResults.pH, chemicalDosageGuide[2]);
    }
}
function totalAlkalinity(a) {
    let alk = a.value;
    if (alk <= 120 && alk >= 80) {
        resultsArray.push("Alkalintity is within range.");
        console.log("Alkalinity is within range!");
    }
    else if(alk < 80){
        chemAmount(alk, idealResults.totalAlkalinity, chemicalDosageGuide[1]);
    }else{
        console.log("Alkalinity is high: "+alk);
        chemAmount(alk, idealResults.totalAlkalinity, chemicalDosageGuide[2]);
    }
}
function cyanuricAcid(a) {
    let cyanuric = a.value;
    if (cyanuric <= 100 && cyanuric >= 50) {
        console.log("Cyanuric acid is within range!");
        resultsArray.push("Cyanuric acid is within range.");
    }
    else if(cyanuric < 100){
        chemAmount(cyanuric, idealResults.cyanuricAcid, chemicalDosageGuide[5]);
    }else{
        console.log("Cyanuric is high drain two feet of water and refill.");
        resultsArray.push("Cyanuric is high drain two feet of water and refill.");
    }
}
function calciumHardness(a) {
    let calcium = a.value;
    if (calcium <= 400 && calcium >= 150) {
        console.log("Calcium is within range!");
        resultsArray.push("Calcium is within range.");
    }
    else if(calcium < 150){
        chemAmount(calcium, idealResults.calciumHardness, chemicalDosageGuide[4]);
    }else{
        resultsArray.push("Calcium is high drain two feet of water and refill.");
        console.log("Calcium is high drain two feet of water and refill.");
    }
}

//runs all the associated chemical tests or issues an error this is called by pushing the results button
function runTests() {
    let testInputs = Array.from(document.querySelectorAll('input'));
    console.log("Here are the inputs");
    console.log(testInputs);
    chlorineTest(testInputs[0], testInputs[1]);
    //testInputs[2] is the calculated combinedChlorine
    pH(testInputs[3]);
    totalAlkalinity(testInputs[4]);
    cyanuricAcid(testInputs[5]);
    calciumHardness(testInputs[6]);
    console.log("Results Array: ");
    console.log(resultsArray);
    //resultsMessage(testInputs);
}
//this event listener updates the cobined chlorine total before the inputs array has been created
document.getElementById('total').addEventListener('blur', function () {
    document.getElementById('combined').value = document.getElementById('total').value - document.getElementById('free').value;
});
btnResults.addEventListener('click', function () {
    runTests();
})