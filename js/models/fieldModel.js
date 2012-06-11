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
				
				this.tileCollection.add(tileModel);
				
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

	canPlaceItem: function (itemModel, posX, posY) {
		var tileEntity = this.getTileByPos(posX, posY);
		return tileEntity.canPlaceItem(itemModel);
	},

	placeItem: function (itemModel, posX, posY) {
		// clear old tile
		if (itemModel.hasTilePos()) {
			var oldPos 			= itemModel.getTilePos();
			var oldTileModel 	= this.getTileByPos(oldPos.x, oldPos.y);
			if (oldTileModel.canRemoveItem(itemModel)) {
				oldTileModel.removeItem(itemModel);
			}
		}

		// move to new tile
		itemModel.setTilePos(posX, posY);
		
		var tileModel = this.getTileByPos(posX, posY);
		tileModel.placeItem(itemModel);

		//todo: save to local storage
	},

	getTileByPos: function (posX, posY) {
		return this.tileCollection.find(function (tileModel) {
			return tileModel.hasTilePos(posX, posY);
		});
	},

	getItemByUniqueId: function () {
		return this.itemCollection.find(function (itemModel) {
			return itemModel.get('uniqueId') == uniqueId;
		});
	},

	getTotalFieldDimensions: function () {
		return {x:this.totalTileWidth, y:this.totalTileHeight};
	},

	destroyItem: function (doomedItemModel) {
		// remove the view/entity
		game.getRegistry().removeEntityByUniqueId(doomedItemModel.get('uniqueId'));

		// remove the item model
		this.itemCollection.remove(doomedItemModel);
		
	}

});