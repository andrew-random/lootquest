game.ModelBase = Backbone.Model.extend({

	defaults: {
		'modelClass' 	: null,		// classification of model ( hero, item, tile ). Instanceof in JS is unreliable.
		'type'			: null,		// content file key
		'uniqueId' 		: null,		// unique DB identifier
	},

	initialize: function (options) {
		this._baseInitialize(options);
	},

	_baseInitialize: function (options) {
		
		if (!options) {
			options = {};
		}

		if (!options.uniqueId) {
			options.uniqueId = getHash(8);
		}
		this.set('uniqueId', options.uniqueId);
	},

	getSprite: function () {
		switch (this.getModelClass()) {
			case 'hero_home_item':
				return 'images/item/hero/' + this.get('type') + '.png';
				break;

			default:
				return 'images/' + this.getModelClass() + '/' + this.get('type') + '.png';
				break;
		}
		
	},

	hasSprite: function () {
		return this.getModelClass() !== 'tile';
	},

	getModelClass: function () {
		return this.get('modelClass');
	},

	getUniqueId: function () {
		return this.get('uniqueId');
	},
	setUniqueId: function (uniqueId) {
		return this.set('uniqueId', uniqueId);
	},

});