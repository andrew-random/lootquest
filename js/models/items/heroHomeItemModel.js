game.ModelHeroHomeItem = game.ModelItem.extend({
	
	defaults: {
		modelClass: 'hero_home_item',
		heroUniqueId: null,
		parentId	: null,			// parent ModelItem
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