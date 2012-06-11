/*
	Class constants:
		TileWidth
		TileHeight
		TileMargin		
*/
game.CAAT.SceneGardenView = game.CAAT.SceneView.extend({

	// constants are below
	tileActors		: [],
	itemActors		: [],

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
			var tileView = new game.CAAT.TileView({container:this.tileContainer, model:tileModel});
			tileView.render();
			this.tileActors.push(tileView);	
		}, this);
		
	},

	newLoot: function (itemModel) {
		var itemView = new game.CAAT.ItemView({container:this.scene, model:itemModel, tileActors:this.tileActors});
		itemView.render();
		this.itemActors.push(itemView);	
	},

	render: function() {
		return this;
	}

});

game.CAAT.SceneGardenView.tileWidth			= 100;
game.CAAT.SceneGardenView.tileHeight		= 80;
game.CAAT.SceneGardenView.tileMargin		= 20;