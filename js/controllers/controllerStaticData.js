
game.staticDataController = {

	data: [],

	initialize: function () {
		// todo: check central server for new data, update local
	},

	hasData: function () {
		return true;
	},

	getModel: function (modelClass, modelType, options) {
		
		var attributes = [];

		// make sure nothing confusing gets passed
		delete options.type;
		delete options.weight;

		// clone the array, so that staticdata isn't changed
		for (var x in game.staticData[modelClass][modelType]) {
			attributes[x] = game.staticData[modelClass][modelType][x];
		}
		// merge options over the defaults
		for (var x in options) {
			attributes[x] = options[x];
		}

		if (typeof game.staticData[modelClass][modelType] == 'undefined') {
			throw 'No static data found for ' + modelClass + '.' + modelType;
		}
	
		return new game[modelClass](attributes);
	},

	ajaxFetchData: function () {
		// stuff
	},
};