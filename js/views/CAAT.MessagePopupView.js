game.CAAT.MessagePopupView = game.CAAT.EntityView.extend({
	
	zOrder        : 4000,

	initActor: function () {

		var self = this;

		var actor = new CAAT.ActorContainer().
			setBounds(0, 0, this.container.width, this.container.height);

		var overlay = new CAAT.Actor().
			setFillStyle('#000').
			setAlpha(.5).
			setBounds(0, 0, this.container.width, this.container.height);
		actor.addChild(overlay);

		var messageContainer = new CAAT.ActorContainer().
			enableEvents(false).
			setFillStyle('#fff').
			setBounds(50, 50, this.container.width - 100, this.container.height - 100);
		actor.addChild(messageContainer);

		var textLine = new CAAT.TextActor().
			  setPosition(80, 100).
			  setTextAlign('left').
			  setBaseline('middle').
			  setTextFillStyle('#000').
			  setText(this.model.get('messageTitle')).
			  setFont('20px Verdana');
			actor.addChild(textLine);

		// text actors do not do multilines, so we use a shitty hack.
		var messageLineArray = this.model.get('message').match(/.{1,55}/g);
		var count = messageLineArray.length;
		var topPos = 130;
		while (count--) {
			var textLine = new CAAT.TextActor().
			  setPosition(80, topPos + (count * 20)).
			  setTextAlign('left').
			  setBaseline('middle').
			  setTextFillStyle('#000').
			  setText(messageLineArray[count]).
			  setFont('16px Verdana');
			actor.addChild(textLine);
		}
		
		var closeButton = new CAAT.Actor().
			setBounds(500, 40, 80, 30).
			setFillStyle('red');

		closeButton.mouseUp = function () {
			game.getMessenger().removeMessage(self.model);
		}

		actor.addChild(closeButton);
		return actor;
	},

});