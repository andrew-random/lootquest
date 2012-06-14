Backbone.setDomLibrary($); 

//CAAT.DEBUGAABB = true;
// desktop party
$(document).ready(function() {

    /*if ('ontouchstart' in window) {
        // do nothing
        return false;
    }*/
    
    // get this party started
    game.initialize();

});



function rand(min,max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
}

function getHash(length){
    var s= '';
    var randomchar=function(){
        var n= Math.floor(Math.random()*62);
        if(n<10) return n; //1-10
        if(n<36) return String.fromCharCode(n+55); //A-Z
        return String.fromCharCode(n+61); //a-z
    }
    while(s.length< length) s+= randomchar();
    return s;
}

function formatSecondsRemaining(date) {
    var secondMultiplier = 1000;
    var minuteMultiplier = secondMultiplier * 60;
    var hourMultiplier = minuteMultiplier * 60;

    var hours = Math.floor(date / hourMultiplier);
    var remaining = date - hours * hourMultiplier;
    var minutes = Math.floor(remaining / minuteMultiplier);
    remaining = remaining - minutes * minuteMultiplier;
    var seconds = Math.floor(remaining / secondMultiplier);
    if (minutes < 10)
            minutes = "0" + minutes;
    if (seconds < 10)
            seconds = "0" + seconds;
    return hours + ":" + minutes + ":" + seconds;
}
function getWeightedRandom(data) {

    var totalWeight     = 0;
    var currentWeight   = 0;
    var count           = data.length;
   
    while (count--) {
        totalWeight += data[count].get('weight');
    }

    var random = Math.floor(rand(0, totalWeight));

    var count           = data.length;
    while (count--) {
        currentWeight += data[count].get('weight');
        if (random <= currentWeight) {
            return data[count];
        }
    }
}
