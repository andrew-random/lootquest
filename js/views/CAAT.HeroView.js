game.CAAT.HeroView = game.CAAT.EntityView.extend({

  path          : null,
  wanderTimeout : null,
  zOrder        : 3000,
  statusBox     : null,
  statusBoxTimeout : null,

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

    var speechBubble = new CAAT.ActorContainer();
    actor.addChild(speechBubble);

    var timer = new CAAT.TextActor().
      setBounds(65, 20, 70, 15).
      setTextAlign('left').
      setBaseline('top').
      setTextFillStyle('#000').
      setFillStyle('#fff').
      enableEvents(false).
      setText(this.model.getAdventureCooldownSecondsRemaining()).
      setFont('12px Verdana');
    speechBubble.addChild(timer);

    game.getDirector().getScene().getSceneActor().createTimer(
              0,
              Number.MAX_VALUE,
              function(scene_time, timer_time, timertask_instance)  {   // timeout
              },
              function(scene_time, timer_time, timertask_instance)  {   // tick

                self.model.calcStatus();

                if (self.model.canAdventure()) {
                  timer.setText('I am ready!');
                } else {
                  timer.setText(formatSecondsRemaining(self.model.getAdventureCooldownSecondsRemaining()));
                }
              },
              function(scene_time, timer_time, timertask_instance)  {   // cancel
              }
    )


    return actor;
  },

  entityReady: function () {

    this._baseEntityReady();
    
    this.model.on('change:status', this.showStatus, this);
    this.model.on('change:level', this.levelUp, this);
    
    this.showStatus();

  },

  showStatus: function () {

    var self = this;

    if (this.statusBox !== null) {
      this.statusBox.setExpired(true).setDiscardable(true);
      this.statusBox = null;
    }

    this.statusBox = new CAAT.ActorContainer().setBounds(0, 0, 60, 20).setFillStyle('#ccc');

     var statusText = new CAAT.TextActor().
      setPosition(3, 3, 0, 20).
      setTextAlign('left').
      setBaseline('top').
      setTextFillStyle('#000').
      enableEvents(false).
      setText(this.model.getStatus()).
      setFont('12px Verdana');
    this.statusBox.addChild(statusText);

    this.actor.addChildImmediately(this.statusBox);

    this.statusBoxTimeout = setTimeout(function () {
      if (self.statusBox) {
        self.statusBox.setExpired(true).setDiscardable(true);
        self.statusBox = null;
      }
    }, 2000);

  },

  levelUp: function () {
    var messageItem = new game.ModelMessage();
      messageItem.setMessageType(game.ModelMessage.MessageTypePopup);
      messageItem.setMessageTitle(this.model.get('name') + " is now Level " + this.model.get('level') + '!');
      messageItem.setMessage("His stats are now Atk:" + this.model.getAttack() + ', Def:' + this.model.getDefense());
      messageItem.setHideAfter(false);
      game.getMessenger().addMessage(messageItem);
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
