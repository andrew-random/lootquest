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

		// todo: load herodata from DB
		this.heroController.initialize();

		// todo: load gameData from local SQLite goodness
		this.fieldModel = new game.ModelField();

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

	adventureInEnvironment: function (heroModel, environmentModel) {
		var fieldModel		= this.getField();
		var environment 	= new game.ModelEnvironment();
		heroModel.setLastAdventureTime(new Date().getTime());

		var totalLoot 		= fieldModel.itemCollection.filter(function (itemModel) {
			return itemModel.hasTilePos();
		}).length;

		var totalPossibleLoot = 25;
		var maxLoot = rand(1, 3);
		for (var x = 0; x <= maxLoot; x++) {

			if (totalLoot == totalPossibleLoot) {
				console.log('Board is full.');
				continue;
			}
			totalLoot++;

			var randomItem = environment.getRandomLoot();
			fieldModel.addItemModel(randomItem);
			fieldModel.placeInRandomTile(randomItem);
		}

	},

	initNewGame: function () {

		var heroThrone = game.getStaticData().getModel(game.ModelBase.ModelClassHeroHomeItem, 'throne', {quantity: 1});
		this.fieldModel.addItemModel(heroThrone);
		this.fieldModel.placeNewItem(heroThrone, 0, 0);

		var firstHero = new game.ModelHero();

		// heroes are tied to a hero base item
		firstHero.setParentId(heroThrone.getUniqueId());

		// items are tied right back to the hero
		heroThrone.setHeroUniqueId(firstHero.getUniqueId());

		// add a hero to the user stack
		game.getHeroController().addHero(firstHero);


		// throw them some gold
		var gold = game.getStaticData().getModel(game.ModelBase.ModelClassItem, 'gold', {quantity: 100});
		
		this.fieldModel.addItemModel(gold);
		this.fieldModel.placeNewItem(gold, -1, 0);

		// throw them a sword
		var sword = new game.ModelItem({
				name:'Sword', 
				type: 'weapon',
				quantity:1,
				maxQuantity: 1,
				hasSprite:true
		});
		this.fieldModel.addItemModel(sword);
		this.fieldModel.placeNewItem(sword, 1, 0);

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

	//hack
	getHero: function () {
		return this.getHeroes().find(function () { 
			return true;
		});
	},

	getHeroController: function () {
		return this.heroController;
	},

	getHeroes: function () {
		return this.heroController.getHeroes();
	},

	getMessenger: function () {
		return this.messengerController;
	},

	getStaticData: function () {
		return this.staticDataController;
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
