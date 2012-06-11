game.ModelEnvironment = Backbone.Model.extend({

		initialize: function (options) {
			return this;
		},

		getRandomLoot: function () {
			var possibleLoot = [];
			possibleLoot.push(new game.ModelItem({
				name:'Gold', 
				type: 'gold',
				quantity:rand(20, 100),
				maxQuantity: 300
			}));
			possibleLoot.push(new game.ModelItem({
				name: 'Sword', 
				type: 'weapon', 
				quantity:1,
				maxQuantity:2,
			}));
			possibleLoot.push(new game.ModelItem({
				name:'Gem', 
				type:'gem', 
				quantity:1,
				maxQuantity:3
			}));

			return possibleLoot[rand(0, possibleLoot.length -1 )];
		}
});