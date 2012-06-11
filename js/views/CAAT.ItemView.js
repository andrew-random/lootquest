game.CAAT.ItemView = Backbone.View.extend({

  container     : null,
  actor         : null,
  tileActors    : null,

  initialize: function (options) {
    this.container = options.container;
    this.tileActors = options.tileActors;

    this.model.on('change change:tilePos', this.changeTilePos, this);

  },

  getActor: function () {
    return this.actor;
  },

  changeTilePos: function () {
    this.expireActor();
    this.render();
  },

  expireActor: function () {
    this.actor.setDiscardable(true);
    this.actor.setExpired(true);
    this.actor = null;
  },

  render: function () {
    var self        = this;
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth - 20;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight - 20;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;
    var tilePos     = this.model.getTilePos();
    
    if (!tilePos) {
      tilePos = {x:0, y:0};
    }

    var posX        = (tilePos.x * tileWidth) + (tilePos.x * tileMargin);
    var posY        = (tilePos.y * tileHeight) + (tilePos.y * tileMargin);

    var tileActorContainer = new CAAT.ActorContainer(). 
      setBounds(posX, posY, tileWidth, tileHeight).
      enableDrag(true).
      setFillStyle('blue');
    
    var label = new CAAT.TextActor().
      setBounds(0, tileHeight / 2, tileWidth, 0).
      setTextAlign('center').
      setBaseline('middle').
      enableEvents(false).
      setText(this.model.name);
    tileActorContainer.addChild(label);

    var quantityLabel = new CAAT.TextActor().
      setBounds(50, 40, 20, 20).
      setFillStyle('#fff').
      setTextAlign('center').
      setTextFillStyle('#000').
      setBaseline('top').
      enableEvents(false).
      setText(this.model.quantity);
    tileActorContainer.addChild(quantityLabel);

    tileActorContainer.mouseUp = function (e) {

      var posX = self.container.AABB.x;
      var posY = self.container.AABB.y;
      var fieldDimensions = game.getField().getTotalFieldDimensions();

      var tileActors = [];
      for (var x in self.tileActors) {
          tileActors.push(self.tileActors[x].getActor());
      }
      var max = Math.max(fieldDimensions.x , fieldDimensions.y );
      var entitiesCollision = new CAAT.QuadTree().create( posX,posY, self.container.width, self.container.height, tileActors );
      var collide = entitiesCollision.getOverlappingActors( new CAAT.Rectangle().setBounds(e.screenPoint.x -5, e.screenPoint.y -5, 10, 10));
      
      var wasPlaced = false;
      for (var x in collide) {

        var tilePos = collide[x].gameData.view.model.getTilePos();
        game.getField().placeItem(self.model, tilePos.x, tilePos.y);
        wasPlaced = true;
      }

      if (!wasPlaced) {
        tileActorContainer.setLocation(posX, posY);
        return false;
      }
      
    }

    // attach to scene
    this.actor = tileActorContainer;
    
    this.container.addChild(this.actor);

  }


});
