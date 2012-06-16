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
		game.getHeroes().getHeroCollection().each(function (heroModel) {
			if (heroModel.canAdventure()) {
				self.selectHero(heroModel);
			}
		});

		// adventure!
		var environmentModel = game.getEnvironments().getEnvironmentCollection().find(function () { 
			return true;
		})
		this.selectedEnvironmentModel = environmentModel;

		if (this.canProcessAdventure()) {
			
			this.processAdventure();

		} else {

			var messageItem = new game.ModelMessage();
			messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
			messageItem.setMessageTitle("Your heroes are still resting!");
			messageItem.setMessage("They're just really tired right now.");
			game.getMessenger().addMessage(messageItem);

		}

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

	hasSelectedHeroes: function () {
		return this.selectedHeroModels.length > 0
	},

	processAdventure: function () {
		var fieldModel			= game.getField();
		var environmentModel 	= this.selectedEnvironmentModel;
		var heroNames 			= [];

		var count = this.selectedHeroModels.length;
		while (count--) {
			this.selectedHeroModels[count].setLastAdventureTime(new Date().getTime());
			heroNames.push(this.selectedHeroModels[count].get('name'));
		}

		var partyIsVictorious = this.calcCombat();
		if (partyIsVictorious) {
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
		var maxLoot = rand(1, 3);
		for (var x = 0; x <= maxLoot; x++) {

			if (totalLoot == totalPossibleLoot) {
				console.log('Board is full.');
				continue;
			}
			totalLoot++;

			var randomItem = environmentModel.getRandomLoot();
			fieldModel.addItemModel(randomItem);
			fieldModel.placeInRandomTile(randomItem);
		}

		var messageItem = new game.ModelMessage();
		messageItem.setMessageType(game.ModelMessage.MessageTypeInfo);
		if (this.selectedHeroModels.length > 1) {
			messageItem.setMessageTitle(heroNames.join(', ') + " return!");
		} else {
			messageItem.setMessageTitle(heroNames.join(', ') + " returns!");
		}
		messageItem.setMessage(environmentModel.get('name') + " was succesfully pillaged!");
		game.getMessenger().addMessage(messageItem);
	},

	calcCombat: function() {
		var totalOffense = 0;
	
		var count = this.selectedHeroModels.length;
		while (count--) {
			totalOffense += this.selectedHeroModels[count].getTotalAttack();
		}

		// companions


		return true;
	}
}