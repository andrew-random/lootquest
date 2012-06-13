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
    if (this.actor !== null) {
      this.actor.setDiscardable(true);
      this.actor.setExpired(true);
      this.actor = null;
   }
  },

  getCanvasPos: function () {
    var tilePos = this.model.getTilePos();
    if (tilePos) {
      var tileEntity      = game.getRegistry().getTileEntityByPos(tilePos.x, tilePos.y);
      var tileEntityActor = tileEntity.getActor();
      return {
        x: tileEntityActor.x + tileEntity.container.x,
        y: tileEntityActor.y + tileEntity.container.y,
      }

    } else {
      var allItems = game.getRegistry().getEntitiesByType(game.ModelItem.EntityTypeItem);
      var leftOffset = 0;
      for (var x in allItems) {
        if (!allItems[x].model.hasTilePos()) {
          leftOffset++;
        }
      }
      tilePos = {x:leftOffset, y:0};

      return {
        x: (tilePos.x * game.CAAT.SceneGardenView.tileWidth) + (tilePos.x * game.CAAT.SceneGardenView.tileMargin),
        y: (tilePos.y * game.CAAT.SceneGardenView.tileHeight) + (tilePos.y * game.CAAT.SceneGardenView.tileMargin),
      };
    }
  },

  redraw: function () {
    this.expireActor();
    this.render();
  },

  render: function () {
    var self        = this;
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;
    var tilePos     = this.model.getTilePos();
    var canvasPos   = this.getCanvasPos();
   

    var tileActorContainer = new CAAT.ActorContainer(). 
      setBounds(canvasPos.x, canvasPos.y, tileWidth, tileHeight).
      setFillStyle('#515151').
      enableDrag(true);
  
    if (this.model.isContainer()) {
      tileActorContainer.setFillStyle('navyblue')
    } else if (this.model.isChild()) {
      tileActorContainer.setSize(30, 30);
      tileActorContainer.setFillStyle('lightblue');
    }
    
    if (this.model.get('hasSprite')) {
      var image = new Image();
      image.src = self.model.getSprite();

      var sprite = new CAAT.SpriteImage();
      sprite.initialize(image, 1, 1);

      var spriteContainer = new CAAT.Actor().
        setBounds(0, 0, tileWidth, tileHeight).
        setBackgroundImage(sprite).
        setScale(.5, .5).
        enableEvents(false);
      
      tileActorContainer.addChild(spriteContainer);
    }

    var label = new CAAT.TextActor().
      setBounds(0, 65, tileWidth, 0).
      setTextAlign('center').
      setBaseline('middle').
      setTextFillStyle('#fff').
      enableEvents(false).
      setText(this.model.get('name')).
      setFont('18px Verdana');
    tileActorContainer.addChild(label);

    var quantityLabel = new CAAT.TextActor().
      setPosition(10,10).
      setTextAlign('right').
      setTextFillStyle('#fff').
      setBaseline('top').
      enableEvents(false).
      setText(this.model.get('quantity') + '/' + this.model.get('maxQuantity'));
    tileActorContainer.addChild(quantityLabel);
    
    if (this.model.get('maxQuantity') == this.model.get('quantity')) {
        quantityLabel.setTextFillStyle('#06ff00');
    }

    var idLabel = new CAAT.TextActor().
      setPosition(80, 60).
      setTextAlign('right').
      setTextFillStyle('#fff').
      setBaseline('top').
      enableEvents(false).
      setText(this.model.getUniqueId());
    tileActorContainer.addChild(idLabel);



    tileActorContainer.mouseUp = function (e) {

      var fieldDimensions = game.getField().getTotalFieldDimensions();

      var tileActors = [];
      var tileEntities = game.getRegistry().getEntitiesByType(game.ModelItem.EntityTypeTile);
      for (var x in tileEntities) {
          tileActors.push(tileEntities[x].getActor());
      }

      var max = Math.max(fieldDimensions.x, fieldDimensions.y );
      var entitiesCollision = new CAAT.QuadTree().create(self.container.AABB.x,self.container.AABB.y, self.container.width, self.container.height, tileActors);
      var collide = entitiesCollision.getOverlappingActors( new CAAT.Rectangle().setBounds(e.screenPoint.x -5, e.screenPoint.y -5, 10, 10));

      var wasPlaced = false;

      if (collide.length) {

        var targetEntity = collide[0];
        var tileEntity = game.getRegistry().getEntityByCAATId(targetEntity.id, game.ModelItem.EntityTypeTile);
        var tilePos = tileEntity.model.getTilePos();

        if (tileEntity.model.hasItemModel() && tileEntity.model.getItemModel().getUniqueId() == self.model.getUniqueId()) {

            // if the item is placed back on it's own tile, do nothing.
            wasPlaced = false;
            return false;

        } else if (tileEntity.model.canPlaceNewItem(self.model)) {

          // move an item to an empty tile
          game.getField().placeNewItem(self.model, tilePos.x, tilePos.y);
          return true;

        } else if (tileEntity.model.canAddToItem(self.model)) {

          // add two of the same items together, or add children to a container
          game.getField().addToItem(self.model, tilePos.x, tilePos.y);
          return true;

        }
        
      }

      if (!wasPlaced) {
        tileActorContainer.setLocation(canvasPos.x, canvasPos.y);
        return false;
      }
      
    }

    // attach to scene
    this.actor = tileActorContainer;
    
    this.container.addChild(this.actor);

  }


});
