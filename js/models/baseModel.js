game.ModelBase = Backbone.Model.extend({

	defaults: {
		'modelClass' 	: null,		// classification of model ( hero, item, tile ). Instanceof in JS is unreliable.
		'type'			: null,		// content file key
		'uniqueId' 		: null,		// unique DB identifier
		'created'		: null,		// timestamp of creation
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

		if (!options.created) {
			options.created = new Date().getTime();
		}
		this.set('created', options.created);
	},

	getSprite: function () {
		
		return 'images/' + this.getModelClass() + '/' + this.get('type') + '.png';
		
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

game.ModelBase.ModelClassItem 				= 'ModelItem';
game.ModelBase.ModelClassHeroHomeItem 		= 'ModelHeroHomeItem';
game.ModelBase.ModelClassCompanionHomeItem 	= 'ModelCompanionHomeItem';
game.ModelBase.ModelClassContainerItem 		= 'ModelContainerItem';
game.ModelBase.ModelClassEquipmentItem 		= 'ModelEquipmentItem';
game.ModelBase.ModelClassHero 				= 'ModelHero';
game.ModelBase.ModelClassCompanion			= 'ModelCompanion';
