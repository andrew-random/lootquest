game.ModelHero = game.ModelBase.extend({

	defaults: {
		modelClass: 'hero',
		name: 'Hero',
		type: 'hero',
		attack: 5,
		defense: 5,
		charisma: 5,
		equipment: [],
		cooldown: 3,		// seconds
		lastAdventureTime: null
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
