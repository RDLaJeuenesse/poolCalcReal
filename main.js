//constant declarations
//change in pool size can be made to poolVolume
const poolVolume = 35000;
const galsPerCubicFoot = 7.5;
const divGalsBy = 10000;
const poolFactor = poolVolume/divGalsBy;
//perfect test results
const idealResults = {
    'freeChlorine': 5,
    'combinedChlorine': 0,
    'pH': 7.4,
    'totalAlkalinity': 110,
    'calciumHardness': 300,
    'cyanuricAcid': 40
};
//This object contains the names of the curren chemicals being used
const currentChemicalList = {
    chlorineIncrease : "",
    chlorineDecrease : "",
    pHIncrease : "",
    phDecrease : "",
    alkalinityIncrease : "",
    alkalinityDecrease : "",
    calciumIncrease : "",
    cyanuricAcidIncrease: ""
}
//chemicals and amounts to change water chem by the given ppm
const chemicalDosageGuide = {
    //increase chlorine
    //RICHARD:: check to see what we use "refresh"
    calciumHypochlorite: {
        divUnit: 16,
        unit: 'oz',
        ppmChange: 1,
        amountNeeded: 2
    },
    //increase total alkalinity
    sodiumBicarboate: {
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: 1.5
    },
    //decrease total ph
    muriaticAcid: {
        divUnit: 128,
        unit: 'flOz',
        ppmChange: 10,
        amountNeeded: 26
    },
    //increase calcium hardness......RICHARD:: CHECK TO SEE IF WE ARE USING 77% OR 100% THIS IS BASED ON 100%
    calciumChloride: {
        divUnit: 1,
        unit: 'lb',
        ppmChange: 10,
        amountNeeded: .9
    },
    //increase stabalizer (cyanuric acid)
    cyanuricAcid: {
        divUnit: 16,
        unit: 'oz',
        ppmChange: 10,
        amountNeeded: 13
    },
    //neutralize chlorine
    sodiumThiosulfate: {
        divUnit: 16,
        unit: 'oz',
        ppmChange: 1,
        amountNeeded: 2.6
    }
};
//activate results button
let btnResults = document.getElementById('results');
//rounds all results to 2 decimal places
function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
//results array is global so we can see all results without accessing the actual test functions
let resultsArray = [];
//determines combined chlorine and determines the need for breakPoint()
function chlorineTest(a, b) {
    let free = Number(a.value);
    let total = Number(b.value);
    let combined = round(total - free, 2);
    free >= 0 && free < 3 ? freeChlorineLow(free) : reduceChlorine(free);
    if(combined > 0){
        console.log("You have nasty chlorimines in the water. Time for a breakpoint chlorination!");
        breakPoint(combined, free);
    }
/*  let addFree = 0;
    let addBreak = 0;
    let reduceChlorineAmount = 0; 
     switch(free){
        case 0:
        case 1:
        case 2:
        freeChlorineLow(free);
        break;
        case 3:
        break;
        default:
        reduceChlorine(free);
    }
    switch(combined){
        case 0:
        break;
        default:
        addBreak = breakPoint(combined, free);
        break;
    } */
}
//calculates the amount of chemical need for breakpoint chlorination
function breakPoint(a, b) {
    let breakPointChlorination = a * 10;
    let chemChange = round(breakPointChlorination - b, 2);
    let addAmountBreakpoint = round((chemicalDosageGuide.calciumHypochlorite.amountNeeded * poolFactor* chemChange),2);
    return addAmountBreakpoint;
}
function freeChlorineLow(a){
    console.log("You need chlorine!");
    let chemChange = idealResults.freeChlorine - a;
    let addAmountLow = round((poolFactor*(chemChange/chemicalDosageGuide.calciumHypochlorite.ppmChange)*chemicalDosageGuide.calciumHypochlorite.amountNeeded),2);
    console.log("This is the amount of chlorine to add: "+addAmountLow);
    return addAmountLow;
}
function reduceChlorine(a){
    let chemChange = a - idealResults.freeChlorine;
    let addAmountHigh = round((poolFactor*(chemChange/chemicalDosageGuide.sodiumThiosulfate.ppmChange)*chemicalDosageGuide.sodiumThiosulfate.amountNeeded),2);
    console.log('You are over chlorinated.')
    console.log("This is the amount of chlorine reducer to add: "+addAmountHigh);
    resultsArray.push('Reduce chlorine with '+addAmountHigh+' oz.');
    return addAmountHigh;
}
//checks pH and determines the proper course of action
function pH(a) {
    if (a.value <= 7.6 && a.value >= 7.2) {
        document.getElementById('pH').value = a.value;
        console.log("The pH is fine: "+ a.value);
    }
    else if(a.value < 7.2){
        console.log('pH is low '+a.value);
    }else{
        console.log("pH is high: "+a.value);
        let addAmount = round(poolFactor*(( a.value - idealResults.pH)/chemicalDosageGuide.muriaticAcid.ppmChange)*chemicalDosageGuide.muriaticAcid.amountNeeded,2);
        console.log("Add amount: "+addAmount);
    }
}
function calciumHardness(a) {
    if (a.value <= 400 && a.value >= 200) {
        document.getElementById('calcium').value = a.value;
        document.getElementById('calcium').classList.remove('needsWork');
    } else {
        console.log("Calcium is out of range.");

    }
}
function totalAlkalinity(a) {
    if (a.value <= 140 && a.value >= 110) {
        resultsArray.push(a.value);
        console.log("Alkalintiy is good: "+a.value);
    } else if(a.value > 140){
        //decrease alkalintiy
        console.log('alkalinity high check pH and work from there.'+a.value);
        resultsArray.push(a.value);
    }else{
        //increase alkalintiy
        console.log('alkalinity is low '+a.value);
        let addAmount = round(poolFactor*((idealResults.totalAlkalinity - a.value)/chemicalDosageGuide.sodiumBicarboate.ppmChange)*chemicalDosageGuide.sodiumBicarboate.amountNeeded,2);
        console.log("To increase alkalinity add: "+a.value);
    };
}
function cyanuricAcid(a) {
    if (a.value <= 50 && a.value >= 25) {
        document.getElementById('cynAcid').value = a.value;
        document.getElementById('cynAcid').classList.remove('needsWork');
    } else {
        console.log("Stabalizer is out of bounds.");
    };
}
function checkInputs() {
    let testInputs = Array.from(document.querySelectorAll('input'));
    testInputs.forEach(function (testInput) {
        let checkValue = Number(testInput.value);
        if (Number.isNaN(checkValue)) {
            alert('Only numbers should be entered!');
        }
        return;
    });
    return testInputs;
}
//calls checkInputs() depending on response runs all the associated chemical tests or issues an error this is called by pushing the results button
function runTests() {
    let testInputs = checkInputs();
    console.log("Here are the inputs");
    console.log(testInputs);
    chlorineTest(testInputs[0], testInputs[1]);
    //testInputs[2] is the calculated combinedChlorine
    pH(testInputs[3]);
    totalAlkalinity(testInputs[4]);
    cyanuricAcid(testInputs[5]);
    calciumHardness(testInputs[6]);
    //resultsMessage(testInputs);
}
//this event listener updates the cobined chlorine total before the inputs array has been created
document.getElementById('total').addEventListener('blur', function () {
    document.getElementById('combined').value = document.getElementById('total').value - document.getElementById('free').value;
});
btnResults.addEventListener('click', function () {
    runTests();
})

console.log("I'm Live!");


/**
 * Standard chemical dosage equation
 * *****INCREASE CHEMICAL
 * PoolFactor*((ideal - current) / ppmChange)*amountNeeded
 * 
 */
