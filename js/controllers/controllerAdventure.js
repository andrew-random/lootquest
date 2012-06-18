game.adventureController = {

	selectedEnvironmentModel	: null,
	selectedHeroModels			: [],
	selectedCompanionModels		: [],

	initialize: function () {
		// do nothing... for now.
		this.reset();
	},

	reset: function () {
		this.selectedEnvironmentModel	= null;
		this.selectedHeroModels			= [];
		this.selectedCompanionModels	= [];
	},

	startNewAdventure: function () {

		var self = this;
		this.reset();

		// hack: add all heroes
		game.getCharacters().getHeroCollection().each(function (heroModel) {
			//if (heroModel.canAdventure()) {
				self.selectHero(heroModel);
			//}
		});

	},

	canSelectHero: function (heroModel) {
		if (!heroModel.canAdventure()) {
			return false;
		}
		return true;
	},

	selectHero: function (heroModel) {
		this.selectedHeroModels.push(heroModel);
	},

	canAddCompanionModel: function (companionModel) {
		//hack
		//todo: hero charisma check
		
		return true;
	},

	addCompanionModel: function (companionModel) {
		this.selectedCompanionModels.push(companionModel);
	},

	canRemoveCompanionModel: function () {
		return true;
	},
	removeCompanionModel: function (companionModel) {
		var count = this.selectedCompanionModels.length;
		while (count--) {
			if (this.selectedCompanionModels[count].getUniqueId() == companionModel.getUniqueId()) {
				this.selectedCompanionModels.splice(count, 1);
			}
		}
	},
	hasCompanionModel: function (companionModel) {
		var count = this.selectedCompanionModels.length;
		while (count--) {
			if (this.selectedCompanionModels[count].getUniqueId() == companionModel.getUniqueId()) {
				return true;
			}
		}
		return false;
	},

	canProcessAdventure: function () {
		if (!this.canAffordAdventure()) {
			throw 'You do not have enough Gold.';
		}
		if (!this.hasSelectedEnvironment()) {
			throw 'Please select an environent.';
		}
		if (!this.hasSelectedHeroes()) {
			throw 'Please select a hero.';
		}
		var count = this.selectedHeroModels;
		while (count--) {
			if (!this.selectedHeroModels[count].canAdventure()) {
				throw 'Your heroes need rest.';
			}
		}
		return true;
	},

	canAffordAdventure: function () {
		return game.getField().getGold() >= this.getTotalCost();
	},

	getTotalCost: function () {
		var totalCost = 0;
		var count = this.selectedCompanionModels.length;
		while (count--) {
			totalCost += this.selectedCompanionModels[count].get('costPerAdventure');
		}
		return totalCost;
	},

	getTotalAttack: function () {
		var total = 0;
		// attack
		var count = this.selectedHeroModels.length;
		while (count--) {
			total += this.selectedHeroModels[count].getTotalAttack();
		}

		var count = this.selectedCompanionModels.length;
		while (count--) {
			total += this.selectedCompanionModels[count].getAttackBonus();
		}
		return total;
	},

	getTotalDefense: function () {
		var total = 0;
		// attack
		var count = this.selectedHeroModels.length;
		while (count--) {
			total += this.selectedHeroModels[count].getTotalDefense();
		}

		var count = this.selectedCompanionModels.length;
		while (count--) {
			total += this.selectedCompanionModels[count].getDefenseBonus();
		}
		return total;
	},

	hasSelectedEnvironment: function () {
		return this.selectedEnvironmentModel !== null;
	}, 

	setSelectedEnvironmentModel: function (environmentModel) {
		this.selectedEnvironmentModel = environmentModel;
	},
	getSelectedEnvironmentModel: function () {
		return this.selectedEnvironmentModel;
	},


	hasSelectedHeroes: function () {
		return this.selectedHeroModels.length > 0
	},

	processAdventure: function () {

		var self = this;

		try {
			
			this.canProcessAdventure();

		} catch (exception) {
			console.log(exception);

			var messageItem = new game.ModelMessage();
			messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
			messageItem.setMessageTitle("Could not adventure!");
			messageItem.setMessage(exception);
			game.getMessenger().addMessage(messageItem);
			return false;

		}

		var fieldModel			= game.getField();
		var environmentModel 	= this.selectedEnvironmentModel;
		var heroNames 			= [];

		// remove gold
		game.getField().removeGold(this.getTotalCost());

		var count = this.selectedHeroModels.length;
		while (count--) {
			this.selectedHeroModels[count].setLastAdventureTime(new Date().getTime());
			heroNames.push(this.selectedHeroModels[count].get('name'));
		}

		var playerWon = this.calcCombat();
		if (playerWon) {
			var count = this.selectedHeroModels.length;
			while (count--) {
				this.selectedHeroModels[count].setStatus('Boasting');
			}
		} else {
			var count = this.selectedHeroModels.length;
			while (count--) {
				this.selectedHeroModels[count].setStatus('Healing');
			}
		}

		var totalLoot 		= fieldModel.itemCollection.filter(function (itemModel) {
			return itemModel.hasTilePos();
		}).length;

		var totalPossibleLoot = 25;
		var maxLoot = rand(1, (playerWon ? 3 : 1));
		for (var x = 0; x <= maxLoot; x++) {

			if (totalLoot == totalPossibleLoot) {
				var messageItem = new game.ModelMessage();
				messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
				messageItem.setMessageTitle("Your land is full!");
				messageItem.setMessage("We could not fit all of your loot onto the grid.");
				game.getMessenger().addMessage(messageItem);
				continue;
			}
			totalLoot++;

			var randomItem = environmentModel.getRandomLoot();
			fieldModel.placeInRandomTile(randomItem);
			fieldModel.addItemModel(randomItem);
		}

		// award XP
		var count = this.selectedHeroModels.length;
		while (count--) {
			this.selectedHeroModels[count].addXP(this.getAdventureXP(playerWon));
		}

		// explore the environment a bit
		var explorationAmount = (playerWon ? 20 : 10);
		environmentModel.incrementExploration(explorationAmount);

		var adventureCompleteMessage = '';
		if (playerWon) {
			adventureCompleteMessage += environmentModel.get('name') + " was successfully pillaged!<br />";
		} else {
			adventureCompleteMessage += environmentModel.get('name') + " fought off your heroes!<br />";
		}
		adventureCompleteMessage += 'All heroes gained ' + this.getAdventureXP(playerWon) + 'XP.<br />';
		adventureCompleteMessage += ' Your heroes scouted ' + explorationAmount + '% of ' + environmentModel.get('name') + '.<br />';

		var messageItem = new game.ModelMessage();
		messageItem.setMessageType(game.ModelMessage.MessageTypePopup);
		if (playerWon) {
			messageItem.setMessageTitle("Victory!");
		} else {
			messageItem.setMessageTitle("Defeat!");
		}
		messageItem.setMessage(adventureCompleteMessage);
		game.getMessenger().addMessage(messageItem);

		return true;
	},

	calcCombat: function() {
		
		var totalPlayerAttack = this.getTotalAttack();
		var totalPlayerDefense = this.getTotalDefense();


		// todo: actual combat math. 
		// this is bad even for hackiness.
		return totalPlayerAttack - this.selectedEnvironmentModel.getDefense() >= this.selectedEnvironmentModel.getAttack() - totalPlayerDefense;
	},

	getAdventureXP: function (playerWon) {
		var totalXP = this.selectedEnvironmentModel.getAttack() + this.selectedEnvironmentModel.getDefense();
		if (!playerWon) {
			totalXP = Math.ceil(totalXP / 2);
		}
		return totalXP;
	},
}