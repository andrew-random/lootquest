game.environmentController = {

	environmentCollection: null,

	initialize: function () {
		this.environmentCollection = new game.collectionEnvironment();
	},

	
	addEnvironment: function (environmentModel) {
		return this.environmentCollection.add(environmentModel);
	},

	removeEnvironment: function () {
		return this.environmentCollection.remove(environmentModel);
	},

	getEnvironmentCollection: function () {
		return this.environmentCollection;
	},

	getEnvironmentByUniqueId: function (uniqueId) {
		return this.environmentCollection.find(function (environmentModel) {
			return environmentModel.getUniqueId() == uniqueId;
		});
	}

}