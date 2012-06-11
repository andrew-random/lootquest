game.ModelTile = Backbone.Model.extend({

		tileX		: null,		// 0, 0 to 10, 10, etc.
		tileY		: null,
		itemModel	: null,		// child items contained by this tile.

		initialize: function () {
		},

		setTilePos: function (tileX, tileY) {
			this.set('tilePos', {x:tileX, y:tileY});
		},

		getTilePos: function () {
			return this.get('tilePos');
		},

		hasTilePos: function (posX, posY) {
			var tilePos = this.getTilePos();
			return tilePos.x == posX && tilePos.y == posY;
		},

		setItemModel: function (itemModel) {	
			if (itemModel) {
				this.set('itemModel', itemModel);
			} else {
				this.unset('itemModel');
			}
			return true;
		},

		getItemModel: function () {
			return this.get('itemModel');
		},

		canPlaceItem: function (newItemModel) {
			var existingItemModel = this.getItemModel();
			if (!existingItemModel) {
				return true;
			} else {
				try {
					
					existingItemModel.canPlaceItem(newItemModel);
					return true;

				} catch (exception) {
					return false;
				}
			}
		}, 

		placeItem: function (itemModel) {
			if (!this.getItemModel(itemModel)) {
				console.log('A', this.getTilePos());
				this.setItemModel(itemModel);	
			} else {
				console.log('B');
				this.getItemModel().placeItem(itemModel);
			}
			
		},

		canRemoveItem: function (itemModel) {
			return true;
		},

		removeItem: function (itemModel) {
			this.setItemModel(null);
		}
});