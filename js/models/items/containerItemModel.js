game.ModelContainerItem = game.ModelItem.extend({
	
	defaults: {
		modelClass  : 'container_item',

		name 		: null,
		type		: null,
		quantity 	: 0,
		categories	: [],
		tilePos		: null,			// x any y coords on tile field,

		footprint   : null,			// array of tiles this item takes up

		parentId	: null,			// parent ModelItem
	},


	initialize: function (options) {

		this._baseInitialize(options);

		if (!options) {
			options = {};
		}
		
		if (!options.children) {
			options.children = [];
		}
		this.setChildren(options.children);
		return this;
	},


	canAddToItem: function (newItemModel) {
		if (newItemModel.isContainerItem()) {
				
			// containers can never be added to each other
			// that way lies madness
			throw 'Container cannot hold container.';
			return false;

		} else {

			if (!this.hasTilePos()) {
				throw 'Container has not been placed on the field.';
			}

			if (newItemModel.getParentId() == this.getUniqueId()) {
				throw 'Already in this container';
			}

			if (this.getMaxQuantity() == this.getQuantity()) {
				throw 'Container is full.';
			}

			// is this object a container?
			// and can it contain items of this type?
			if (this.canContainType(newItemModel.get('type'))) {
				return true;
			} else {
				throw 'cannot contain items of type "' + newItemModel.get('type') + '"';
			}
		}

		return true;

	},

	addToItem: function (newItemModel) {

		// if there is already a child with the same type in this container, combine them.
		var childItemModel = this.getChildByType(newItemModel.get('type'));
		if (childItemModel) {

			// sum of quantity
			if (this.getMaxQuantity() >= this.getQuantity() + newItemModel.getQuantity()) {

				// combine total quantity ( ignoring item max )
				childItemModel.set('quantity', childItemModel.getQuantity() + newItemModel.getQuantity());

				// set new item to quantity 0, which will cause fieldModel's addToItem to destroy it.
				newItemModel.set('quantity', 0);

			} else {
				

				// update the new item
				var leftOver = this.getMaxQuantity() - this.getQuantity();
				newItemModel.set('quantity', newItemModel.getQuantity() - leftOver);
			
				// append as much quantity as we can
				childItemModel.set('quantity', this.getMaxQuantity());

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

	getQuantity: function () {
		var childModels = this.getChildrenModels();
		var count = childModels.length;
		var total = 0;
		while (count--) {
			total += childModels[count].get('quantity');	
		}
		return total;
		
	},

	getMaxQuantity: function () {
		return this.get('maxQuantity');
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
});