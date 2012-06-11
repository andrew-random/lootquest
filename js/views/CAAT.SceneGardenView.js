/*
	Class constants:
		TileWidth
		TileHeight
		TileMargin		
*/
game.CAAT.SceneGardenView = game.CAAT.SceneView.extend({

	initialize: function (options) {

		// events
		this.model.on('newLoot', this.newLoot, this);

		this.director = options.director;

		this.scene = new CAAT.Scene();
		this.scene.setFillStyle('#ccc');

		this.tileContainer = new CAAT.ActorContainer().
		  setBounds(30, 200, 580, 480).setFillStyle('green');
		this.scene.addChild(this.tileContainer);

		this.model.getTileCollection().each(function (tileModel) {
			var tileView = new game.CAAT.TileView({
				container 	: this.tileContainer, 
				model 		: tileModel
			});
			tileView.render();
			game.getRegistry().addEntity(game.ModelItem.EntityTypeTile, tileView);
		}, this);

		var adventureButton = new CAAT.ActorContainer().setBounds(500, 20, 100, 40).setFillStyle('#eee');
		adventureButton.mouseUp = function () {
		
			// adventure!
			game.adventureInEnvironment(new game.ModelEnvironment());

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

	newLoot: function (itemModel) {
		var itemView = new game.CAAT.ItemView({
				container 	: this.scene, 
				model 		: itemModel
		});
		itemView.render();
		game.getRegistry().addEntity(game.ModelItem.EntityTypeItem, itemView);
	},

	render: function() {
		return this;
	}

});

game.CAAT.SceneGardenView.tileWidth			= 100;
game.CAAT.SceneGardenView.tileHeight		= 80;
game.CAAT.SceneGardenView.tileMargin		= 20;