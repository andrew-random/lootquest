game.ModelMessage = game.ModelBase.extend({

	default: {
		modelClass 		: 'message',		
		messageType  	: 'popup',
		messageTitle 	: 'Default Message',
		message 		: 'Message body'
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
	}

});
game.ModelMessage.MessageTypePopup 	= 'popup';
game.ModelMessage.MessageTypeInfo 	= 'info';