game.heroController = {

	initialize: function () {
		// todo: pull from DB
		
		this.heroCollection = new game.collectionHero();

	},

	getHeroCollection: function () {
		return this.heroCollection;
	},

	getHeroByUniqueId: function (uniqueId) {
		return this.heroCollection.find(function (heroModel) {
			return heroModel.getUniqueId() == uniqueId;
		});
	},

	addHero: function (heroModel) {
		this.heroCollection.add(heroModel);
	},
	removeHero: function (heroModel) {
		this.heroCollection.remove(heroModel);
	},
};