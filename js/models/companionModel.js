game.ModelCompanion = game.ModelBase.extend({

	defaults: {
		modelClass			: 'companion',
		type 				: 'swordsman',
		name 				: null,
		costPerAdventure	: 50,

		// combat stats
		attackBonus 		: 1,
		defenseBonus	 	: 1,
	},

	initNew: function () {
		this.set('name', this.getRandomName());
	},

	getRandomName: function () {
		var names = [
			"Brufus",
			'Phants',
			'Sickle',
			'Qweeze',
			'Ippan',
			'Arfaclio',
			'Hynch',
			'Lurch',
			'Number 1',
			'Number 2',
			'Westle',
			'Frestin',
			'Itop',
			'Zhack',
		];
		return names[rand(0, names.length - 1)];
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

	getAttackBonus: function () {
		return this.get('attackBonus');
	},
	getDefenseBonus: function () {
		return this.get('defenseBonus');
	},
	




});
