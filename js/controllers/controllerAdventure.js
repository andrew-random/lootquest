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

	canProcessAdventure: function () {
		return this.canAffordAdventure() && this.hasSelectedEnvironment() && this.hasSelectedHeroes();
	},

	canAffordAdventure: function () {
		// todo: make sure user has enough gold to pay companions
		return true;
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

		// hack: add all heroes
		game.getCharacters().getHeroCollection().each(function (heroModel) {
			if (heroModel.canAdventure()) {
				self.selectHero(heroModel);
			}
		});

		if (!this.canProcessAdventure()) {

			var messageItem = new game.ModelMessage();
			messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
			messageItem.setMessageTitle("Your heroes are still resting!");
			messageItem.setMessage("They're just really tired right now.");
			game.getMessenger().addMessage(messageItem);
			return false;

		}

		var fieldModel			= game.getField();
		var environmentModel 	= this.selectedEnvironmentModel;
		var heroNames 			= [];

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
		environmentModel.incrementExploration((playerWon ? 20 : 10));


		var messageItem = new game.ModelMessage();
		messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
		if (playerWon) {
			messageItem.setMessageTitle("Victory!");
		} else {
			messageItem.setMessageTitle("Defeat!");
		}
		messageItem.setMessage(environmentModel.get('name') + (playerWon ? " was successfully pillaged!" : " fought off your heroes!"));
		game.getMessenger().addMessage(messageItem);

		return true;
	},

	calcCombat: function() {
		var totalPlayerAttack = 0;
	
		var count = this.selectedHeroModels.length;
		while (count--) {
			totalPlayerAttack += this.selectedHeroModels[count].getTotalAttack();
		}

		// todo: companions
		// 
		var totalPlayerDefense = 0;
	
		var count = this.selectedHeroModels.length;
		while (count--) {
			totalPlayerDefense += this.selectedHeroModels[count].getTotalDefense();
		}

		// todo: companions


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