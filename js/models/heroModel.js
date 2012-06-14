game.ModelHero = Backbone.Model.extend({

	defaults: {
		name: 'Hero',
		type: 'hero',
		attack: 5,
		defense: 5,
		charisma: 5,
		equipment: [],
		cooldown: 3,		// seconds
		lastAdventureTime: null,
		hasSprite: true
	},

	initialize: function (options) {
		if (!options) {
			options = {};
		}
		if (!options.uniqueId) {
			options.uniqueId = getHash(3);
		}
		this.set('uniqueId', options.uniqueId);

		return this;
	},

	getUniqueId: function () {
		return this.get('uniqueId');
	},
	setUniqueId: function (uniqueId) {
		return this.set('uniqueId', uniqueId);
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

	getSprite: function () {
		return 'images/heroes/' + this.get('type') + '.png';
	},

	setLastAdventureTime: function (timestamp) {
		this.set('lastAdventureTime', timestamp);
	},
	getLastAdventureTime: function () {
		return this.get('lastAdventureTime');
	},
	canAdventure: function () {
		return (new Date().getTime() >= this.getLastAdventureTime() + (this.get('cooldown') * 1000));
	},
	
	getAdventureCooldownSecondsRemaining: function() {
		return formatSecondsRemaining(this.getLastAdventureTime() + (this.get('cooldown') * 1000) - new Date().getTime());
	},



});
