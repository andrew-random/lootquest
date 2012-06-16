game.ModelHeroHomeItem = game.ModelItem.extend({
	
	defaults: {
		modelClass: 'hero_home_item',
		name: 'Throne',
		quantity: 1,
		maxQuantity: 1,
		type: 'hero_throne',
		heroUniqueId: null,
		hasSprite: true,
	},

	setHeroUniqueId: function (uniqueId) {
		this.set('heroUniqueId', uniqueId);
	},
	getHeroUniqueId: function () {
		return this.get('heroUniqueId');
	},
	getHeroModel: function () {
		return game.heroController.getHeroByUniqueId(this.getHeroUniqueId());
	},
});