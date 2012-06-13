game.CAAT.DirectorView = Backbone.View.extend({

  activeSceneView : null,
  scenes          : null,
  director        : null,

  // screen properties
  screenWidth  : 640,
  screenHeight : 960,

  // known scenes
  SCENE_DEFAULT   : 'SceneGardenView',
  SCENE_GARDEN    : 'SceneGardenView',

  setScene: function (viewName) {
    
    // clear all existing entities
    game.getRegistry().clearEntities();

    this.activeSceneView = new game.CAAT[viewName]({model:this.model, director:this.director});

    // add new CAAT scene to director
    var CAATScene = this.activeSceneView.getScene();
    this.director.addScene(CAATScene);

    // change director to display new scene
    this.director.setScene(this.director.getSceneIndex(CAATScene));

  },

  getScene: function () {
    return this.activeSceneView;
  },

  initialize: function (options) {
    this.director = new CAAT.Director().initialize(
      this.screenWidth,    // retina width
      this.screenHeight,    // retina height
      this.el);

    if (options && options.scene) {
      this.setScene(options.scene);
    } else {
      this.setScene(this.SCENE_DEFAULT);
    }
    
    // set 20 fps animation
    CAAT.loop(20);

  },

  render: function() {
    console.log('hey');

    return this;
  }

});
