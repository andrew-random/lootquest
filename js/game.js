/**
	TODO:

	- tiny view for each tile in the garden view
	- throw all the existing game.nonsense into the garden view
	- local storage?
	- local DB?
	- timers for each tile
	- individual animations for each tile
	- better CAAT prefix for every view, ever?
	- Heroes
	- Henchmen
	- Environments
	- Equipment Loot
	- Decorative Loot
	- Crafting Loot
	- ItemModel footprints ( L or X shaped items, etc.)

**/

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


var game = {

	CAAT 			: [],
 	userModel		: null,

	initialize: function () {

		// todo: load user details from wherever
		this.userModel = new game.ModelUser();

		// todo: load gameData from local SQLite goodness
		this.fieldModel = new game.ModelField();

		// init CAAT instance
		this.director = new game.CAAT.DirectorView({
				model 	: this.fieldModel, 
				el 		: $('canvas#gameView')
		});		

		// adventure!
		this.adventureInEnvironment(new game.ModelEnvironment());
		
	},

	adventureInEnvironment: function (environmentModel) {
		var environment = new game.ModelEnvironment();
		var maxLoot = rand(1, 5);
		for (var x = 0; x <= maxLoot; x++) {
			var randomItem = environment.getRandomLoot();
			this.fieldModel.itemCollection.push(randomItem);

			// notify views
			this.fieldModel.trigger("newLoot", randomItem, this);
		}
	},

	getUser: function () {
		return this.userModel;
	},

	getField: function () {
		return this.fieldModel;
	}

}