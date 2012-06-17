game.CAAT.HeroDetailView = game.CAAT.EntityView.extend({

	model: null,

	setModel: function (heroModel) {
		this.model = heroModel;
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

		var heroInfoContainer = new CAAT.ActorContainer().
			enableEvents(false).
			setFillStyle('#fff').
			setBounds(50, 50, this.container.width - 100, this.container.height - 100);
		actor.addChild(heroInfoContainer);

		var closeButton = new CAAT.Actor().
			setBounds(500, 40, 80, 30).
			setFillStyle('red');
	    actor.addChild(closeButton);	

		var textLine = new CAAT.TextActor().
			  setPosition(80, 100).
			  setTextAlign('left').
			  setBaseline('middle').
			  setTextFillStyle('#000').
			  setText(this.model.get('name')).
			  setFont('20px Verdana');
			actor.addChild(textLine);

		// hero
		var image = new Image();
	    image.src = this.model.getSprite();

	    var sprite = new CAAT.SpriteImage();
	    sprite.initialize(image, 1, 1);

	    var spriteContainer = new CAAT.Actor().
	      setBounds(20, 70, game.CAAT.SceneGardenView.tileWidth, game.CAAT.SceneGardenView.tileHeight).
	      setBackgroundImage(sprite).
	      enableEvents(false);
	    
	    heroInfoContainer.addChild(spriteContainer);	

	    var level = new CAAT.TextActor().
	  	  		setPosition(30, 150).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Level ' + this.model.getLevel())
	  	  	;
	  	heroInfoContainer.addChild(level);

	  	var xp = new CAAT.TextActor().
	  	  		setPosition(30, 180).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('XP ' + this.model.getXP())
	  	  	;
	  	heroInfoContainer.addChild(xp);

	  	var status = new CAAT.TextActor().
	  	  		setPosition(30, 210).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText(this.model.getStatus())
	  	  	;
	  	heroInfoContainer.addChild(status);

	  	var attackBase = new CAAT.TextActor().
	  	  		setPosition(30, 230).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Base Atk: ' + this.model.getAttack())
	  	  	;
	  	heroInfoContainer.addChild(attackBase);

	  	var defenseBase = new CAAT.TextActor().
	  	  		setPosition(30, 250).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Base Def: ' + this.model.getDefense())
	  	  	;
	  	heroInfoContainer.addChild(defenseBase);


	    // attack item
	    var equipmentModels = this.model.getEquipmentModels();
	    var count = 1;
	   	for (var x in equipmentModels) {
	   		
		    var equipmentBox = new CAAT.ActorContainer().
	    	setBounds(130, (70 * count), 380, 100).
		    	setFillStyle('#ccc')
		    	;
		    heroInfoContainer.addChild(equipmentBox);
		    count++;

	   		var image = new Image();
		    image.src = equipmentModels[x].getSprite();

		    var sprite = new CAAT.SpriteImage();
		    sprite.initialize(image, 1, 1);

		    var spriteContainer = new CAAT.Actor().
		      setBounds(10, 10, game.CAAT.SceneGardenView.tileWidth, game.CAAT.SceneGardenView.tileHeight).
		      setBackgroundImage(sprite).
		      enableEvents(false);
	  	  	equipmentBox.addChild(spriteContainer);

	  	  	var equipmentDetailsAttack = new CAAT.TextActor().
	  	  		setPosition(110, 30).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Attack: ' + (equipmentModels[x].getAttackBonus() > 0 ? '+' : '') + equipmentModels[x].getAttackBonus())
	  	  	;
	  	  	equipmentBox.addChild(equipmentDetailsAttack);

	  	  	var equipmentDetailsDefense = new CAAT.TextActor().
	  	  		setPosition(110, 50).
	  	  		setTextFillStyle('#000').
	  	  		setFont('14px Verdana').
	  	  		setText('Defense: ' + (equipmentModels[x].getDefenseBonus() > 0 ? '+' : '') + equipmentModels[x].getDefenseBonus())
	  	  	;
	  	  	equipmentBox.addChild(equipmentDetailsDefense);
	   	}
		


	    

		closeButton.mouseUp = function () {
			self.expireActor();
		}

		return actor;
	},

	show: function () {
		this.entityReady();
		this.container.setZOrder(this.actor, 4000);
	},

});