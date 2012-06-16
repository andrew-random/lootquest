game.ModelField = Backbone.Model.extend({

	initialize: function (options) {
		
		// todo: pull values from DB
		this.set('minTileWidth', -2);
		this.set('maxTileWidth', 2);
		this.set('minTileHeight', -2);
		this.set('maxTileHeight', 2);

		this.initTileCollection();

		this.initItemCollection();

		return this;
	},

	initTileCollection: function () {
		
		this.tileCollection = new game.collectionTile();
		// todo: init models from local storage

		for (var y = this.get('minTileWidth'); y <= this.get('maxTileHeight'); y++) {
			
			var column = [];
			for (var x = this.get('minTileHeight'); x <= this.get('maxTileHeight'); x++ ) {

				var tileModel = new game.ModelTile();
				tileModel.setTilePos(x, y);
				
				this.tileCollection.add(tileModel);
				
			}
		}
	},
	
	getItemCollection: function () {
		return this.itemCollection;
	},

	getTileCollection: function () {
		return this.tileCollection;
	},

	initItemCollection: function () {
		this.itemCollection = new game.collectionItem();
		// todo: init models from local storage
	},

	addItemModel: function (itemModel) {
		this.itemCollection.add(itemModel);
	},

	removeItemModel: function (doomedItemModel) {
		this.itemCollection.remove(doomedItemModel);
	},

	canPlaceNewItem: function (itemModel, posX, posY) {
		var tileEntity = this.getTileByPos(posX, posY);
		return tileEntity.canPlaceNewItem(itemModel);
	},

	placeNewItem: function (itemModel, posX, posY) {
		
		// clear old tile
		if (itemModel.hasTilePos()) {

			var oldPos 			= itemModel.getTilePos();
			var oldTileModel 	= this.getTileByPos(oldPos.x, oldPos.y);
			if (oldTileModel.canRemoveItemModel(itemModel)) {
				oldTileModel.removeItemModel(itemModel);
			}
		}

		// move to new tile
		itemModel.setTilePos(posX, posY);
		
		var tileModel = this.getTileByPos(posX, posY);
		tileModel.placeNewItem(itemModel);

		this.save();
		return true;
	},

	canAddToItem: function (itemModel) {
		var tileEntity = this.getTileByPos(posX, posY);
		return tileEntity.canAddToItem(itemModel);
	},

	addToItem: function (itemModel, posX, posY) {

		var tileEntity = this.getTileByPos(posX, posY);
		tileEntity.addToItem(itemModel);

		// is the new item empty after the addition?
		if (itemModel.get('quantity') == 0) {

			// remove duplicate model
			this.destroyItem(itemModel);

		}

		this.save();
		return true;
	},

	clearTile: function (posX, posY) {
		var tileEntity = this.getTileByPos(posX, posY);
		tileEntity.removeItemModel();
	},

	placeInRandomTile: function (itemModel) {
		var tiles = this.tileCollection.filter(function (tileModel) {
			return tileModel.hasItemModel() === false;
		});
		
		if (tiles.length) {
			var tilePos = tiles[rand(0, tiles.length - 1)].getTilePos();
			this.placeNewItem(itemModel, tilePos.x, tilePos.y);

			return true;
		}
		return false;
	},

	getUnplacedLoot: function () {
		var data = this.itemCollection.filter(function (itemModel) {
			return itemModel.hasTilePos() === false && !itemModel.hasParent();
		});
		return data;
	},

	getTileByPos: function (posX, posY) {
		return this.tileCollection.find(function (tileModel) {
			return tileModel.hasTilePos(posX, posY);
		});
	},

	getItemByUniqueId: function (uniqueId) {
		return this.itemCollection.find(function (itemModel) {
			return itemModel.getUniqueId() == uniqueId;
		});
		return false;
	},

	getMinTileWidth: function () {
		return this.get('minTileWidth');
	},
	getMaxTileWidth: function () {
		return this.get('maxTileWidth');
	},

	getMinTileHeight: function () {
		return this.get('minTileHeight');
	},
	getMaxTileHeight: function () {
		return this.get('maxTileHeight');
	},

	destroyItem: function (doomedItemModel) {

		// update the tile
		if (doomedItemModel.hasTilePos()) {
			var tilePos = doomedItemModel.getTilePos();
			var tileEntity = this.getTileByPos(tilePos.x, tilePos.y);
			tileEntity.removeItemModel();
		}

		// remove the item model
		this.removeItemModel(doomedItemModel);
		
	},

	save: function () {
		// DB STUFF HERE
	}

});