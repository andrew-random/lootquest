game.ModelEnvironment = game.ModelBase.extend({

		defaults: {
			'modelClass': 'environment',
			'name' 		: null,
			'attack' 	: null,
			'defense' 	: null,
			'explored' 	: null
		},

		initNewEnvironment: function () {
			this.set('attack', rand(1, 5));
			this.set('defense', rand(1, 5));
			this.set('explored', 0);
			this.set('name', this.getRandomName());
		},

		getRandomName: function () {
			var nameArray = [];
			var regionName = '';

			var adjective = ['Greasy', 'Grody', 'Grumpy', 'Grim', 'Golden', 'Grande', 'Gilboan'];
			nameArray.push(adjective[rand(0, adjective.length -1)]);

			var placeName = ['Fields', 'Barrens', 'Swamps', 'Foothills', 'Backyard', 'Graves', 'Inn', 'Mansion', 'Barony'];
			nameArray.push(placeName[rand(0, placeName.length -1)]);

			var seperator = ['Of', 'In', 'Around', 'Van', 'Behind', 'Near', 'Far From'];
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
				weight: 2,
			});
			possibleLoot.push({
				type: 'shield',
				modelClass: game.ModelBase.ModelClassEquipmentItem,
				quantity:1,
				weight: 2,
			});
			possibleLoot.push({
				type: 'gold',
				modelClass: game.ModelBase.ModelClassItem,
				quantity:rand(10, 50),
				weight: 30,
			});
			possibleLoot.push({
				type:'gem', 
				modelClass: game.ModelBase.ModelClassItem,
				quantity:rand(1,2),
				weight: 10,
			});

			/* Containers */
			possibleLoot.push({
				type:'treasure_chest', 
				modelClass: game.ModelBase.ModelClassContainerItem,
				quantity:1,
				weight: 3
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

});