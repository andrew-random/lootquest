// basic items
var data = {};
data['gold'] = {
	name: 'Gold', 
	type: 'gold',
	maxQuantity: 150,
};
data['gem'] = {
	name:'Gem', 
	type:'gem', 
	maxQuantity:5,
}


game.staticData[game.ModelBase.ModelClassItem] = data;

// containers
var data = {};
data['treasure_chest'] = {
	name:'Chest', 
	type:'treasure_chest', 
	childrenTypes:['gold'],
	maxQuantity:300,
}
data['gem_chest'] = {
	name:'Jewellery', 
	type:'gem_chest', 
	childrenTypes:['gem'],
	maxQuantity:15,
}
data['weapon_rack'] = {
	name:'Wpn. Rack', 
	type:'weapon_rack', 
	childrenTypes:['sword'],
	maxQuantity:5,
}
game.staticData[game.ModelBase.ModelClassContainerItem] = data;


// hero homes
var data = {};
data['throne'] = {
	name : 'Throne',
	type : 'throne',
	maxQuantity: 1,
}
game.staticData[game.ModelBase.ModelClassHeroHomeItem] = data;


// weapons
var data = {};
data['sword'] = {
	name: 'Sword', 
	type: 'sword', 
	attackBonus: 1,
	defenseBonus: 0,
	maxQuantity:1,
}
game.staticData[game.ModelBase.ModelClassEquipmentItem] = data;
