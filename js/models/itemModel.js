/*
	Class constants:

	CATEGORY_EQUIPMENT
	CATEGORY_DECOR
	CATEGORY_CRAFTING
*/
game.ModelItem = Backbone.Model.extend({

		defaults: {
			name 		: null,
			type		: null,
			quantity 	: 0,
			categories	: [],
			tilePos		: null,			// x any y coords on tile field,
			uniqueId    : null,			// unique id to refer to this item
			parentId	: null,			// parent ModelItem
			isContainer : null,			// whether this ModelItem can hold children
		},
		
		children	: null,		// collectionItem of child ModelItems ( swords, gold pieces, etc. ).
		footprint   : null,		// array of tiles this item takes up

		initialize: function (options) {
			if (!options.uniqueId) {
				options.uniqueId = getHash(3);
			}
			this.set('uniqueId', options.uniqueId);
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
			return this.get('tilePos') != null;
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

		canAddToItem: function (newItemModel) {
			// is this the same item?
			if (this.get('type') == newItemModel.get('type')) {

				// is this item already at max quantity?
				if (this.get('maxQuantity') != this.get('quantity')) {
					return true;
				} else {
					throw 'Exceeds max quantity';
				}
			
			} else if (this.isContainer()) {
				//is this object a container?
				
				//  and can it contain items of this type?
				if (this.canContainType(newItemModel.get('type'))) {
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

		addToItem: function (newItemModel) {
			if (this.get('type') == newItemModel.get('type')) {

				// sum of quantity
				if (this.get('maxQuantity') >= this.get('quantity') + newItemModel.get('quantity')) {
					
					// append all quantity
					this.set('quantity', this.get('quantity') + newItemModel.get('quantity'));

					// remove quantity from old model
					newItemModel.set('quantity', 0);


				} else {
					
					// update the new item
					var leftOver = this.get('maxQuantity') - this.get('quantity');
					newItemModel.set('quantity', newItemModel.get('quantity') - leftOver);
				
					// append as much quantity as we can
					this.set('quantity', this.get('maxQuantity'));

				}

			} else {

				newItemModel.setParentId(this.get('uniqueId'));
				this.addChild(newItemModel);

			}
		},

		getSprite: function () {
			return 'images/' + this.get('type') + '.png';
		},

		/**
		 * Child and container functions
		 */

		addChild: function (itemModel) {
			this.children.push(itemModel);
		},

		hasChildren: function () {
			return this.children.length !== 0;	
		},

		removeChild: function () {
			// do stuff
		},

		getChildren: function () {
			return this.children;
		},

		isChild: function () {
			return this.getParentId();
		},

		isContainer: function () {
			return this.get('isContainer') === true;
		}

});
game.ModelItem.CATEGORY_EQUIPMENT 	= 'equipment';
game.ModelItem.CATEGORY_DECOR 		= 'decor';
game.ModelItem.CATEGORY_CRAFTING 	= 'crafting';
game.ModelItem.EntityTypeTile		= 'tile';
game.ModelItem.EntityTypeItem		= 'item';