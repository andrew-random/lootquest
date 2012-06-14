/*
	Class constants:
		TileWidth
		TileHeight
		TileMargin		
*/
game.CAAT.SceneGardenView = game.CAAT.SceneView.extend({

	initialize: function (options) {

		// events
		this.model.on('newLoot', this.newLoot, this);
		this.model.on('adventureComplete', this.adventureComplete, this);

		this.director = options.director;

		this.scene = new CAAT.Scene();
		this.scene.setFillStyle('#ccc');

		this.tileContainer = new CAAT.ActorContainer().
		  setBounds(30, 100, 580, 480).setFillStyle('green');
		this.scene.addChild(this.tileContainer);

		// add all tiles as entities
		this.model.getTileCollection().each(function (tileModel) {
			var tileView = new game.CAAT.TileView({
				container 	: this.tileContainer, 
				model 		: tileModel
			});
			tileView.render();
			game.getRegistry().addEntity(game.EntityTypeTile, tileView);
		}, this);

		// add existing items as entities
		this.model.getItemCollection().each(function (itemModel) {
			var itemView = new game.CAAT.ItemView({
				container 	: this.scene, 
				model 		: itemModel
			});
			itemView.redraw();
			game.getRegistry().addEntity(game.EntityTypeItem, itemView);
		}, this);

		// add existing items as entities
		game.getHeroes().each(function (heroModel) {
			var heroView = new game.CAAT.HeroView({
				container 	: this.scene, 
				model 		: heroModel
			});
			heroView.redraw();
			game.getRegistry().addEntity(game.EntityTypeHero, heroView);
		}, this);

		var adventureButton = new CAAT.ActorContainer().setBounds(500, 20, 100, 40).setFillStyle('#eee');
		adventureButton.mouseUp = function () {
			var hero = game.getHero()
			if (hero.canAdventure()) {
				// adventure!
				game.adventureInEnvironment(hero, new game.ModelEnvironment());

			}

			adventureCountDown.setText(hero.getAdventureCooldownSecondsRemaining());
			

		}
		var adventureLabel = new CAAT.TextActor().
	      setBounds(30, 15, 20, 20).
	      setTextAlign('center').
	      setTextFillStyle('#000').
	      setBaseline('top').
	      enableEvents(false).
	      setText('ADVENTURE');
	    adventureButton.addChild(adventureLabel);

	    var adventureCountDown = new CAAT.TextActor().
	      setBounds(27, 30, 20, 20).
	      setTextAlign('center').
	      setTextFillStyle('#333').
	      setBaseline('top').
	      enableEvents(false).
	      setText('Ready');
	    adventureButton.addChild(adventureCountDown);

		this.scene.addChild(adventureButton);

		/*this.scene.createTimer(
            0,
            Number.MAX_VALUE,
            function(scene_time, timer_time, timertask_instance)  {   // timeout
            	
            },
            function(scene_time, timer_time, timertask_instance)  {   // tick
            	try {
	      			var entities = game.getRegistry().getEntitiesByType(game.EntityTypeItem);
	            	var count = entities.length;
	            	while (count--) {
	            		entities[count].redraw();
	            	}
            	} catch (exception) {
            	} 
            },
            function(scene_time, timer_time, timertask_instance)  {   // cancel
            }
    	)*/
		
	},

	newLoot: function (itemModel) {
		var itemView = new game.CAAT.ItemView({
				container 	: this.scene, 
				model 		: itemModel
		});
		game.getRegistry().addEntity(game.EntityTypeItem, itemView);
	},
	adventureComplete: function () {
		var entities = game.getRegistry().getEntitiesByType(game.EntityTypeItem);
		var count = entities.length;
		while (count--) {
			entities[count].redraw();
		}
	},

	render: function() {
		return this;
	}

});

game.CAAT.SceneGardenView.tileWidth			= 100;
game.CAAT.SceneGardenView.tileHeight		= 80;
game.CAAT.SceneGardenView.tileMargin		= 20;