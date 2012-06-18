game.CAAT.DirectorView = Backbone.View.extend({

  activeSceneView : null,
  scenes          : null,
  director        : null,

  // known scenes
  SCENE_DEFAULT   : 'SceneGardenView',
  SCENE_GARDEN    : 'SceneGardenView',

  initialize: function (options) {

    // events
    this.on('gameStart', this.gameStart, this);

    this.director = new CAAT.Director().initialize(
      game.screenWidth,     // retina width
      game.screenHeight,    // retina height
      this.el);

    if (options && options.scene) {
      this.setScene(options.scene);
    } else {
      this.setScene(this.SCENE_DEFAULT);
    }
    
    this.loadImages();

    // set 20 fps animation
    CAAT.loop(20);

    return this;
  },

  setScene: function (viewName) {
    
    // clear all existing entities
    game.getRegistry().clearEntities();

    this.activeSceneView = new game.CAAT[viewName]({
        model     : this.model
    });

    // add new CAAT scene to director
    var CAATScene = this.activeSceneView.getSceneActor();
    this.director.addScene(CAATScene);

    // change director to display new scene
    this.director.setScene(this.director.getSceneIndex(CAATScene));

  },

  getScene: function () {
    return this.activeSceneView;
  },

  gameStart: function () {

    this.activeSceneView.trigger('gameStart');
  },

  /**
   *  The director preloads our sprites
   */
  loadImages: function (entityId) {
    var self = this;
    var preloadImages = [];

    var staticData = game.getStaticData().getData();
    
    for (var className in staticData) {
     for (var modelType in staticData[className]) {
        var modelClass = className.replace('Model', '');
        
        switch (className) {

          case game.ModelBase.ModelClassContainerItem:
            preloadImages.push({id:modelClass + modelType, url:'images/item/container/' + modelType + '.png'});
            break;

          case game.ModelBase.ModelClassHeroHomeItem:
            preloadImages.push({id:modelClass + modelType, url:'images/item/hero_home/' + modelType + '.png'});
            break;

          case game.ModelBase.ModelClassCompanionHomeItem:
            preloadImages.push({id:modelClass + modelType, url:'images/item/companion_home/' + modelType + '.png'});
            break;

          case game.ModelBase.ModelClassEquipmentItem:
            preloadImages.push({id:modelClass + modelType, url:'images/item/equipment/' + modelType + '.png'});
            break;

          case game.ModelBase.ModelClassItem:
            preloadImages.push({id:modelClass + modelType, url:'images/item/' + modelType + '.png'});
            break;

          case game.ModelBase.ModelClassCompanion:
            preloadImages.push({id:modelClass + modelType, url:'images/companion/' + modelType + '.png'});
            break;

          default:
            preloadImages.push({id:modelClass + modelType, url:'images/' + modelClass + '/' + modelType + '.png'});
            break;
        }
      }
    }

    var loadingMessage = new game.ModelMessage();
    loadingMessage.setMessageTitle('Loading Images');
    loadingMessage.setMessage('One moment');
    game.getMessenger().addMessage(loadingMessage);

    new CAAT.ImagePreloader().loadImages(
        preloadImages,
        function( counter, images ) {

          self.director.setImagesCache(images);

          if (counter == preloadImages.length) {
            game.getMessenger().removeMessage(loadingMessage);
          }
        }
    );
  }

});
