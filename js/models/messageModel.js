game.ModelMessage = Backbone.Model.extend({

	default: {
		messageType  	: 'popup',
		messageTitle 	: 'Default Message',
		message 		: 'Message body'
	},

	initialize: function (options) {
		if (!options) {
			options = {};
		}
		if (!options.uniqueId) {
			options.uniqueId = getHash(3);
		}
		this.set('uniqueId', options.uniqueId);
	},

	getUniqueId: function () {
		return this.get('uniqueId');
	},
	setUniqueId: function (uniqueId) {
		return this.set('uniqueId', uniqueId);
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