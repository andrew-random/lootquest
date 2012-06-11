game.ModelField = Backbone.Model.extend({

	tileCollection  : null,
 	lootCollection  : null,
 	totalTileWidth	: 5,		// number of x tiles in field
	totalTileHeight : 5,		// number of y tiles in field

	initialize: function (options) {

		this.initTileCollection();

		this.initItemCollection();

		return this;
	},

	initTileCollection: function () {
		
		this.tileCollection = new game.collectionTile();
		// todo: init models from local storage

		for (var y = 0; y <= (this.totalTileWidth - 1); y++) {
			
			var column = [];
			for (var x = 0; x <= (this.totalTileHeight - 1); x++ ) {

				var tileModel = new game.ModelTile();
				tileModel.setTilePos(x, y);
				
				this.tileCollection.push(tileModel);
				
			}
		}
	},

	getTileCollection: function () {
		return this.tileCollection;
	},

	initItemCollection: function () {
		this.itemCollection = new game.collectionItem();
		// todo: init models from local storage
	},

	placeItem: function (itemModel, posX, posY) {
		itemModel.setTilePos(posX, posY);
	},

	getItemByUniqueId: function (uniqueId) {
		return this.itemCollection.find(function (itemModel) {
			return itemModel.getUniqueId() == uniqueId;
		});
	},

	getTotalFieldDimensions: function () {
		return {x:this.totalTileWidth, y:this.totalTileHeight};
	}

});