function freeChlorineLow(a){
    console.log("You need chlorine!");
    let chemChange = idealResults.freeChlorine - a;
    let addAmountLow = round((poolFactor*(chemChange/chemicalDosageGuide[0].ppmChange)*chemicalDosageGuide[0].amountNeeded),2);
    console.log("This is the amount of chlorine to add: "+addAmountLow);
    return addAmountLow;
}
function reduceChlorine(a){
    let chemChange = a - idealResults.freeChlorine;
    let addAmountHigh = round((poolFactor*(chemChange/chemicalDosageGuide[5].ppmChange)*chemicalDosageGuide[5].amountNeeded),2);  
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
        let addAmount = round(poolFactor*((idealResults.totalAlkalinity - a.value)/chemicalDosageGuide[1].ppmChange)*chemicalDosageGuide[1].amountNeeded,2);
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
/* function checkInputs() {
    let testInputs = Array.from(document.querySelectorAll('input'));
    testInputs.forEach(function (testInput) {
        let checkValue = Number(testInput.value);
        if (Number.isNaN(checkValue)) {
            alert('Only numbers should be entered!');
        }
        return;
    });
    return testInputs;
} */