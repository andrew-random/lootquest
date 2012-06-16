game.CAAT.MessageInfoView = game.CAAT.EntityView.extend({
	
	zOrder        : 4000,

	initActor: function () {

		var self = this;

		var actor = new CAAT.ActorContainer().
			setBounds(0, 0, this.container.width - 100, 50);

		var messageContainer = new CAAT.ActorContainer().
			enableEvents(false).
			setFillStyle('#fff').
			setBounds(20, 20, this.container.width - 180, 50);
		actor.addChild(messageContainer);

		var textLine = new CAAT.TextActor().
			  setPosition(30, 35).
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
			  setPosition(30, topPos + (count * 10)).
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
		setTimeout(function () {
			game.getMessenger().removeMessage(self.model);
		}, 2000);
	},

});