game.CAAT.EntityView = Backbone.View.extend({

	actor 		: null,
	container 	: null,
	zOrder 		: 0,
	ready  		: false,

	initialize: function (options) {

    	this.container = options.container;

    	// entity ready event
    	this.on('entityReady', this.entityReady, this);

    	return this;
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

	initActor: function () {
		// do stuff here
		return this;
	},

	redraw: function () {
		this.expireActor();
		this.render();
	},

	render: function () {

		if (this.actor === null) {
			this.actor = this.initActor();
		}

	    this.container.addChild(this.actor);
	    this.container.setZOrder(this.actor, this.zOrder);

	},

	entityReady: function () {

		// ready
		this.ready = true;

		// do stuff here
		this.render();
	},



});