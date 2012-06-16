game.CAAT.SceneView = Backbone.View.extend({

  director  : null,
  scene     : null,

  initialize: function (options) {
  },

  getSceneActor: function () {
    return this.scene;
  },

  render: function() {
    return this;
  }

});
