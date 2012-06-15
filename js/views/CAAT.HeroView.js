game.CAAT.HeroView = game.CAAT.EntityView.extend({

  path          : null,
  wanderTimeout : null,
  zOrder        : 3000,

  initActor: function () {

    var self = this;
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;

    var tilePos         = this.model.getParentModel().getTilePos();

    var tileEntity      = game.getRegistry().getTileEntityByPos(tilePos.x, tilePos.y);
    var tileEntityActor = tileEntity.getActor();
    var posX = tileEntityActor.x + tileEntity.container.x + 25;
    var posY = tileEntityActor.y + tileEntity.container.y + 20;

    var actor = new CAAT.ActorContainer(). 
      enableEvents(false).
      setBounds(posX, posY, tileWidth, tileHeight);
 
    var label = new CAAT.TextActor().
      setBounds(0, 65, tileWidth, 0).
      setTextAlign('center').
      setBaseline('middle').
      setTextFillStyle('#fff').
      enableEvents(false).
      setText(this.model.get('name')).
      setFont('16px Verdana');
    actor.addChild(label);

    if (this.model.get('hasSprite')) {
      var image = new Image();
      image.src = this.model.getSprite();

      var sprite = new CAAT.SpriteImage();
      sprite.initialize(image, 1, 1);

      var spriteContainer = new CAAT.Actor().
        setBounds(0, 0, tileWidth, tileHeight).
        setBackgroundImage(sprite).
        setScale(.5, .5).
        enableEvents(false);
      
      actor.addChild(spriteContainer);
    }

    return actor;
  },

  entityReady: function () {

    var self = this;

    // ready
    this.ready = true;

    // do stuff here
    this.render();

/*
    this.pathBehaviour = new CAAT.PathBehavior();

    this.actor.addBehavior(this.pathBehaviour);
    this.actor.addListener({
        behaviorExpired : function(behavior, time, actor) {
            self.wander();
        }});*/

   // this.wander();
  },

  wander: function () {
    if (!this.actor) {
        return false;
    }
    var self = this;
    var heroPath = this.buildPath();

    this.pathBehaviour.setFrameTime( game.getDirector().getScene().scene.time, 2000).
        setPath(heroPath);

    this.path = new CAAT.PathActor().
        setBounds(0,0,this.container.width,this.container.height).
        create().
        enableEvents(false).
        setPath(heroPath);

    this.container.addChildImmediately(this.path);
 
  },

  buildPath: function () {
      var heroPath =  new CAAT.Path();
      heroPath.beginPath(this.actor.x, this.actor.y);

      var pathPoints = 0;

      var allItems = game.getRegistry().getEntitiesByType(game.EntityTypeItem);

      // randomize all items
      allItems.sort(function() {return 0.5 - Math.random()});

      var itemsOfInterest = [];
      for (var x in allItems) {
        if (allItems[x].model.hasTilePos()) {
          heroPath.setLinear(this.actor.x, this.actor.y, allItems[x].actor.x, allItems[x].actor.y);
          pathPoints++;
        }
      }
      heroPath.endPath();

      return heroPath;
  }

});
