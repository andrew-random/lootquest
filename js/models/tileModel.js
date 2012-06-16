game.ModelTile = Backbone.Model.extend({

		defaults: {
			tileX		: null,		// 0, 0 to 10, 10, etc.
			tileY		: null,
			itemModel	: null		// child items contained by this tile.
		},

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
				this.set('itemModel', null);
			}
			return true;
		},

		getItemModel: function () {
			return this.get('itemModel');
		},

		hasItemModel: function () {
			return this.get('itemModel') !== null;
		},

		canPlaceNewItem: function (newItemModel) {
			return this.hasItemModel() === false;
		}, 

		placeNewItem: function (newItemModel) {

			// place on empty tile
			this.setItemModel(newItemModel);
			
		},

		canAddToItem: function (newItemModel) {
			if (this.hasItemModel()) {
				try {

					this.getItemModel().canAddToItem(newItemModel);
					return true;

				} catch (exception) {

					var messageItem = new game.ModelMessage();
					messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
					messageItem.setMessageTitle("Can't put that there.");
					messageItem.setMessage('Could not add to item #' + newItemModel.getUniqueId() + '/' + newItemModel.get('name') + ' on #' + this.getItemModel().getUniqueId() + '/' + this.getItemModel().get('name') +': ' + exception);
					game.getMessenger().addMessage(messageItem);

					return false;
				}
			}
			return false;
		},

		addToItem: function (itemModel) {
			return this.getItemModel().addToItem(itemModel);
		},

		canRemoveItemModel: function (itemModel) {
			return true;
		},

		removeItemModel: function (itemModel) {
			this.setItemModel(null);
		}
});