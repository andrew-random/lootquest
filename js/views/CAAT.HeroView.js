game.CAAT.HeroView = Backbone.View.extend({

  container     : null,
  actor         : null,

  initialize: function (options) {
    this.container = options.container;
    this.initActor();
  },

  getActor: function () {
    return this.actor;
  },
  
  expireActor: function () {
    if (this.actor !== null) {
      this.actor.setDiscardable(true);
      this.actor.setExpired(true);
      this.actor = null;
   }
  },

  initActor: function () {
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

    // attach to scene
    this.actor = actor;

  },

  redraw: function () {
    this.expireActor();
    this.render();
  },

  render: function () {
    if (!this.actor) {
      this.initActor();
    }
    
    this.container.addChild(this.actor);

  }


});
