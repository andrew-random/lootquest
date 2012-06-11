/*
	Class constants:

	CATEGORY_EQUIPMENT
	CATEGORY_DECOR
	CATEGORY_CRAFTING
*/
game.ModelItem = Backbone.Model.extend({

		name 		: null,
		type		: null,
		quantity 	: 0,
		categories	: [],
		
		tilePos		: null,		// x any y coords on tile field
		uniqueId    : null,		// unique id to refer to this item
		parentId	: null,		// parent ModelItem
		isContainer : null,		// whether this ModelItem can hold children
		children	: null,		// collectionItem of child ModelItems ( swords, gold pieces, etc. ).
		footprint   : null,		// array of tiles this item takes up

		initialize: function (options) {
			if (options.name) {
				this.name = options.name;
			}
			if (options.quantity) {
				this.quantity = options.quantity;
			}
			if (options.isContainer) {
				this.isContainer = true;
				this.children = new game.collectionItem();
			}
			if (options.uniqueId) {
				this.set('uniqueId', options.uniqueId);
			} else {
				this.set('uniqueId', getHash(3));
			}
			if (options.tilePos) {
				this.set('tilePos', options.tilePos);
			}

			return this;
		},

		setTilePos: function (tileX, tileY) {
			this.set('tilePos', {x: tileX, y: tileY});
			return this;
		},
		getTilePos: function () {
			return this.get('tilePos');
		},

		hasTilePos: function () {
			return typeof this.get('tilePos') != 'undefined';
		},

		setParentId: function (parentItemId) {
			this.set('parentId', parentItemId);
			return this;
		},
		getParentId: function () {
			return this.get('parentId');
		},

		getUniqueId: function () {
			return this.get('uniqueId');
		},

		canPlaceItem: function (newItemModel) {

			// is this the same item?
			if (this.get('type') == newItemModel.get('type')) {

				// would the combination still be below the max quantity?
				if (this.get('maxQuantity') >= this.get('quantity') + newItemModel.get('quantity')) {
					return true;
				} else {
					throw 'Exceeds max quantity';
				}
			
			} else if (this.isContainer) {
				//is this object a container?
				
				//  and can it contain items of this type?
				if (this.canContainType(newItemModel.type)) {
					return true;
				} else {
					throw 'cannot contain type';
				}

			} else {
				throw 'Not container, not same item';
			}
			return false;
		},

		canContainType: function (newItemType) {
			return true;
			//todo: validate against types
			//return newItemType == 
		},

		placeItem: function (newItemModel) {
			if (this.get('type') == newItemModel.get('type')) {
				this.set('quantity', this.get('quantity') + newItemModel.get('quantity'));
				
				// remove duplicate model
				game.getField().destroyItem(newItemModel);
			}
		}

});
game.ModelItem.CATEGORY_EQUIPMENT 	= 'equipment';
game.ModelItem.CATEGORY_DECOR 		= 'decor';
game.ModelItem.CATEGORY_CRAFTING 	= 'crafting';
game.ModelItem.EntityTypeTile		= 'tile';
game.ModelItem.EntityTypeItem		= 'item';