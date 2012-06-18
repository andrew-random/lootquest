game.ModelEnvironment = game.ModelBase.extend({

		defaults: {
			'modelClass': 'environment',
			'name' 		: null,
			'attack' 	: null,
			'defense' 	: null,
			'explored' 	: null,
			'rewardItem': null,
		},

		initNewEnvironment: function () {

			this.set('attack', rand(1, 10));
			this.set('defense', rand(1, 10));
			this.set('explored', 0);
			this.set('name', this.getRandomName());
			this.set('rewardItem', {itemClass:game.ModelBase.ModelClassItem, type:'gem', options:{quantity:1}});
		},

		getRandomName: function () {
			var nameArray = [];
			var regionName = '';

			var adjective = [
				'Angry', 'Abrasive', 'Abysmal', 'Artful', 'Aggrevious', 'Agitaged',
				'Beastly', 'Broken', 'Bent', 'Benevolent', 'Brittle', 'Brutal',
				'Canny', 'Crafty', 'Chill', 'Cutting',
				'Greasy', 'Grody', 'Grumpy', 'Grim', 'Golden', 'Grande', 'Gilboan', 'Ghastly', 
				'Hideous', 'Horrible', 'Hungry', 'Hateful', 'Hurtful', 'Haunted', 'Hunted', 'Habeus',
				'Piercing', 'Pushy', 'Protruding', 'Porcine',
				'Menacing', 'Mean', 'Mincing', 'Meritous', 'Meagre', 'Mighty', 'Muscular'
			];
			nameArray.push(adjective[rand(0, adjective.length -1)]);

			var placeName = [
				'Barony', 'Barrens', 'Bracken', 'Backyard', 'Butchery',
				'Cake Shop', 'Cafeteria',
				'Fields', 'Foothills', 'Forest', 'Fen',
				'Hall', 'Hallroom', 'Heath',
				'Lunchroom',
				'Swamps', 'Streets', 'Stumps', 
				'Graves', 'Gutters', 'Greasepit',
				'Inn', 'Infield', 
				'Mansion', 'Manor', 'Mountains', 'Market', 'Marsh', 'Mesas',
				];
			nameArray.push(placeName[rand(0, placeName.length -1)]);

			var seperator = ['Of', 'In', 'Around', 'Van', 'Behind', 'Before', 'Near', 'Far From'];
			nameArray.push(seperator[rand(0, seperator.length -1)]);

			var regionNameFirst = ['North', 'South', 'West', 'East', 'Mar', 'Gia', 'Fra', 'Atko', 'Kwan', 'Repo', 'Qua', 'Crom', 'Narm', 'Boa', 'Middle', 'Upper'];
			regionName = regionNameFirst[rand(0, regionNameFirst.length -1)];

			var regionNameLast = ['Teris', 'Burgh', 'Berg', 'Field', 'Hall', 'Stoop', 'Castle', '`nata', 'City', 'Woods', 'OldeWoods', 'Moor', 'Top', 'Ville'];
			regionName += regionNameLast[rand(0, regionNameLast.length -1)];
			nameArray.push(regionName);

			return nameArray.join(' ');
		},

		getRandomLoot: function () {
			var possibleLoot = [];
			
			possibleLoot.push({
				type: 'sword',
				modelClass: game.ModelBase.ModelClassEquipmentItem,
				quantity:1,
				weight: 6,
			});
			possibleLoot.push({
				type: 'axe',
				modelClass: game.ModelBase.ModelClassEquipmentItem,
				quantity:1,
				weight: 3,
			});
			possibleLoot.push({
				type: 'shield',
				modelClass: game.ModelBase.ModelClassEquipmentItem,
				quantity:1,
				weight: 4,
			});
			possibleLoot.push({
				type: 'gold',
				modelClass: game.ModelBase.ModelClassItem,
				quantity:rand(10, 30),
				weight: 30,
			});

			/* Containers */
			possibleLoot.push({
				type:'treasure_chest', 
				modelClass: game.ModelBase.ModelClassContainerItem,
				quantity:1,
				weight: 2
			});
			possibleLoot.push({
				type:'gem_chest', 
				modelClass: game.ModelBase.ModelClassContainerItem,
				quantity:1,
				weight: 1
			});
			possibleLoot.push({
				type:'weapon_rack', 
				modelClass: game.ModelBase.ModelClassContainerItem,
				quantity:1,
				weight:1
			});

			var selectedItem = getWeightedRandom(possibleLoot);
			return game.getStaticData().getModel(selectedItem.modelClass, selectedItem.type, selectedItem);
		},

		getDefense: function () {
			return this.get('defense');
		},

		getAttack: function () {
			return this.get('attack');
		},

		incrementExploration: function (value) {
			this.set('explored', this.get('explored') + value);

			if (this.get('explored') >= 100) {
				
				var environmentComplete = new game.ModelMessage();
			    environmentComplete.setMessageTitle('You are done with ' + this.get('name') + '!');
			    environmentComplete.setMessage('There is nothing more to learn here.'); 
			    game.getMessenger().addMessage(environmentComplete);

				// reward user
				if (this.get('rewardItem')) {
					var reward = this.get('rewardItem');
					var rewardItem = game.getStaticData().getModel(reward.itemClass, reward.type, reward.options);
					game.getField().placeInRandomTile(rewardItem);
					game.getField().addItemModel(rewardItem);
				}

				// remove environment
				game.getEnvironments().removeEnvironment(this);

				// generate new environment
				game.getEnvironments().addEnvironment(game.getEnvironments().generateRandomEnvironment());

			}
		},

});