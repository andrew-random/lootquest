game.ModelMessage = game.ModelBase.extend({

	defaults: {
		modelClass 			: 'message',		
		messageType  		: 'popup',
		messageTitle 		: 'Default Message',
		message 			: 'Message body',
		hideAfterSeconds 	: 3,
	},

	setMessageType: function (messageType) {
		this.set('messageType', messageType);
	},
	getMessageType: function () {
		return this.get('messageType');
	},

	setMessage: function (message) {
		this.set('message', message);
	},

	getMessage: function () {
		return this.get('message');
	},

	setMessageTitle: function (title) {
		this.set('messageTitle', title);
	},

	getMessageTitle: function () {
		return this.get('messageTitle');
	},

	// for info messages - auto hide after the user ignores them.
	setHideAfter: function (seconds) {
		return this.set('hideAfterSeconds', seconds);
	},
	getHideAfter: function () {
		return this.get('hideAfterSeconds');
	}

});
game.ModelMessage.MessageTypePopup 	= 'popup';
game.ModelMessage.MessageTypeInfo 	= 'info';