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
		this.model.getItemCollection().on('remove', this.removeItemEntity, this);

		// hero collection events
		game.getHeroes().getHeroCollection().on('add', this.addHeroEntity, this);

		// messenger events
		game.getMessenger().getMessages().on('add', this.addMessageEntity, this);
		game.getMessenger().getMessages().on('remove', this.removeMessageEntity, this);

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

		// hero detail view ( pops up and hides as necessary )
		this.heroDetailView = new game.CAAT.HeroDetailView({
			container 	: this.scene
		});


		var adventureButton = new CAAT.ActorContainer().setBounds(500, 20, 100, 40).setFillStyle('#eee');
		adventureButton.mouseUp = function () {

			game.getAdventure().startNewAdventure();

		}

		var adventureLabel = new CAAT.TextActor().
	      setBounds(30, 15, 20, 20).
	      setTextAlign('center').
	      setTextFillStyle('#000').
	      setBaseline('top').
	      enableEvents(false).
	      setText('ADVENTURE');
	    adventureButton.addChild(adventureLabel);

		this.scene.addChild(adventureButton);
		
	},

	addItemEntity: function (model) {
		// add existing items as entities
		var entityView = new game.CAAT.ItemView({
			container 	: this.scene, 
			model 		: model
		});
		game.getRegistry().addEntity(game.EntityTypeItem, entityView);

		if (this.gameStarted) {
			entityView.trigger('entityReady');
		}
	},

	removeItemEntity: function (model) {
		game.getRegistry().removeEntityByUniqueId(model.getUniqueId(), game.ModelItem.EntityTypeItem);
	},

	addHeroEntity: function (model) {
		var entityView = new game.CAAT.HeroView({
			container 	: this.scene, 
			model 		: model
		});
		game.getRegistry().addEntity(game.EntityTypeHero, entityView);

		if (this.gameStarted) {
			entityView.trigger('entityReady');
		}
	},

	addMessageEntity: function (model) {
		var options = {
			container 	: this.scene, 
			model 		: model
		};

		if (model.getMessageType() == game.ModelMessage.MessageTypeInfo) {
			var entityView = new game.CAAT.MessageInfoView(options);
		} else {
			var entityView = new game.CAAT.MessagePopupView(options);
		}
		
		game.getRegistry().addEntity(game.EntityTypeMessage, entityView);

		if (this.gameStarted) {
			entityView.trigger('entityReady');
		}
	},

	removeMessageEntity: function (model) {
		game.getRegistry().removeEntityByUniqueId(model.getUniqueId(), game.ModelItem.EntityTypeMessage);
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
		
		// render tiles
		var count = entities[game.EntityTypeTile].length;
		while (count--) {
			entities[game.EntityTypeTile][count].trigger('entityReady');
		}

		// render items
		var count = entities[game.EntityTypeItem].length;
		while (count--) {
			entities[game.EntityTypeItem][count].trigger('entityReady');
		}

		// render heroes
		var count = entities[game.EntityTypeHero].length;
		while (count--) {
			entities[game.EntityTypeHero][count].trigger('entityReady');
		}

		// render messages
		var count = entities[game.EntityTypeMessage].length;
		while (count--) {
			entities[game.EntityTypeMessage][count].trigger('entityReady');
		} 
		
		return this;
	},

	getHeroDetailView: function () {
		return this.heroDetailView;
	}

});

game.CAAT.SceneGardenView.tileWidth			= 100;
game.CAAT.SceneGardenView.tileHeight		= 80;
game.CAAT.SceneGardenView.tileMargin		= 20;