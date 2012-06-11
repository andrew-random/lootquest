game.CAAT.TileView = Backbone.View.extend({

  container     : null,
  actor         : null,

  initialize: function (options) {
    this.container = options.container;
    this.initActor();
  },

  getActor: function () {
    return this.actor;
  },

  initActor: function () {
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;
    var tilePos     = this.model.getTilePos();

    var posX        = (tilePos.x * tileWidth) + (tilePos.x * tileMargin);
    var posY        = (tilePos.y * tileHeight) + (tilePos.y * tileMargin);

    var actor = new CAAT.ActorContainer(). 
      enableEvents(true).
      setBounds(posX, posY, tileWidth, tileHeight).
          setFillStyle('#333');

    var label = new CAAT.TextActor().
      setBounds(0, tileHeight / 2, tileWidth, 20).
      setTextAlign('center').
      setBaseline('middle').
      enableEvents(false).
      setText('empty');
    actor.addChild(label);

    actor.mouseDown = function (e) {
      label.setText('CLicked');
    };

    // attach to scene
    this.actor = actor;

  },

  render: function () {
    if (!this.actor) {
      this.initActor();
    }
    
    this.container.addChild(this.actor);

  }


});
