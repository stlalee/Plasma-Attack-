/**
 * @author Connor
 */

var PlasmaAttack = PlasmaAttack || {};
var playerSpeed = 100;
var projectileSpeed = 400;
var plasmaDamage = 20;
var healthPackBonus = 50;
var space = false;

//collision groups
var playerCG;
var allyCG;
var wallsCG;
var oldCG;
var itemCG;
var projCG;

PlasmaAttack.Game = function(){};

window.addEventListener('keyup', function(event) {
	if(event.keyCode == 32){
    	space = true;
    	//console.log("space");
    }
}, false);

PlasmaAttack.Game.prototype = {
  create: function() {
  	this.game.physics.startSystem(Phaser.Physics.P2JS);
  	this.cursors = this.game.input.keyboard.createCursorKeys();
  	this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  	this.game.physics.p2.setImpactEvents(true);
  	
    this.map = this.game.add.tilemap('level1');
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage('rooms', 'level1Tiles');
	
	//collision groups
	playerCG = this.game.physics.p2.createCollisionGroup();
	allyCG = this.game.physics.p2.createCollisionGroup();
	wallsCG = this.game.physics.p2.createCollisionGroup();
	oldCG = this.game.physics.p2.createCollisionGroup();
	itemCG = this.game.physics.p2.createCollisionGroup();
	projCG = this.game.physics.p2.createCollisionGroup();
	
	this.game.physics.p2.updateBoundsCollisionGroup();
	this.game.physics.p2.setBoundsToWorld(true,true,true,true,false); //not working

	this.walls = this.game.physics.p2.convertCollisionObjects(this.map, 'collision', true);
	for (var wall in this.walls){
		this.walls[wall].setCollisionGroup(wallsCG);
		this.walls[wall].collides([playerCG, allyCG, oldCG, projCG]);
	}
	
    //create layer
    this.backgroundlayer = this.map.createLayer('background');

    //resizes the game world to match the layer dimensions
    this.backgroundlayer.resizeWorld();

    //create player
    var result = this.findObjectsByType('playerStart', this.map, 'spawnpoints');
    this.player = new Player(this.game, result[0].x, result[0].y);

    //create healthpack
    healthpacks = this.game.add.group();
    healthpacks.enableBody = true;
    healthpacks.physicsBodyType = Phaser.Physics.P2JS;
    
    result = this.findObjectsByType('healthpack', this.map, 'spawnpoints');
    pack = healthpacks.create(result[0].x, result[0].y, 'bag');
    pack.body.setCollisionGroup(itemCG);
    var self = this;
    pack.body.collides(playerCG, 
    					function(){
    						self.player.gainHealth(healthPackBonus);
    						pack.destroy();
    					});
    
    //create an enemy
    this.enemies = this.game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.P2JS;
    
    result = this.findObjectsByType('spawn', this.map, 'spawnpoints');

    enemy = new Enemy(this.game, result[0].x, result[0].y);

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
        result.push(element);
      }      
    });
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
    
    this.player.update(space);
    space = false;
  },
};

var costToShoot = 10;

Player = function(game, x, y){
	
	Phaser.Sprite.call(this, game, x, y, 'player');
	this.game = game;
	this.facing = "right";
	this.health = 100;
	this.projectiles = [];
	
    game.physics.p2.enable(this);
    
    this.body.setCollisionGroup(playerCG);
    this.body.collides([itemCG, oldCG, wallsCG]);
    this.body.fixedRotation = true;
    //the camera will follow the player in the world
    game.camera.follow(this);
    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(space){
	if(this.body.velocity.x > 0){
		this.facing = "right";
	} else if (this.body.velocity.x < 0){
		this.facing = "left";
	} else if (this.body.velocity.y > 0){
		this.facing = "down";
	} else if (this.body.velocity.y < 0){
		this.facing = "up";
	}
	
	this.projectiles.forEach(function(cur){
		cur.update();
	});
	if(space){
		this.shootPlasma();
	}
};

Player.prototype.shootPlasma = function(){
	if(this.health > costToShoot){
		this.projectiles.push(new Plasma(this.game, 
									this.position.x, 
									this.position.y,
									this.facing));
		this.damage(costToShoot);
	} else {
		//game over
	}
	
};

Plasma = function(game, x, y, dir){
	var self = this;
	Phaser.Sprite.call(this, game, x, y, 'plasma');
	this.game = game;
	game.physics.p2.enable(this);
	game.add.existing(this);
	var vel = new Phaser.Point();
	if(dir == "right") vel.x = projectileSpeed;
	if(dir == "left") vel.x = -projectileSpeed;
	if(dir == "up") vel.y = -projectileSpeed;
	if(dir == "down") vel.y = projectileSpeed;
	this.body.velocity.x += vel.x;
	this.body.velocity.y += vel.y;
	this.body.setCollisionGroup(projCG);
	this.body.collides(oldCG, destroyPlasma, this);
	this.body.collides(wallsCG, destroyPlasma, this);

	game.time.events.add(1750, function(){this.destroy();}, this);
};
Plasma.prototype = Object.create(Phaser.Sprite.prototype);
Plasma.prototype.constructor = Plasma;

function destroyPlasma(body1, body2){
	body1.sprite.destroy();
}

Plasma.prototype.update = function(){
	
};

Player.prototype.takeHit = function(x){
	this.health -= x;
	//console.log(this.health);
};

Player.prototype.gainHealth = function(x){
	this.health += x;
	//console.log(this.health);
};

var enemySpeed = 1;
var enemyEngage = 200;
var enemyDamageTaken = 1;

var Enemy = function(game, x, y){
	this.ally = false;
	this.resting = false;
	this.attackDelay = 1000; //in milliseconds
	this.attackedLast = 0;
	this.interval;
	this.health = 100;
	this.currentPath = [];
	
	Phaser.Sprite.call(this, game, x, y, 'enemy');
	this.game = game;
	game.physics.p2.enable(this);
	game.add.existing(this);
	
	this.body.setCollisionGroup(oldCG);
	this.body.collides([wallsCG]);
	this.body.collides(projCG, this.changeTeams, this);
	this.body.collides(playerCG);
};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.changeTeams = function(){
	var blah = new Ally(this.game, this.x, this.y);
	this.destroy();
};

var Ally = function(game, x, y){
	this.resting = false;
	this.attackDelay = 1000;
	this.attackedLast = 0;
	this.interval;
	this.health = 100;
	
	Phaser.Sprite.call(this, game, x, y, 'ally');
	this.game = game;
	game.physics.p2.enable(this);
	game.add.existing(this);
	
	this.body.setCollisionGroup(allyCG);
	this.body.collides(oldCG);
};
Ally.prototype = Object.create(Phaser.Sprite.prototype);
Ally.prototype.constructor = Ally;