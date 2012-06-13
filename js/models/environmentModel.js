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
				maxQuantity: 150,
				weight: 30,
				hasSprite:true
			}));
			possibleLoot.push(new game.ModelItem({
				name: 'Sword', 
				type: 'weapon', 
				quantity:1,
				maxQuantity:1,
				weight: 20,
				hasSprite:true
			}));
			possibleLoot.push(new game.ModelItem({
				name:'Gem', 
				type:'gem', 
				quantity:rand(1,2),
				maxQuantity:5,
				hasSprite:true,
				weight: 10,
			}));

			/* Containers */
			possibleLoot.push(new game.ModelItem({
				name:'Chest', 
				type:'treasure_chest', 
				quantity:1,
				childrenTypes:['gold'],
				maxQuantity:300,
				hasSprite:true,
				isContainer:true,
				weight: 10
			}));
			possibleLoot.push(new game.ModelItem({
				name:'Jewellery', 
				type:'gem_chest', 
				quantity:1,
				childrenTypes:['gem'],
				maxQuantity:15,
				hasSprite:true,
				isContainer:true,
				weight: 1
			}));
			possibleLoot.push(new game.ModelItem({
				name:'Wpn. Rack', 
				type:'weapon_rack', 
				quantity:1,
				childrenTypes:['weapon'],
				maxQuantity:5,
				hasSprite:true,
				isContainer:true,
				weight:5
			}));

			return getWeightedRandom(possibleLoot);
		}
});