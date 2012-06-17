game.ModelHero = game.ModelBase.extend({

	defaults: {
		modelClass	: 'hero',
		type 		: 'hero',
		name 		: null,
		status		: 'ready',

		// combat stats
		attack 		: 1,
		defense 	: 1,
		charisma 	: 1,
		level 		: 1,
		equipment	: [],
		xp			: 0,

		// cooldown
		cooldown 	: 5,		// in seconds
		lastAdventureTime: null,
		
	},

	initNew: function () {
		this.set('name', this.getRandomName());
		this.setLastAdventureTime(new Date().getTime() - this.getCooldownMilliseconds());
	},

	getRandomName: function () {
		var names = [
			"Bronan",
			"Cron",
			"Zudo",
			"Brocess",
			"Friat",
			"Kange",
			"Miel"
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

	canAddEquipment: function (equipmentModel) {
		return true;
	},
	addEquipment: function (equipmentModel) {
		this.get('equipment').push(equipmentModel.getUniqueId());
	},
	removeEquipment: function (equipmentModel) {
		var equipment = this.getEquipment();
		var count = equipment.length;
		while (count--) {
			if (equipment[count] == equipmentModel.getUniqueId()) {
				equipment.splice(count, 1);
			}
		}
		return this.set('equipment', equipment);
	},
	getEquipment: function () {
		return this.get('equipment');
	},
	getEquipmentModels: function () {
		var data = [];
		var equipment = this.getEquipment();
		var count = equipment.length;
		while (count--) {
			data.push(game.getField().getItemByUniqueId(equipment[count]));
		}
		return data;
	},

	setLastAdventureTime: function (timestamp) {
		this.set('lastAdventureTime', timestamp);
	},
	getLastAdventureTime: function () {
		return this.get('lastAdventureTime');
	},
	canAdventure: function () {
		return (new Date().getTime() >= this.getLastAdventureTime() + this.getCooldownMilliseconds());
	},
	
	getAdventureCooldownSecondsRemaining: function() {
		return this.getLastAdventureTime() + this.getCooldownMilliseconds() - new Date().getTime();
	},

	getSecondsSinceLastAdventure: function () {
		return new Date().getTime() - this.getLastAdventureTime();
	},

	setStatus: function (status) {
		this.set('status', status);
	},
	getStatus: function () {
		return this.get('status');
	},

	getCooldownMilliseconds: function () {
		return this.get('cooldown') * 1000;
	},

	calcStatus: function () {
		if (this.get('status') == 'healing' || this.get('status') == 'boasting') {
			if (this.canAdventure()) {
				this.setStatus('ready');
			}
		} else if (this.getSecondsSinceLastAdventure() > this.getCooldownMilliseconds() * 2) {
			this.setStatus('Restless');
		}
	},

	getAttack: function () {
		return this.get('attack');
	},
	getTotalAttack: function () {
		var attackBonus = 0;

		var equipment = this.getEquipmentModels();
		var count = equipment.length;
		while (count--) {
			attackBonus += equipment[count].getAttackBonus();
		}
		return this.get('attack') + attackBonus;
	},

	getDefense: function () {
		return this.get('defense');
	},
	getTotalDefense: function () {
		var defenseBonus = 0;

		var equipment = this.getEquipmentModels();
		var count = equipment.length;
		while (count--) {
			defenseBonus += equipment[count].getDefenseBonus();
		}
		return this.get('defense') + defenseBonus;
	},

	addXP: function (value) {
		this.set('xp', this.get('xp') + value);
		this.calcLevel();
	},

	getXP: function () {
		return this.get('xp');
	},

	calcLevel: function () {
		var xp = this.getXP();
		var levels = [
			0,
			10,
			100,
			300,
			500,
			700,
			1000,
			1300,
			1600,
			1900,
			2200,
			2500,
			2800,
		];
		var count = levels.length;
		while (count--) {
			if (levels[count] <= xp) {
				if (this.getLevel() != (count + 1)) {
					this.setLevel(count + 1);
				}
				return true;
			}
		}
		return false;
	},

	setLevel: function (value) {

		if (this.get('level') == value) {
			return false;
		}

		this.set('level', value);

		// increment attack and defense
		this.set('attack', this.get('attack') + 1);
		this.set('defense', this.get('defense') + 1);

	},

	getLevel: function () {
		return this.get('level');
	},



});
