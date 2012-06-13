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
	entities: [],

	addEntity: function (entityType, entity) {
		if (typeof this.entities[entityType] == 'undefined') {
			this.entities[entityType] = [];
		}
		this.entities[entityType].push(entity);
	},

	getEntityByTypeAndId: function (entityType, entityId) {
		if (typeof this.entities[entityType] == 'undefined') {
			return false;
		}
		var count = this.entities[entityType].length;
		while (count--) {
			if (this.entities[entityType][count].getUniqueId() == entityId) {
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
		if (this.entities[entityType] == 'undefined') {
			throw new Exception('No entities of that type');
		}
		return this.entities[entityType];
	},

	getTileEntityByPos: function (posX, posY) {
		var entityType = game.ModelItem.EntityTypeTile;
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
		this.entities = [];
	}

}