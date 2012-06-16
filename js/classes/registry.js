/**
 *
 * Registry of all active models/actors
 *
 * Scenes
 *  -> Classes
 *    -> Actors
 * 
 */
game.registry = {

	scenes: [],
	entities: {},

	initialize: function () {
		this.clearEntities();
	},

	addEntity: function (entityType, entity) {
		this.entities[entityType].push(entity);
	},

	getEntityByUniqueId: function (uniqueId, entityType) {
		if (entityType) {
			return this._getEntityByUniqueIdAndType(uniqueId, entityType);
		} else {
			for (var entityType in this.entities) {
				var entity = _getEntityByUniqueIdAndType(uniqueId, entityType);
				if (entity) {
					return entity;
				}
			}
		}
	},
	_getEntityByUniqueIdAndType: function (uniqueId, entityType) {
		if (typeof this.entities[entityType] == 'undefined') {
			return false;
		}
		var count = this.entities[entityType].length;
		while (count--) {
			// does model not have a unique id method? 
			// Fail right out.
			if (typeof this.entities[entityType][count].model.getUniqueId == 'undefined') {
				return false;
			}
			if (this.entities[entityType][count].model.getUniqueId() == uniqueId) {
				return this.entities[entityType][count];
			}
		}
		return false;
	},

	getEntityByCAATId: function (CAATId, entityType) {
		if (entityType) {
			return this._getEntityByCAATIdAndType(CAATId, entityType);
		} else {
			for (var entityType in this.entities) {
				var entity = _getEntityByCAATIdAndType(CAATId, entityType);
				if (entity) {
					return entity;
				}
			}
		}
		
		return false;
	},

	_getEntityByCAATIdAndType: function (CAATId, entityType) {
		if (typeof this.entities[entityType] == 'undefined') {
			return false;
		}
		var count = this.entities[entityType].length;
		while (count--) {
			if (typeof this.entities[entityType][count].actor != 'undefined') {
				if (this.entities[entityType][count].actor.id == CAATId) {
					return this.entities[entityType][count];
				}
				
			}
			
		}
	},

	getEntitiesByType: function (entityType) {
		if (typeof this.entities[entityType] == 'undefined') {
			return [];
			//throw 'No entities of type ' + entityType;
		}
		return this.entities[entityType];
	},

	getTileEntityByPos: function (posX, posY) {
		var entityType = game.EntityTypeTile;
		var count = this.entities[entityType].length;
		while (count--) {
			if (this.entities[entityType][count].model.hasTilePos(posX, posY)) {
				return this.entities[entityType][count];
			}
			
		}
	},

	removeEntityByUniqueId: function (uniqueId, entityType) {
		if (entityType) {
			return this._removeEntityByUniqueIdAndType(uniqueId, entityType);
		} else {
			for (var entityType in this.entities) {
				var result = this._removeEntityByUniqueIdAndType(uniqueId, entityType);
				if (result) {
					return true;
				}
			}
		}
		return false;
	},

	_removeEntityByUniqueIdAndType: function (uniqueId, entityType) {
		var count = this.entities[entityType].length;
		while (count--) {

			// does model not have a unique id method? 
			// Fail right out.
			if (typeof this.entities[entityType][count].model.getUniqueId == 'undefined') {
				return false;
			}

			if (this.entities[entityType][count].model.getUniqueId() == uniqueId) {

				// remove the actor from the scene
				this.entities[entityType][count].expireActor();

				// remove the entity from the registry
				this.entities[entityType].splice(count, 1);

				return true;
			}
		}
		return false;
	},

	clearEntities: function () {
		this.entities[game.EntityTypeTile] = [];
		this.entities[game.EntityTypeItem] = [];
		this.entities[game.EntityTypeHero] = [];
		this.entities[game.EntityTypeMessage] = [];
	}

}