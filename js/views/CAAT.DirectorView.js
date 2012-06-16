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
    var CAATScene = this.activeSceneView.getScene();
    this.director.addScene(CAATScene);

    // change director to display new scene
    this.director.setScene(this.director.getSceneIndex(CAATScene));

  },

  getScene: function () {
    return this.activeSceneView;
  },

  gameStart: function () {
    this.activeSceneView.trigger('gameStart');
  }

});
