game.ModelEnvironment = Backbone.Model.extend({

		initialize: function (options) {
			return this;
		},

		getRandomLoot: function () {
			var possibleLoot = [];
			possibleLoot.push(new game.ModelItem({name:'Gold', quantity:100, uniqueId:'wtf', tilePost:{x:3, y:4}}));
			possibleLoot.push(new game.ModelItem({name:'Sword', quantity:1}));
			possibleLoot.push(new game.ModelItem({name:'Gem', quantity:3}));

			return possibleLoot[rand(0, possibleLoot.length -1 )];
		}
});