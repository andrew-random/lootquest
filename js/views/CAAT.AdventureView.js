game.CAAT.AdventureView = game.CAAT.EntityView.extend({

	selectEnvironmentMenu	: null,
	selectPartyMenu	 		: null,
	adventure 				: null,
	zOrder 					: 4000,

	setAdventure: function (data) {
		this.adventure = data;
	},

	getAdventure: function () {
		return this.adventure;
	},

	initActor: function () {
		
		var self = this;

		var actor = new CAAT.ActorContainer().
			setBounds(0, 0, this.container.width, this.container.height);

		var overlay = new CAAT.Actor().
			setFillStyle('#000').
			setAlpha(.5).
			setBounds(0, 0, this.container.width, this.container.height);
		actor.addChild(overlay);

		var contentContainer = new CAAT.ActorContainer().
			setFillStyle('#fff').
			setBounds(50, 50, this.container.width - 100, this.container.height - 100);
		actor.addChild(contentContainer);

		var closeButton = new CAAT.Actor().
			setBounds(500, 40, 80, 30).
			setFillStyle('red');
	    actor.addChild(closeButton);	

		closeButton.mouseUp = function () {
			self.expireActor();
			self.getAdventure().reset();
		}

		this.selectEnvironmentMenu = this.getSelectEnvironmentMenu();
		contentContainer.addChild(this.selectEnvironmentMenu);

		this.selectPartyMenu = this.getSelectPartyMenu();
		contentContainer.addChild(this.selectPartyMenu);

		var totalAdventureAttack = new CAAT.TextActor().
	  	  		setPosition(200, 705).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Total Attack: ' + this.getAdventure().getTotalAttack())
	  	actor.addChild(totalAdventureAttack);

	  	var totalAdventureDefense = new CAAT.TextActor().
	  	  		setPosition(200, 720).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Total Defense: ' + this.getAdventure().getTotalDefense())
	  	actor.addChild(totalAdventureDefense);

		var totalAdventureCost = new CAAT.TextActor().
	  	  		setPosition(200, 735).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Total Cost: ' + this.getAdventure().getTotalCost() + ' / ' + game.getField().getGold())
	  	actor.addChild(totalAdventureCost);

		var adventureButton = new CAAT.ActorContainer().
			setBounds(300, 650, 200, 50).
			setFillStyle('green')
			;
		adventureButton.mouseUp = function () {
			if (self.getAdventure().processAdventure()) {
				self.expireActor();
			}
		}
		contentContainer.addChild(adventureButton);
		
		return actor;
	},

	getSelectEnvironmentMenu: function () {
		var self = this;
		var actor = new CAAT.ActorContainer().
			setBounds(0, 0, 550, 860);

		var count = 0;
		game.getEnvironments().getEnvironmentCollection().each(function (environmentModel) {
			actor.addChild(self.getEnvironmentActor(environmentModel, count++));
		});
		return actor;
	},

	getEnvironmentActor: function (environmentModel, count) {
		var self = this;

		var actor = new CAAT.ActorContainer().
			enableEvents(true).
			setBounds(20, 20 + 120 * count, 500, 100).
			setFillStyle('#ccc')
			;
		if (this.getAdventure().hasSelectedEnvironment() && this.getAdventure().getSelectedEnvironmentModel().getUniqueId() == environmentModel.getUniqueId()) {
			actor.setFillStyle('gold');
		}
		actor.mouseUp = function () {

			// select environment
			self.getAdventure().setSelectedEnvironmentModel(environmentModel);
			
			self.redraw();

		}

		var environmentName = new CAAT.TextActor().
			setPosition(10, 20).
			setTextAlign('left').
			setBaseline('middle').
			setTextFillStyle('#000').
			setText(environmentModel.get('name')).
			setFont('20px Verdana').
			enableEvents(false);
		actor.addChild(environmentName);

		var environmentPic = new CAAT.Actor().
			enableEvents(false).
			setBounds(150, 40, 340, 50).
			setFillStyle('blue');
		actor.addChild(environmentPic);

		var environmentRating = new CAAT.TextActor().
			enableEvents(false).
			setPosition(10, 50).
			setTextAlign('left').
			setBaseline('middle').
			setTextFillStyle('#000').
			setText('Challenge rating: ' + parseInt(environmentModel.get('attack') + environmentModel.get('defense'))).
			setFont('12px Verdana');
		actor.addChild(environmentRating);

		var environmentExplored = new CAAT.TextActor().
			enableEvents(false).
			setPosition(10, 80).
			setTextAlign('left').
			setBaseline('middle').
			setTextFillStyle('#000').
			setText('Explored: ' + environmentModel.get('explored') + '%').
			setFont('12px Verdana');
		actor.addChild(environmentExplored);

		return actor;
	},

	getSelectPartyMenu: function () {
		var self = this;
		var actor = new CAAT.ActorContainer().
			setBounds(0, 400, 550, 860);

		var title = new CAAT.TextActor().
	  	  		setPosition(20, 0).
	  	  		setTextFillStyle('#000').
	  	  		setFont('20px Verdana').
	  	  		setText('Add henchmen?').
	  	  		enableEvents(false);
	  	actor.addChild(title);

		var count = 0;
		game.getCharacters().getCompanionCollection().each(function (companionModel) {
			actor.addChild(self.getCompanionActor(companionModel, count++));
		});
		return actor;
	},

	getCompanionActor: function (companionModel, count) {

		var self = this;
		var actor = new CAAT.ActorContainer().
			enableEvents(true).
			setBounds(20, 30 + 120 * count, 500, 100).
			setFillStyle('#ccc')
			;

		actor.mouseUp = function () {
			var adventureController = self.getAdventure();
			if (adventureController.hasCompanionModel(companionModel) && adventureController.canRemoveCompanionModel(companionModel)) {

				adventureController.removeCompanionModel(companionModel);
				self.redraw();

			} else if (adventureController.canAddCompanionModel(companionModel)) {

				adventureController.addCompanionModel(companionModel);
				self.redraw();

			}
			
		}
		if (this.getAdventure().hasCompanionModel(companionModel)) {
			actor.setFillStyle('gold');
		}

		// hero
		var image = new Image();
	    image.src = companionModel.getSprite();

	    var sprite = new CAAT.SpriteImage();
	    sprite.initialize(image, 1, 1);

	    var spriteContainer = new CAAT.Actor().
	      setBounds(10, 10, game.CAAT.SceneGardenView.tileWidth, game.CAAT.SceneGardenView.tileHeight).
	      setBackgroundImage(sprite).
	      enableEvents(false);
	    actor.addChild(spriteContainer);

	    var name = new CAAT.TextActor().
	  	  		setPosition(100, 10).
	  	  		setTextFillStyle('#000').
	  	  		setFont('20px Verdana').
	  	  		setText(companionModel.get('name')).
	  	  		enableEvents(false);
	  	actor.addChild(name);


	    var attackBonus = new CAAT.TextActor().
	  	  		setPosition(100, 30).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Attack bonus: ' + companionModel.getAttackBonus()).
	  	  		enableEvents(false);
	  	actor.addChild(attackBonus);

	  	var defenseBonus = new CAAT.TextActor().
	  	  		setPosition(100, 50).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Defense bonus: ' + companionModel.getDefenseBonus()).
	  	  		enableEvents(false);
	  	actor.addChild(defenseBonus);

		var cost = new CAAT.TextActor().
	  	  		setPosition(100, 70).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Cost: ' + companionModel.get('costPerAdventure') + ' gold').
	  	  		enableEvents(false);
	  	actor.addChild(cost);

		return actor;
	},

	show: function () {
		this.entityReady();
		this.container.setZOrder(this.actor, 4000);
	},

});