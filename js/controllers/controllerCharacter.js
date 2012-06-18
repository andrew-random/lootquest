game.characterController = {

	initialize: function () {
		// todo: pull from DB
		
		this.heroCollection 		= new game.collectionHero();
		this.companionCollection 	= new game.collectionCompanion();
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

	addCompanion: function (companionModel) {
		this.companionCollection.add(companionModel);
	},
	removeCompanion: function (companionModel) {
		this.companionCollection.remove(companionModel);
	},
};