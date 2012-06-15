game.CAAT.TileView = game.CAAT.EntityView.extend({

  zOrder    : 1000,

  initActor: function () {
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;
    var tilePos     = this.model.getTilePos();


    var tileOffsetLeft  = game.getField().getMinTileWidth() * -1;
    var tileOffsetTop   = game.getField().getMinTileHeight() * -1;
    var posX        = ((tilePos.x + tileOffsetLeft) * tileWidth) + ((tilePos.x + tileOffsetLeft) * tileMargin);
    var posY        = ((tilePos.y + tileOffsetTop) * tileHeight) + ((tilePos.y + tileOffsetTop) * tileMargin);

    var actor = new CAAT.ActorContainer(). 
      enableEvents(true).
      setBounds(posX, posY, tileWidth, tileHeight).
          setFillStyle('#333');

    var label = new CAAT.TextActor().
      setBounds(0, tileHeight / 2, tileWidth, 20).
      setTextAlign('center').
      setBaseline('middle').
      setTextFillStyle('#999').
      enableEvents(false).
      setText(tilePos.x + ', ' + tilePos.y);
    actor.addChild(label);

    // attach to scene
    return actor;

  },


});
