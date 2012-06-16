game.ModelHeroHomeItem = game.ModelItem.extend({
	
	defaults: {
		modelClass: 'hero_home_item',
		name: 'Throne',
		heroUniqueId: null,
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