var data = {};

data['gold'] = {
	name: 'Gold', 
	type: 'gold',
	maxQuantity: 150,
};
data['weapon'] = {
	name: 'Sword', 
	type: 'weapon', 
	maxQuantity:1,
}
data['gem'] = {
	name:'Gem', 
	type:'gem', 
	maxQuantity:5,
}

/* Containers */
data['treasure_chest'] = {
	name:'Chest', 
	type:'treasure_chest', 
	childrenTypes:['gold'],
	maxQuantity:300,
	isContainer:true,
}
data['gem_chest'] = {
	name:'Jewellery', 
	type:'gem_chest', 
	childrenTypes:['gem'],
	maxQuantity:15,
	isContainer:true,
}
data['weapon_rack'] = {
	name:'Wpn. Rack', 
	type:'weapon_rack', 
	childrenTypes:['weapon'],
	maxQuantity:5,
	isContainer:true,
}

game.staticData[game.ModelBase.ModelClassItem] = data;

var data = {};
data['throne'] = {
	name : 'Throne',
	type : 'hero_throne',
	maxQuantity: 1,
}
game.staticData[game.ModelBase.ModelClassHeroHomeItem] = data;
