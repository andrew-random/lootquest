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

		var adventureButton = new CAAT.ActorContainer().
			setBounds(300, 400, 200, 50).
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

	show: function () {
		this.entityReady();
		this.container.setZOrder(this.actor, 4000);
	},

});