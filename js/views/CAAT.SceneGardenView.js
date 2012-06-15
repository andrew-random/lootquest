/*
	Class constants:
		TileWidth
		TileHeight
		TileMargin		
*/
game.CAAT.SceneGardenView = game.CAAT.SceneView.extend({

	scene 		: null,
	gameStarted : false,

	initialize: function (options) {

		// fieldmodel events
		this.model.on('placeNewItem', this.placeNewItem, this);
		this.model.getItemCollection().on('add', this.addItemEntity, this);

		// hero collection events
		game.getHeroController().heroCollection.on('add', this.addHeroEntity, this);

		// director events
		this.on('gameStart', this.gameStart, this);



		this.scene = new CAAT.Scene();
		this.scene.setFillStyle('#ccc');

		this.tileContainer = new CAAT.ActorContainer().
		  setBounds(30, 100, 580, 480).
		  setFillStyle('green');

		this.scene.addChild(this.tileContainer);

		this.initTileEntities();

		this.initItemEntities();



		var adventureButton = new CAAT.ActorContainer().setBounds(500, 20, 100, 40).setFillStyle('#eee');
		adventureButton.mouseUp = function () {
			var hero = game.getHero()
			if (hero.canAdventure()) {
				// adventure!
				game.adventureInEnvironment(hero, new game.ModelEnvironment());
			}

			adventureCountDown.setText(hero.getAdventureCooldownSecondsRemaining());
		}

		var adventureLabel = new CAAT.TextActor().
	      setBounds(30, 15, 20, 20).
	      setTextAlign('center').
	      setTextFillStyle('#000').
	      setBaseline('top').
	      enableEvents(false).
	      setText('ADVENTURE');
	    adventureButton.addChild(adventureLabel);

	    var adventureCountDown = new CAAT.TextActor().
	      setBounds(27, 30, 20, 20).
	      setTextAlign('center').
	      setTextFillStyle('#333').
	      setBaseline('top').
	      enableEvents(false).
	      setText('Ready');
	    adventureButton.addChild(adventureCountDown);

		this.scene.addChild(adventureButton);
		
	},

	addItemEntity: function (itemModel) {
		// add existing items as entities
		var itemView = new game.CAAT.ItemView({
			container 	: this.scene, 
			model 		: itemModel
		});
		game.getRegistry().addEntity(game.EntityTypeItem, itemView);

		if (this.gameStarted) {
			itemView.trigger('entityReady');
		}
	},

	addHeroEntity: function (heroModel) {
		var heroView = new game.CAAT.HeroView({
			container 	: this.scene, 
			model 		: heroModel
		});
		game.getRegistry().addEntity(game.EntityTypeHero, heroView);

		if (this.gameStarted) {
			itemView.trigger('entityReady');
		}
	},

	initItemEntities: function () {
		// add all items as entities
		this.model.getItemCollection().each(function (itemModel) {
			this.addItemEntity(itemModel);
		}, this);
	},

	initTileEntities: function () {

		// add all tiles as entities
		this.model.getTileCollection().each(function (tileModel) {
			var tileView = new game.CAAT.TileView({
				container 	: this.tileContainer, 
				model 		: tileModel
			});
			game.getRegistry().addEntity(game.EntityTypeTile, tileView);
		}, this);

	},

	gameStart: function() {

		this.gameStarted = true;

		// render everything
		var entities = game.getRegistry().entities;
		
		// render tiles first
		var count = entities[game.EntityTypeTile].length;
		while (count--) {
			entities[game.EntityTypeTile][count].trigger('entityReady');
		}

		// render items second
		var count = entities[game.EntityTypeItem].length;
		while (count--) {
			entities[game.EntityTypeItem][count].trigger('entityReady');
		}

		// render heroes last
		var count = entities[game.EntityTypeHero].length;
		while (count--) {
			entities[game.EntityTypeHero][count].trigger('entityReady');
		}
		
		return this;
	}

});

game.CAAT.SceneGardenView.tileWidth			= 100;
game.CAAT.SceneGardenView.tileHeight		= 80;
game.CAAT.SceneGardenView.tileMargin		= 20;