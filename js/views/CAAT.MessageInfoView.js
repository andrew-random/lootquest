game.CAAT.MessageInfoView = game.CAAT.EntityView.extend({
	
	zOrder        : 4000,

	initActor: function () {

		var self = this;
		var textLeftPos = (this.model.hasHeroModel()) ? 70 : 30;

		var actor = new CAAT.ActorContainer().
			setBounds(0, 0, this.container.width - 100, 50);

		var messageContainer = new CAAT.ActorContainer().
			enableEvents(false).
			setFillStyle('#fff').
			setBounds(20, 20, this.container.width - 180, 50);
		actor.addChild(messageContainer);

		if (this.model.hasHeroModel()) {
			var heroModel = this.model.getHeroModel();
			var image = new Image();
		    image.src = heroModel.getSprite();

		    var sprite = new CAAT.SpriteImage();
		    sprite.initialize(image, 1, 1);

		    var spriteContainer = new CAAT.Actor().
		      setBounds(0, 10, game.CAAT.SceneGardenView.tileWidth, game.CAAT.SceneGardenView.tileHeight).
		      setBackgroundImage(sprite).
		      setScale(.5, .5).
		      enableEvents(false);
		    
		    actor.addChild(spriteContainer);
		}

		var textLine = new CAAT.TextActor().
			  setPosition(textLeftPos, 35).
			  setTextAlign('left').
			  setBaseline('middle').
			  setTextFillStyle('#000').
			  setText(this.model.get('messageTitle')).
			  setFont('13px Verdana');
			actor.addChild(textLine);

		// text actors do not do multilines, so we use a shitty hack.
		var messageLineArray = this.model.get('message').match(/.{1,80}/g);
		var count = messageLineArray.length;
		var topPos = 50;
		while (count--) {
			var textLine = new CAAT.TextActor().
			  setPosition(textLeftPos, topPos + (count * 10)).
			  setTextAlign('left').
			  setBaseline('middle').
			  setTextFillStyle('#000').
			  setText(messageLineArray[count]).
			  setFont('10px Verdana');
			actor.addChild(textLine);
		}
		
		var closeButton = new CAAT.Actor().
			setBounds(380, 10, 80, 30).
			setFillStyle('red');

		closeButton.mouseUp = function () {
			game.getMessenger().removeMessage(self.model);
		}

		actor.addChild(closeButton);
		return actor;
	},

	entityReady: function () {

		this._baseEntityReady();

		var self = this;

		if (self.model.getHideAfter()) {
			setTimeout(function () {
				game.getMessenger().removeMessage(self.model);
			}, self.model.getHideAfter() * 1000);
		}
	},

});