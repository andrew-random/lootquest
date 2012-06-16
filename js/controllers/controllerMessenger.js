game.messengerController = {

	initialize: function () {
		// todo: pull from DB
		
		this.messengerCollection = new game.collectionMessage();

	},

	getMessages: function () {
		return this.messengerCollection;
	},

	addMessage: function (messageModel) {
		return this.messengerCollection.add(messageModel);
	},

	removeMessage: function (messageModel) {
		return this.messengerCollection.remove(messageModel);
	}
};