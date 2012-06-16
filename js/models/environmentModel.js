game.ModelEnvironment = Backbone.Model.extend({

		initialize: function (options) {
			return this;
		},

		getRandomLoot: function () {
			var possibleLoot = [];
			
			possibleLoot.push({
				type: 'weapon', 
				quantity:1,
				weight: 2,
			});
			possibleLoot.push({
				type: 'gold',
				quantity:rand(10, 50),
				weight: 30,
			});
			possibleLoot.push({
				type:'gem', 
				quantity:rand(1,2),
				weight: 10,
			});

			/* Containers */
			possibleLoot.push({
				type:'treasure_chest', 
				quantity:1,
				weight: 5
			});
			possibleLoot.push({
				type:'gem_chest', 
				quantity:1,
				weight: 1
			});
			possibleLoot.push({
				type:'weapon_rack', 
				quantity:1,
				weight:1
			});

			var selectedItem = getWeightedRandom(possibleLoot);
			return game.getStaticData().getModel(game.ModelBase.ModelClassItem, selectedItem.type, selectedItem);
		}
});