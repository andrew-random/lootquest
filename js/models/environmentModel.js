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
				hasSprite:true
			}));
			possibleLoot.push(new game.ModelItem({
				name: 'Sword', 
				type: 'weapon', 
				quantity:1,
				maxQuantity:2,
				hasSprite:true
			}));
			possibleLoot.push(new game.ModelItem({
				name:'Gem', 
				type:'gem', 
				quantity:rand(1,2),
				maxQuantity:5,
				hasSprite:true
			}));

			possibleLoot.push(new game.ModelItem({
				name:'Chest', 
				type:'treasure_chest', 
				quantity:1,
				childrenTypes:['gold'],
				maxQuantity:300,
				hasSprite:true,
				isContainer:true
			}));

			return possibleLoot[rand(0, possibleLoot.length -1 )];
		}
});