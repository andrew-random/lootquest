game.ModelEquipmentItem = game.ModelItem.extend({
	
	defaults: {
		modelClass 		: 'equipment_item',
		heroUniqueId 	: null,
		attackBonus		: 0,
		defenseBonus	: 0,
		
		parentId		: null,			// parent ModelItem
	},

	getAttackBonus: function () {
		return this.get('attackBonus');
	},
	getDefenseBonus: function () {
		return this.get('defenseBonus');
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