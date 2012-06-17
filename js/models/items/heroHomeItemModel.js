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

	canAddToItem: function (newItemModel) {
		
		if (newItemModel.isEquipmentItem()) {
			return this.getHeroModel().canAddEquipment(newItemModel);
		} else {
			throw 'Not valid equipment.';
		}
		return false;

	},

	addToItem: function (newItemModel) {

		var heroModel = this.getHeroModel();
		heroModel.addEquipment(newItemModel);

		var armMessage = new game.ModelMessage();
		armMessage.setHeroModel(heroModel);
	    armMessage.setMessageType(game.ModelMessage.MessageTypeInfo);
	    armMessage.setMessageTitle('A fine choice!');
	    armMessage.setMessage(heroModel.get('name') + ' will wield ' + newItemModel.get('name') + ' in battle.');
	    game.getMessenger().addMessage(armMessage);
				
	},

});