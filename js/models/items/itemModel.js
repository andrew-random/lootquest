/*
	Class constants:

	CATEGORY_EQUIPMENT
	CATEGORY_DECOR
	CATEGORY_CRAFTING
*/
game.ModelItem = game.ModelBase.extend({

		defaults: {
			modelClass  : 'item',

			name 		: null,
			type		: null,
			quantity 	: 0,
			categories	: [],
			tilePos		: null,			// x any y coords on tile field,
	
			footprint   : null,			// array of tiles this item takes up

			parentId	: null,			// parent ModelItem
			children    : [],
		},		

		/**
		 * 	Tile Position methods
		 */
		setTilePos: function (tileX, tileY) {
			this.set('tilePos', {x: tileX, y: tileY});
			return this;
		},
		getTilePos: function () {
			return this.get('tilePos');
		},
		clearTilePos: function () {
			return this.set('tilePos', null);
		},
		hasTilePos: function () {
			return this.get('tilePos') != null;
		},

		canAddToItem: function (newItemModel) {
			
			if (newItemModel.isContainerItem()) {
				
				// containers can never be added to each other
				// that way lies madness
				throw 'Container cannot hold container.';
				return false;

			} else if (this.get('type') == newItemModel.get('type')) {
				
				// is the new item already maxed?
				// if so, it can't possibly fit here.
				if (newItemModel.getMaxQuantity() == newItemModel.getQuantity()) {
					throw 'New item is already max quantity.';
					return false;
				}

				// is this item already at max quantity?
				if (this.getMaxQuantity() != this.getQuantity()) {
					return true;
				} else {
					throw 'Exceeds max quantity';
				}
			
			} else {
				throw 'Not container, not same item';
			}
			return false;
		},

		addToItem: function (newItemModel) {

			// sum of quantity
			if (this.getMaxQuantity() >= this.getQuantity() + newItemModel.getQuantity()) {
				
				// append all quantity
				this.set('quantity', this.getQuantity() + newItemModel.getQuantity());

				// remove quantity from old model
				newItemModel.set('quantity', 0);

			} else {
				
				// update the new item
				var leftOver = this.get('maxQuantity') - this.get('quantity');
				newItemModel.set('quantity', newItemModel.get('quantity') - leftOver);
			
				// append as much quantity as we can
				this.set('quantity', this.getMaxQuantity());

			}
		},


		getQuantity: function () {
			return this.get('quantity');
			
		},

		getMaxQuantity: function () {
			return this.get('maxQuantity');
		},

		/**
		 * Child and container functions
		 */
		setParentId: function (parentItemId) {
			this.set('parentId', parentItemId);
			return this;
		},
		getParentId: function () {
			return this.get('parentId');
		},

		hasParent: function () {
			var parentId = this.getParentId();
			if (typeof parentId== 'undefined') {
				return false;
			}
			if (parentId === null) {
				return false;
			}
			return true;
		},
		getParentModel: function () {
			return game.getField().getItemByUniqueId(this.getParentId());
		},

		/**
		 * Was this model created in the last half second?
		 */
		isNew: function () {
			return (new Date().getTime() - this.get('created') <= 500);
		},

		isHeroHomeItem: function () {
			return this.getModelClass() == 'hero_home_item';
		},

		isEquipmentItem: function () {
			return this.getModelClass() == 'equipment_item';
		},

		isContainerItem: function () {
			return this.getModelClass() == 'container_item';
		},

		getSprite: function () {
			var modelClass = this.getModelClass().replace('_item', '');
			if (modelClass == 'item') {
				return 'images/' + modelClass + '/' + this.get('type') + '.png';
			} else {
				return 'images/item/' + modelClass + '/' + this.get('type') + '.png';
			}

		}

});
game.ModelItem.CATEGORY_EQUIPMENT 	= 'equipment';
game.ModelItem.CATEGORY_DECOR 		= 'decor';
game.ModelItem.CATEGORY_CRAFTING 	= 'crafting';