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
	
			footprint   : null,			// array of tiles this item takes up

			parentId	: null,			// parent ModelItem
			isContainer : null,			// whether this ModelItem can hold children
			children    : [],			// array of unique ids of child items
		},
		

		initialize: function (options) {
			if (!options.uniqueId) {
				options.uniqueId = getHash(3);
			}
			this.set('uniqueId', options.uniqueId);

			if (!options.children) {
				options.children = [];
			}
			this.setChildren(options.children);
			return this;
		},

		getUniqueId: function () {
			return this.get('uniqueId');
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
			
			if (newItemModel.isContainer()) {
				
				// containers can never be added to each other
				// that way lies madness
				throw 'Container cannot hold container.';
				return false;

			} else if (this.get('type') == newItemModel.get('type')) {
				
				// is this the same item?
				
				// is this item already at max quantity?
				if (this.get('maxQuantity') != this.get('quantity')) {
					return true;
				} else {
					throw 'Exceeds max quantity';
				}
			
			} else if (this.isContainer()) {

				if (!this.hasTilePos()) {
					throw 'Container has not been placed on the field.';
				}

				if (newItemModel.getParentId() == this.getUniqueId()) {
					throw 'Already in this container';
				}

				if (this.getMaxContainedQuantity() == this.getContainedQuantity()) {
					throw 'Container is full.';
				}

				// is this object a container?
				// and can it contain items of this type?
				if (this.canContainType(newItemModel.get('type'))) {
					return true;
				} else {
					throw 'cannot contain items of type "' + newItemModel.get('type') + '"';
				}

			} else {
				throw 'Not container, not same item';
			}
			return false;
		},

		canContainType: function (newItemType) {
			var possibleTypes = this.get('childrenTypes');
			var count = possibleTypes.length;
			while (count--) {
				if (possibleTypes[count] == newItemType) {
					return true;
				}
			}
			return false;
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


				// if there is already a child with the same type in this container, combine them.
				var childItemModel = this.getChildByType(newItemModel.get('type'));
				if (childItemModel) {

					// sum of quantity
					if (this.getMaxContainedQuantity() >= this.getContainedQuantity() + newItemModel.get('quantity')) {

						// combine total quantity ( ignoring item max )
						childItemModel.set('quantity', childItemModel.get('quantity') + newItemModel.get('quantity'));

						// set new item to quantity 0, which will cause fieldModel's addToItem to destroy it.
						newItemModel.set('quantity', 0);

					} else {
						

						// update the new item
						var leftOver = this.getMaxContainedQuantity() - this.getContainedQuantity();
						newItemModel.set('quantity', newItemModel.get('quantity') - leftOver);
					
						// append as much quantity as we can
						childItemModel.set('quantity', this.getMaxContainedQuantity());

					}

				} else {

					if (newItemModel.hasTilePos()) {
						var tilePos = newItemModel.getTilePos();
						game.getField().clearTile(tilePos.x, tilePos.y);
					}

					newItemModel.setParentId(this.get('uniqueId'));
					newItemModel.clearTilePos();
					this.addChild(newItemModel.getUniqueId());
				}

			}
		},

		getSprite: function () {
			return 'images/' + this.get('type') + '.png';
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
			return this.getParentId() !== null;
		},
		getParentModel: function () {
			return game.getField().getItemByUniqueId(this.getParentId());
		},

		addChild: function (childUniqueId) {
			this.get('children').push(childUniqueId);
		},

		hasChildren: function () {
			return this.get('children').length !== 0;	
		},

		removeChild: function () {
			// do stuff
		},

		getChildren: function () {
			return this.get('children');
		},
		setChildren: function (data) {
			this.set('children', data);
		},

		getChildByType: function (itemType) {
			var children = this.getChildrenModels();
			var count = children.length;
			while (count--) {
				if (children[count].get('type') == itemType) {
					return children[count];
				}
			}
			return false;
		},

		getChildrenModels: function () {
			var children = this.getChildren();
			var count = children.length;
			var data = [];
			while (count--) {
				var childItem = game.getField().getItemByUniqueId(children[count]);
				//hack: why the heck aren't children object specific?
				if (childItem.getParentId() == this.getUniqueId()) {
					data.push(childItem);
				}
				
			}
			return data;
		},

		isChild: function () {
			return this.getParentId() !== null;
		},

		isContainer: function () {
			return this.get('isContainer') === true;
		},

		getContainedQuantity: function () {
			var childModels = this.getChildrenModels();
			var count = childModels.length;
			var total = 0;
			while (count--) {
				total += childModels[count].get('quantity');	
			}
			return total;
			
		},

		getMaxContainedQuantity: function () {
			return this.get('maxQuantity');
		},

});
game.ModelItem.CATEGORY_EQUIPMENT 	= 'equipment';
game.ModelItem.CATEGORY_DECOR 		= 'decor';
game.ModelItem.CATEGORY_CRAFTING 	= 'crafting';
game.ModelItem.EntityTypeTile		= 'tile';
game.ModelItem.EntityTypeItem		= 'item';