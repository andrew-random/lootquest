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
	
 	userModel		: null,
 	maxUnplacedLoot	: 4,

	initialize: function () {

		// init entity registry
		this.registry.initialize();

		// todo: load user details from wherever
		this.userModel 	= new game.ModelUser();

		// todo: load gameData from local SQLite goodness
		this.fieldModel = new game.ModelField();

		// todo: load hero and companion data from DB
		this.characterController.initialize();

		this.adventureController.initialize();

		// todo: load user's known environments
		this.environmentController.initialize();

		// todo: load queued messengers
		this.messengerController.initialize();

		// todo: ajax fetch static data as necessary
		this.staticDataController.initialize();

		// init CAAT instance
		this.director = new game.CAAT.DirectorView({
				model 	: this.fieldModel, 
				el 		: $('canvas#gameView')
		});

		if (true) {
			this.initNewGame();
		}

		// trigger everything
		this.director.trigger('gameStart');
		
	},

	initNewGame: function () {

		// add default environments		
		var environmentModel = new game.ModelEnvironment();
		environmentModel.initNewEnvironment();
		this.getEnvironments().addEnvironment(environmentModel);

		var environmentModel = new game.ModelEnvironment();
		environmentModel.initNewEnvironment();
		this.getEnvironments().addEnvironment(environmentModel);

		var environmentModel = new game.ModelEnvironment();
		environmentModel.initNewEnvironment();
		this.getEnvironments().addEnvironment(environmentModel);


		// add default hero
		var heroThrone = game.getStaticData().getModel(game.ModelBase.ModelClassHeroHomeItem, 'throne', {quantity: 1});
		this.fieldModel.addItemModel(heroThrone);
		this.fieldModel.placeNewItem(heroThrone, 0, 0);

		var firstHero = new game.ModelHero();
		firstHero.initNew();

		// heroes are tied to a hero base item
		firstHero.setParentId(heroThrone.getUniqueId());

		// items are tied right back to the hero
		heroThrone.setHeroUniqueId(firstHero.getUniqueId());

		// add a hero to the user stack
		game.getCharacters().addHero(firstHero);


		// throw them some gold
		var gold = game.getStaticData().getModel(game.ModelBase.ModelClassItem, 'gold', {quantity: 50});
		
		this.fieldModel.addItemModel(gold);
		this.fieldModel.placeNewItem(gold, -1, 0);

		// add a companion tent
		var tent = game.getStaticData().getModel(game.ModelBase.ModelClassCompanionHomeItem, 'tent');
		
		this.fieldModel.addItemModel(tent);
		this.fieldModel.placeNewItem(tent, 1, 0);

	},

	getUser: function () {
		return this.userModel;
	},

	getDirector: function () {
		return this.director;
	},

	getField: function () {
		return this.fieldModel;
	},

	getRegistry: function () {
		return this.registry;
	},

	getCharacters: function () {
		return this.characterController;
	},

	getMessenger: function () {
		return this.messengerController;
	},

	getStaticData: function () {
		return this.staticDataController;
	},

	getAdventure: function () {
		return this.adventureController;
	},

	getEnvironments: function () {
		return this.environmentController;
	},

}

game.CAAT 				= [];
game.staticData 		= {};
game.EntityTypeTile		= 'tile';
game.EntityTypeItem		= 'item';
game.EntityTypeHero		= 'hero';
game.EntityTypeMessage 	= 'message';

game.screenWidth  		= 640;
game.screenHeight 		= 960;
