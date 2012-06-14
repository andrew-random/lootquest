game.ModelHeroBaseItem = game.ModelItem.extend({
	defaults: {
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