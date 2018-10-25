//constant declarations
//change in pool size can be made to poolGallons
const poolGallons = 26000;
const galsPerCubicFoot = 7.5;
const divGalsBy = 10000;
//perfect test results
const idealResults = {
    'freeChlorine': 3,
    'combinedChlorine': 0,
    'pH': 7.6,
    'totalAlkalinity': 110,
    'calciumHardness': 300,
    'cyanuricAcid': 40
};
//chemicals and amounts to change water chem by the given ppm
const chemicalGuide = {
    //increase chlorine
    //RICHARD:: check to see what we use "refresh"
    'calciumHypochlorite': {
        'name': 'Shockwave or Refresh',
        'divUnit': 16,
        'unit': 'oz',
        'ppmChange': 1,
        'amountNeeded': 2
    },
    //increase total alkalinity
    'sodiumBicarboate': {
        'name': 'Baking Soda',
        'divUnit': 1,
        'unit': 'lb',
        'ppmChange': 10,
        'amountNeeded': 1.4
    },
    //decrease total alkalinity
    'muriaticAcid': {
        'name': 'muriatic acid',
        'divUnit': 128,
        'unit': 'flOz',
        'ppmChange': 10,
        'amountNeeded': 26
    },
    //increase calcium hardness......RICHARD:: CHECK TO SEE IF WE ARE USING 77% OR 100% THIS IS BASED ON 100%
    'calciumChloride': {
        'name': 'Calcium Elevator',
        'divUnit': 1,
        'unit': 'lb',
        'ppmChange': 10,
        'amountNeeded': .9
    },
    //increase stabalizer (cyanuric acid)
    'cyanuricAcid': {
        'name': 'cyanuric acid',
        'divUnit': 16,
        'unit': 'oz',
        'ppmChange': 10,
        'amountNeeded': 13
    },
    //neutralize chlorine
    'sodiumThiosulfate': {
        'name': 'neutralizer',
        'divUnit': 16,
        'unit': 'oz',
        'ppmChange': 1,
        'amountNeeded': 2.6
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
    let addFree = 0;
    let addBreak = 0;
    let reduceChlorineAmount = 0;
    switch(free){
        case 0:
        case 1:
        case 2:
        addFree = freeChlorineLow(free);
        console.log("Cholorine is low.");
        break;
        case 3:
        break;
        default:
        console.log('you are over chlorinated');
        reduceChlorineAmount = reduceChlorine(free);
        console.log('add '+reduceChlorineAmount+' of Chlorine reducer.');
        resultsArray.push('Reduce chlorine with '+reduceChlorineAmount+' oz.');
    }
    switch(combined){
        case 0:
        break;
        default:
        addBreak = breakPoint(combined, free);
        document.getElementById('combined').classList.add('needsWork');
        break;
    }
    let amountToAdd = addFree + addBreak;
    if(amountToAdd > chemicalGuide.calciumHypochlorite.divUnit){
        amountToAdd = amountToAdd/chemicalGuide.calciumHypochlorite.divUnit;
        resultsArray.push(amountToAdd+' lbs. of '+chemicalGuide.calciumHypochlorite.name);
    }else{
        resultsArray.push(amountToAdd+' '+chemicalGuide.calciumHypochlorite.unit);
    };
    return;
}
//calculates the amount of chemical need for breakpoint chlorination
function breakPoint(combined, free) {
    let breakPointChlorination = combined * 10;
    let chemChange = round(breakPointChlorination - free, 2);
    let addAmountBreakpoint = round((chemicalGuide.calciumHypochlorite.amountNeeded * (poolGallons / 10000) * chemChange),2);
    return addAmountBreakpoint;
}
function freeChlorineLow(a){
    let chemChange = idealResults.freeChlorine - a;
    let addAmountLow = round((chemicalGuide.calciumHypochlorite.amountNeeded*(poolGallons / 10000)*chemChange),2);
    return addAmountLow;
}
function reduceChlorine(a){
    reduceChlorineAmount = (a - idealResults.freeChlorine) * 2.5;
    return reduceChlorineAmount;
}
//checks pH and determines the proper course of action
function pH(a) {
    if (a.value <= 7.6 && a.value >= 7.2) {
        document.getElementById('pH').value = a.value;
    }
    else {
        console.log("pH is out of range.");
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
        document.getElementById('alk').value = a.value;
        document.getElementById('alk').classList.remove('needsWork');
        resultsArray.push('The alkalinity level is fine.');
    } else if(a.value > 140){
        //decrease alkalintiy
        console.log('alkalinity high '+a.value);
    }else{
        //increase alkalintiy
        console.log('alkalinity is low '+a.value);
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

/*This is where we want to add the cards below the calculator
function resultsMessage(a) {
    document.getElementById('resultPage').append(resultsArray);
}

*/
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
    pH(testInputs[3]);
    calciumHardness(testInputs[4]);
    totalAlkalinity(testInputs[5]);
    cyanuricAcid(testInputs[6]);
    //resultsMessage(testInputs);
}
//this event listener updates the cobined chlorine total before the inputs array has been created
document.getElementById('total').addEventListener('blur', function () {
    document.getElementById('combined').value = document.getElementById('total').value - document.getElementById('free').value;
});
btnResults.addEventListener('click', function () {
    runTests();
    alert("Please check below for your results.");
})

console.log("I'm Live!");