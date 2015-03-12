/**
 * @author Connor
 */

var PlasmaAttack = PlasmaAttack || {};
var playerSpeed = 100;
//title screen
PlasmaAttack.Game = function(){};

PlasmaAttack.Game.prototype = {
  create: function() {
  	this.game.physics.startSystem(Phaser.Physics.P2JS);
  	cursors = this.game.input.keyboard.createCursorKeys();
  	this.game.physics.p2.setImpactEvents(true);
  	
    this.map = this.game.add.tilemap('level1');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('rooms', 'gameTiles');
	
	//collision groups
	this.playerCG = this.game.physics.p2.createCollisionGroup();
	this.allyCG = this.game.physics.p2.createCollisionGroup();
	this.wallsCG = this.game.physics.p2.createCollisionGroup();
	this.oldCG = this.game.physics.p2.createCollisionGroup();
	this.itemCG = this.game.physics.p2.createCollisionGroup();
	
	//this.walls = this.game.add.group();
	this.walls = this.game.physics.p2.convertCollisionObjects(this.map, 'collisions', true);
	for (var wall in this.walls){
		this.walls[wall].setCollisionGroup(this.wallsCG);
		this.walls[wall].collides(this.playerCG);
		this.walls[wall].collides(this.allyCG);
		this.walls[wall].collides(this.oldCG);
	}
	
    //create layer
    this.backgroundlayer = this.map.createLayer('background');
    //this.blockedLayer = this.map.createLayer('collisions');

    //collision on blockedLayer
    //this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    //this.createItems();
    //this.createDoors();    

    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'spawnpoints');
    
    this.player = this.game.add.sprite(result.x, result.y, 'player');
    this.game.physics.p2.enable(this.player, false);
    this.player.body.setCollisionGroup(this.playerCG);
    this.player.body.collides([this.itemCG, this.oldCG, this.wallsCG]);
    
    //the camera will follow the player in the world
    this.game.camera.follow(this.player);
    
    
    //create healthpack
    healthpacks = this.game.add.group();
    healthpacks.enableBody = true;
    healthpacks.physicsBodyType = Phaser.Physics.P2JS;
    
    result = this.findObjectsByType('healthpack', this.map, 'spawnpoints');
    pack = healthpacks.create(result[0].x, result[0].y, 'bag');
    pack.body.setCollisionGroup(this.itemCG);
    
    //create an enemy
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.P2JS;
    
    result = this.findObjectsByType('spawn', this.map, 'spawnpoints');
    enemy = this.enemies.create(result[0].x, result[0].y, 'enemy');
    enemy.body.setCollisionGroup(this.oldCG);
    enemy.body.collides([this.playerCG, this.wallsCG, this.allyCG]);
    
    
    

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();

  },
  createItems: function() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;    
    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  },

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    /*var result;
    for(var obj in map.objects[layer]){
    	if(this.map.objects[layer][obj].type == "playerStart"){
    		result.y -= this.map.tileHeight;
    		result = this.map.objects['spawnpoints'][obj];
    	} 
    }
    */
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  update: function() {
    //collision
    
    //player movement
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    if(this.cursors.up.isDown) {
      this.player.body.velocity.y -= playerSpeed;
    }
    else if(this.cursors.down.isDown) {
      this.player.body.velocity.y += playerSpeed;
    }
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= playerSpeed;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += playerSpeed;
    }
  },
};