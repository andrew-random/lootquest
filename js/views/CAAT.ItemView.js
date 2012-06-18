game.CAAT.ItemView = game.CAAT.EntityView.extend({

  zOrder    : 2000,
  quantityActor: null,

  entityReady: function () {
    this._baseEntityReady();

    this.model.on('change:quantity', this.updateQuantity, this);
    this.model.on('change:children', this.updateQuantity, this);
    this.model.on('change:tilepos', this.moveActor, this);

  },

  moveActor: function () {
    if (this.actor !== null) {
      var canvasPos = this.getCanvasPos();
      this.actor.setPosition(canvasPos.x, canvasPos.y);

      if (this.model.isNew()) {
        this.actor.setFillStyle('gold');
      } else if (!this.model.isHeroHomeItem() && this.model.hasParent()) {
        this.actor.setFillStyle('lightblue');
        this.actor.setScale(.5, .5);
        this.actor.enableEvents(false);
      } else {
        this.actor.setFillStyle('#515151');
      }
    }
  },

  updateQuantity: function () {
    if (this.model.getMaxQuantity() != 1) {
      this.quantityActor.setText(this.model.getQuantity() + '/' + this.model.getMaxQuantity());
      if (this.model.getMaxQuantity() == this.model.getQuantity()) {
         this.quantityActor.setTextFillStyle('#06ff00');
      }
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

  initActor: function () {

    var self        = this;
    var tileWidth   = game.CAAT.SceneGardenView.tileWidth;
    var tileHeight  = game.CAAT.SceneGardenView.tileHeight;
    var tileMargin  = game.CAAT.SceneGardenView.tileMargin;
    var tilePos     = this.model.getTilePos();
    var canvasPos   = this.getCanvasPos();

    var actor = new CAAT.ActorContainer(). 
      setBounds(canvasPos.x, canvasPos.y, tileWidth, tileHeight).
      enableDrag(true);

    if (this.model.isNew()) {
      actor.setFillStyle('gold');
    } else if (!this.model.isHeroHomeItem() && this.model.hasParent()) {
      actor.setFillStyle('lightblue');
      actor.setScale(.5, .5);
      actor.enableEvents(false);
    } else {
      actor.setFillStyle('#515151');
    }
    
    var image = new Image();
    image.src = self.model.getSprite();

    var sprite = new CAAT.SpriteImage();
    sprite.initialize(image, 1, 1);

    var spriteContainer = new CAAT.Actor().
      setBounds(0, 0, tileWidth, tileHeight).
      setBackgroundImage(sprite).
      setScale(.5, .5).
      enableEvents(false);
    
    actor.addChild(spriteContainer);
  

    var label = new CAAT.TextActor().
      setBounds(0, 65, tileWidth, 0).
      setTextAlign('center').
      setBaseline('middle').
      setTextFillStyle('#fff').
      enableEvents(false).
      setText(this.model.get('name')).
      setFont('16px Verdana');
    actor.addChild(label);

    this.quantityActor = new CAAT.TextActor().
      setPosition(10,10).
      setTextAlign('right').
      setTextFillStyle('#fff').
      setBaseline('top').
      enableEvents(false);
    actor.addChild(this.quantityActor);

    if (this.model.getMaxQuantity() != 1) {
      this.quantityActor.setText(this.model.getQuantity() + '/' + this.model.getMaxQuantity());
    }
    if (this.model.getMaxQuantity() == this.model.getQuantity()) {
       this.quantityActor.setTextFillStyle('#06ff00');
    }

    actor.mouseUp = function (e) {

      var tileActors = [];
      try {
        var tileEntities = game.getRegistry().getEntitiesByType(game.EntityTypeTile);
        for (var x in tileEntities) {
          tileActors.push(tileEntities[x].getActor());
        }
      } catch (exception) {
        // do nothing
      }

      var entitiesCollision = new CAAT.QuadTree().create(0, 0, game.screenWidth, game.screenHeight, tileActors);
      var collide = entitiesCollision.getOverlappingActors( new CAAT.Rectangle().setBounds(e.screenPoint.x -5, e.screenPoint.y -5, 10, 10));

      var wasPlaced = false;

      if (collide.length) {

        var targetEntity = collide[0];
        var tileEntity = game.getRegistry().getEntityByCAATId(targetEntity.id, game.EntityTypeTile);
        var tilePos = tileEntity.model.getTilePos();

        if (tileEntity.model.hasItemModel() && tileEntity.model.getItemModel().getUniqueId() == self.model.getUniqueId()) {

          // if the item is placed back on it's own tile, do nothing.

        } else if (tileEntity.model.canPlaceNewItem(self.model)) {

          // move an item to an empty tile
          game.getField().placeNewItem(self.model, tilePos.x, tilePos.y);

        } else if (tileEntity.model.canAddToItem(self.model)) {

          // add two of the same items together, or add children to a container
          game.getField().addToItem(self.model, tilePos.x, tilePos.y);

        }
        
      }

      // replace actor
      self.moveActor();

      // Re-draw all children of this element
      if (self.model.isContainerItem()) {

          var childUniqueIds = self.model.getChildren();

          var count = childUniqueIds.length;
          while (count--) {
          var childEntity = game.getRegistry().getEntityByUniqueId(childUniqueIds[count], game.EntityTypeItem);
            if (childEntity) {
              childEntity.redraw();
            }
          }
      }

      // Re-draw heroess
      if (self.model.isHeroHomeItem()) {
        var heroEntity = game.getRegistry().getEntityByUniqueId(self.model.getHeroUniqueId(), game.EntityTypeHero);
        if (heroEntity) {
          heroEntity.redraw();
        }
      }
      
    }

    actor.mouseClick = function () {
      if (self.model.isHeroHomeItem()) {
          var heroDetailView = game.getDirector().getScene().getHeroDetailView();
          heroDetailView.setModel(self.model.getHeroModel());
          heroDetailView.show();
      }
    }

    // attach to scene
    return actor;

  }


});
