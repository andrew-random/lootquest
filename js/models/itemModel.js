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
				this.set('uniqueId', getHash(8));
			}
			if (options.tilePos) {
				this.set('tilePos', options.tilePos);
			}

			return this;
		},

		setTilePos: function (tileX, tileY) {
			this.set('tilePos', {x: tileX, y: tileY});
			this.trigger('test');
			this.trigger('change change:tilePos');
			return this;
		},
		getTilePos: function () {
			return this.get('tilePos');
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
		}

});
game.ModelItem.CATEGORY_EQUIPMENT 	= 'equipment';
game.ModelItem.CATEGORY_DECOR 		= 'decor';
game.ModelItem.CATEGORY_CRAFTING 	= 'crafting';
