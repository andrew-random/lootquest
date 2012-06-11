game.ModelTile = Backbone.Model.extend({

		tileX		: null,		// 0, 0 to 10, 10, etc.
		tileY		: null,
		itemModel	: null,		// child items contained by this tile.

		initialize: function () {
		},

		setTilePos: function (tileX, tileY) {
			this.tileX = tileX;
			this.tileY = tileY;
		},

		getTilePos: function () {
			return {x: this.tileX, y:this.tileY};
		},

		setItemModel: function (itemModel) {
			this.itemModel = itemModel;
			this.trigger("change:itemModel", this, itemModel);
			return true;
		},

		getItemModel: function () {
			return this.itemModel;
		},

		getId: function () {
			return 'tile' + this.tileX + ',' + this.tileY;
		},

		canAddItem: function (newItemModel) {
			var existingItemModel = this.getItemModel();
			if (!existingItemModel) {
				return true;
			} else if (existingItemModel.canAddItem(newItemModel)) {
				return true;
			} else {
				return false;
			}
		}
});