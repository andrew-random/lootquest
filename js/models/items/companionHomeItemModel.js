game.ModelCompanionHomeItem = game.ModelItem.extend({
	
	defaults: {
		modelClass			: 'companion_home_item',
		companionUniqueIds 	: null,
		maxQuantity 		: 2,
		companionType		: null,
		companionQuantity   : 0,
	},

	initialize: function () {
		
		this._baseInitialize();

		//todo: only trigger this on new item creation, otherwise pull from db
		this.generateCompanions();
		
	},

	generateCompanions: function () {
		
		// generate two companions
		var maxCompanions = this.get('companionQuantity');
		while (maxCompanions--) {
			var companionModel = game.getStaticData().getModel(game.ModelBase.ModelClassCompanion, this.get('companionType'));
			companionModel.initNew();
			game.getCharacters().addCompanion(companionModel);
			this.addCompanionUniqueId(companionModel.getUniqueId());
		}
	},

	addCompanionUniqueId: function (uniqueId) {
		this.set('companionUniqueIds', uniqueId);
	},
	getCompanions: function () {
		return this.get('companionUniqueIds');
	},
	getCompanionModels: function () {
		return game.companionController.getCompanionByUniqueId(this.getHeroUniqueId());
	},

	canAddToItem: function (newItemModel) {
		
		return false;

	},

	addToItem: function (newItemModel) {

		return false;
				
	},

});