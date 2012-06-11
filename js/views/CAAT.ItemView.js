game.CAAT.ItemView = Backbone.View.extend({

  container     : null,
  actor         : null,

  initialize: function (options) {
    this.container = options.container;

    //this.model.on('change change:tilePos', this.redraw, this);
    this.model.on('change change:quantity', this.redraw, this);
  },

  getActor: function () {
    return this.actor;
  },

  expireActor: function () {
    console.log('expireactor', this.model);
    this.actor.setDiscardable(true);
    this.actor.setExpired(true);
    this.actor = null;
  },

  redraw: function () {
    console.log('redraw called');
    this.expireActor();
    this.render();
  },

  render: function () {
    var self        = this;
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;
    var tilePos     = this.model.getTilePos();
    
    if (tilePos) {
   
      var tileEntity  = game.getRegistry().getTileEntityByPos(tilePos.x, tilePos.y);
      var tileEntityActor = tileEntity.getActor();
      var posX        = tileEntityActor.x + tileEntity.container.x;
      var posY        = tileEntityActor.y + tileEntity.container.y;
   
    } else {

      tilePos = {x:0, y:0};
      var posX        = (tilePos.x * tileWidth) + (tilePos.x * tileMargin);
      var posY        = (tilePos.y * tileHeight) + (tilePos.y * tileMargin);
    }

   

    var tileActorContainer = new CAAT.ActorContainer(). 
      setBounds(posX, posY, tileWidth, tileHeight).
      enableDrag(true).
      setFillStyle('blue');
    
    var label = new CAAT.TextActor().
      setBounds(0, tileHeight / 2, tileWidth, 0).
      setTextAlign('center').
      setBaseline('middle').
      enableEvents(false).
      setText(this.model.name).
      setFont('24px Verdana');
    tileActorContainer.addChild(label);

    var quantityLabel = new CAAT.TextActor().
      setBounds(70, 60, 20, 20).
      setFillStyle('#fff').
      setTextAlign('center').
      setTextFillStyle('#000').
      setBaseline('top').
      enableEvents(false).
      setText(this.model.get('quantity'));
    tileActorContainer.addChild(quantityLabel);

    var idLabel = new CAAT.TextActor().
      setPosition(30, 10).
      setTextAlign('center').
      setTextFillStyle('#fff').
      setBaseline('top').
      enableEvents(false).
      setText(this.model.get('uniqueId'));
    tileActorContainer.addChild(idLabel);

    tileActorContainer.mouseUp = function (e) {

      var fieldDimensions = game.getField().getTotalFieldDimensions();

      var tileActors = [];
      var tileEntities = game.getRegistry().getEntitiesByType(game.ModelItem.EntityTypeTile);;
      for (var x in tileEntities) {
          tileActors.push(tileEntities[x].getActor());
      }

      var max = Math.max(fieldDimensions.x, fieldDimensions.y );
      var entitiesCollision = new CAAT.QuadTree().create( self.container.AABB.x,self.container.AABB.y, self.container.width, self.container.height, tileActors );
      var collide = entitiesCollision.getOverlappingActors( new CAAT.Rectangle().setBounds(e.screenPoint.x -5, e.screenPoint.y -5, 10, 10));
      
      var wasPlaced = false;
      for (var x in collide) {

        var entity = game.getRegistry().getEntityByCAATId(collide[x].id, game.ModelItem.EntityTypeTile);
        var tilePos = entity.model.getTilePos();
        if (game.getField().canPlaceItem(self.model, tilePos.x, tilePos.y)) {
            game.getField().placeItem(self.model, tilePos.x, tilePos.y);
            wasPlaced = true;  
        }
        
      }

      if (!wasPlaced) {
        console.log('could not place, reset position', posX, posY);
        tileActorContainer.setLocation(posX, posY);
        return false;
      }
      
    }

    // attach to scene
    this.actor = tileActorContainer;
    
    this.container.addChild(this.actor);

  }


});
