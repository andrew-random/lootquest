/**
	TODO:
	- find out why multiple placeItems are called on some drops
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
 	maxUnplacedLoot	: 4,

	initialize: function () {

		// init entity registry
		this.registry.initialize();

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
		var fieldModel		= this.getField();
		var environment 	= new game.ModelEnvironment();

		var totalLoot 		= fieldModel.itemCollection.filter(function (itemModel) {
			return itemModel.hasTilePos();
		}).length;
		var totalPossibleLoot = 25;
		var maxLoot = rand(1, 5);
		for (var x = 0; x <= maxLoot; x++) {

			if (totalLoot == totalPossibleLoot) {
				console.log('Board is full.');
				continue;
			}
			totalLoot++;

			var randomItem = environment.getRandomLoot();
			fieldModel.itemCollection.push(randomItem);
			fieldModel.placeInRandomTile(randomItem);			

			// notify views
			fieldModel.trigger("newLoot", randomItem, this);
		}
		fieldModel.trigger("adventureComplete", null, this);
	},

	getUser: function () {
		return this.userModel;
	},

	getField: function () {
		return this.fieldModel;
	},

	getRegistry: function () {
		return this.registry;
	},

}