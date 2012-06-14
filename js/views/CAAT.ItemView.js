game.CAAT.ItemView = Backbone.View.extend({

  container     : null,
  actor         : null,

  initialize: function (options) {
    this.container = options.container;
    this.actor     = null;

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
   
    if (this.model.hasTilePos()) {
      var tilePos = this.model.getTilePos();
      var tileEntity      = game.getRegistry().getTileEntityByPos(tilePos.x, tilePos.y);
      var tileEntityActor = tileEntity.getActor();
      return {
        x: tileEntityActor.x + tileEntity.container.x,
        y: tileEntityActor.y + tileEntity.container.y,
      };

    } else if (this.model.hasParent()) {

      var tilePos = this.model.getParentModel().getTilePos();
      var tileEntity      = game.getRegistry().getTileEntityByPos(tilePos.x, tilePos.y);
      var tileEntityActor = tileEntity.getActor();
      return {
        x: tileEntityActor.x + tileEntity.container.x + 25,
        y: tileEntityActor.y + tileEntity.container.y + 20,
      };


    } else {
      var allItems = game.getRegistry().getEntitiesByType(game.EntityTypeItem);
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
        
    if (!this.model.isHeroBaseItem() && this.model.isChild()) {
      tileActorContainer.setFillStyle('lightblue');
      tileActorContainer.setScale(.5, .5);
      tileActorContainer.enableEvents(false);
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
      setFont('16px Verdana');
    tileActorContainer.addChild(label);

    var quantityLabel = new CAAT.TextActor().
      setPosition(10,10).
      setTextAlign('right').
      setTextFillStyle('#fff').
      setBaseline('top').
      enableEvents(false);
    tileActorContainer.addChild(quantityLabel);

    if (this.model.isContainer()) {
      quantityLabel.setText(this.model.getContainedQuantity() + '/' + this.model.getMaxContainedQuantity());
      if (this.model.getMaxContainedQuantity() == this.model.getContainedQuantity()) {
         quantityLabel.setTextFillStyle('#06ff00');
      }
    } else {
      if (this.model.get('maxQuantity') != 1) {
        quantityLabel.setText(this.model.get('quantity') + '/' + this.model.get('maxQuantity'));
      }
      if (this.model.get('maxQuantity') == this.model.get('quantity')) {
         quantityLabel.setTextFillStyle('#06ff00');
      }
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
      try {
        var tileEntities = game.getRegistry().getEntitiesByType(game.EntityTypeTile);
        for (var x in tileEntities) {
            tileActors.push(tileEntities[x].getActor());
        }
      } catch (exception) {
        // do nothing
      }

      var max = Math.max(fieldDimensions.x, fieldDimensions.y );
      var entitiesCollision = new CAAT.QuadTree().create(self.container.AABB.x,self.container.AABB.y, self.container.width, self.container.height, tileActors);
      var collide = entitiesCollision.getOverlappingActors( new CAAT.Rectangle().setBounds(e.screenPoint.x -5, e.screenPoint.y -5, 10, 10));

      var wasPlaced = false;

      if (collide.length) {

        var targetEntity = collide[0];
        var tileEntity = game.getRegistry().getEntityByCAATId(targetEntity.id, game.EntityTypeTile);
        var tilePos = tileEntity.model.getTilePos();

        if (tileEntity.model.hasItemModel() && tileEntity.model.getItemModel().getUniqueId() == self.model.getUniqueId()) {

          // if the item is placed back on it's own tile, do nothing.
          wasPlaced = false;

        } else if (tileEntity.model.canPlaceNewItem(self.model)) {

          // move an item to an empty tile
          game.getField().placeNewItem(self.model, tilePos.x, tilePos.y);
          wasPlaced = true;

        } else if (tileEntity.model.canAddToItem(self.model)) {

          // add two of the same items together, or add children to a container
          game.getField().addToItem(self.model, tilePos.x, tilePos.y);

          var containerItemModel = game.getRegistry().getEntityByUniqueId(tileEntity.model.getItemModel().getUniqueId(), game.EntityTypeItem);
          if (containerItemModel) {
            // redraw container
            containerItemModel.redraw();
          }

          wasPlaced = true;

        }
        
      }

      if (!wasPlaced) {
        tileActorContainer.setLocation(canvasPos.x, canvasPos.y);
      }

      // Re-draw all children of this element
      if (self.model.hasChildren()) {

          var childUniqueIds = self.model.getChildren();

          var count = childUniqueIds.length;
          while (count--) {
          var childEntity = game.getRegistry().getEntityByUniqueId(childUniqueIds[count], game.EntityTypeItem);
            if (childEntity) {
              childEntity.redraw();
            }
          }
      }

      // Re-draw heroes
      if (self.model.isHeroBaseItem()) {
        var heroEntity = game.getRegistry().getEntityByUniqueId(self.model.getHeroUniqueId(), game.EntityTypeHero);
        if (heroEntity) {
          heroEntity.redraw();
        }
      }
      
    }

    // attach to scene
    this.actor = tileActorContainer;
    
    this.container.addChild(this.actor);

  }


});
