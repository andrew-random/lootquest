Backbone.setDomLibrary($); 

//CAAT.DEBUGAABB = true;

// desktop party
$(document).ready(function() {

    if ('ontouchstart' in window) {
        // do nothing
        return false;
    }
    
    // get this party started
    game.initialize();

});

// mobile party
document.addEventListener('deviceready', function() {
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
