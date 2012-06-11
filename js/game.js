/**
	TODO:

	- tiny view for each tile in the garden view
	- local storage?
	- local DB?
	- timers for each tile
	- individual animations for each tile
	- Heroes
	- Henchmen
	- Environments
	- Equipment Loot
	- Decorative Loot
	- Crafting Loot
	- ItemModel footprints ( L or X shaped items, etc.)

**/

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
	},

	getRegistry: function () {
		return this.registry;
	}

}