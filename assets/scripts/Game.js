/**
 * @author Connor
 */

var PlasmaAttack = PlasmaAttack || {};
var playerSpeed = 200;
var projectileSpeed = 400;
var plasmaDamage = 20;
var healthPackBonus = 50;
var space = false;
var thresholdToPlayer = 300;
var thresholdToEnemy = 200;

var player;
var enemies = [];
var allies = [];
//collision groups
var playerCG;
var allyCG;
var wallsCG;
var oldCG;
var itemCG;
var projCG;

var numEnemies;
var numLvls = 4;
var level = 1;
var skip = false;

PlasmaAttack.Game = function(){};

window.addEventListener('keyup', function(event) {
	if(event.keyCode == 32){
    	space = true;
    	//console.log("space");
    }
    if(event.keyCode == 83){
    	skip = true;
    }
}, false);

PlasmaAttack.Game.prototype = {
  init: function(lvl){
	enemies = [];
	allies = [];
  	this.levelString = 'level1';
  	this.tileSetString = 'level1Tiles';
  	this.tileString = 'room';
  	switch(lvl){
  		case 2:
  			level = lvl;
  			this.levelString = "level2";
  			this.tileSetString = "level2Tiles";
  			this.musicString = "grunge";
  			numEnemies = 2; 
  			break;
  		case 3:
  			level = lvl;
  			this.levelString = "level3";
  			this.tileSetString = "level3Tiles";
  			this.musicString = "grunge";
  			numEnemies = 2; 
  			break;
  		case 4:
  			level = lvl;
  			this.levelString = "level4";
  			this.tileSetString = "level4Tiles";
  			this.musicString = "grunge";
  			numEnemies = 3; 
  			break;
  		default:
  			level = 1;
		  	this.levelString = 'level1';
		  	this.tileSetString = 'level1Tiles';
  			this.musicString = "grunge";
		  	this.tileString = 'room';
  			numEnemies = 2; 
  			
  			break;
  	}
  	
  },
  create: function() {
  	this.game.physics.startSystem(Phaser.Physics.P2JS);
  	this.cursors = this.game.input.keyboard.createCursorKeys();
  	this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  	this.game.physics.p2.setImpactEvents(true);
  	
    this.map = this.game.add.tilemap(this.levelString);
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.map.addTilesetImage(this.tileString, this.tileSetString);
	
	//sounds
	this.game.hurt = this.game.add.audio('playerOw');
	this.game.deathSound = this.game.add.audio('deathSound');
	this.game.healthPack = this.game.add.audio('heathPack');
	this.game.plasmaSplat = this.game.add.audio('plasmaSplat');
	
	//collision groups
	playerCG = this.game.physics.p2.createCollisionGroup();
	allyCG = this.game.physics.p2.createCollisionGroup();
	wallsCG = this.game.physics.p2.createCollisionGroup();
	oldCG = this.game.physics.p2.createCollisionGroup();
	itemCG = this.game.physics.p2.createCollisionGroup();
	projCG = this.game.physics.p2.createCollisionGroup();
	
	this.game.physics.p2.updateBoundsCollisionGroup();
	this.game.physics.p2.setBounds(0,0,this.game.world.width,this.game.world.height,true,true,true,true,false); //not working

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
	player = this.player;
	
    //create healthpacks
    healthpacks = this.game.add.group();
    healthpacks.enableBody = true;
    healthpacks.physicsBodyType = Phaser.Physics.P2JS;
    
    var self = this;
    result = this.findObjectsByType('healthpack', this.map, 'spawnpoints');
    for(i=0; i<result.length;i++){
	    pack = healthpacks.create(result[0].x, result[0].y, 'bag');
    	pack.body.setCollisionGroup(itemCG);
    
	    pack.body.collides(playerCG, 
	    					function(){
	    						self.healthPack.play();
	    						self.player.gainHealth(healthPackBonus);
	    						pack.destroy();
	    					});
    }
    
    //create enemies
    //this.enemies.enableBody = true;
    //this.enemies.physicsBodyType = Phaser.Physics.P2JS;
    
    result = this.findObjectsByType('spawn', this.map, 'spawnpoints');
	for(i=0; i<result.length; i++){
		enemies.push(new Enemy(this.game, result[i].x, result[i].y));
	}
	
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
    
    for(i=0;i<enemies.length;i++){
    	enemies[i].update();
    }
    
    if(numEnemies == 0 || skip){
    	skip = false;
    	level += 1;
    	//if(level < 5){
	    	this.state.start('cutscene',true,false,level);
	    //} else {
	    	//this.state.start('cutscene',true,false,);
	    //}
    }
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
    this.body.collides([itemCG, wallsCG]);
    this.body.collides(oldCG, this.dmg, this);
    this.body.fixedRotation = true;
    //the camera will follow the player in the world
    game.camera.follow(this);
    game.add.existing(this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.dmg = function(){
	this.takeHit(10);
	
};

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
		
		//subtract health
		this.dmg(costToShoot);
		console.log(this.health);
		
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
	this.game.plasmaSplat.play();
	body1.sprite.destroy();
}

Plasma.prototype.update = function(){
	
};

Player.prototype.takeHit = function(x){
	this.game.hurt.play();
	this.health -= x;
	if(this.health < 1){
		this.deathSound.play();
		this.game.state.start('cutscene', true, false, 5);
	}
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
	this.body.collides(allyCG, this.dmg, this);
	this.body.collides(playerCG);
    this.body.fixedRotation = true;
};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.dmg = function(){
	this.health -= 10;
	if(this.health < 1){
		this.changeTeams();
	}
};

Enemy.prototype.changeTeams = function(){
	var blah = new Ally(this.game, this.x, this.y);
	for(i=0;i<enemies.length;i++){
		if(enemies[i] == this){
			enemies.splice(i,1);
			break;
		}
	}
	numEnemies -= 1;
	this.destroy();
};

Enemy.prototype.update = function(){
	//ai
	if(distance(this.position, player.position) < thresholdToPlayer){
		var deltx = player.position.x - this.position.x;
		var delty = player.position.y - this.position.y;
		xdir = deltx / Math.abs(deltx);
		ydir = delty / Math.abs(delty);
		
		this.body.moveDown(ydir*playerSpeed/2);
		this.body.moveRight(xdir*playerSpeed/2);
		//this.body.velocity = {x:(xdir * playerSpeed/2), y:(ydir * playerSpeed/2)};
	} else {
		this.body.velocity = {x:0,y:0};
	}
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
	this.body.collides(wallsCG);
	this.body.collides(oldCG, this.dmg, this);
    this.body.fixedRotation = true;
};
Ally.prototype = Object.create(Phaser.Sprite.prototype);
Ally.prototype.constructor = Ally;

Ally.prototype.dmg = function(){
	this.health -= 10;
	if(this.health < 1){
		for(i=0;i<allies.length;i++){
			if(allies[i] == this){
				allies.splice(i,1);
				break;
			}
		}
		this.destroy();
	}
}
Ally.prototype.update = function(){
	//ai
	var distToEnemy = thresholdToEnemy+1;
	var index = -1;
	for(i=0;i<enemies.length;i++){
		dist = distance(this.position, enemies[i].position);
		if(dist < distToEnemy) {
			distToEnemy = dist;
			index = i;
		}
	}
	if(index != -1){
		var deltx = enemies[index].position.x - this.position.x;
		var delty = enemies[index].position.y - this.position.y;
		xdir = deltx / Math.abs(deltx);
		ydir = delty / Math.abs(delty);
		
		this.body.moveDown(ydir*playerSpeed/2);
		this.body.moveRight(xdir*playerSpeed/2);
		//this.body.velocity = {x:(xdir * playerSpeed/2), y:(ydir * playerSpeed/2)};
	} else {
		if(distance(this.position, player.position) > 150){
			var deltx = player.position.x - this.position.x;
			var delty = player.position.y - this.position.y;
			xdir = deltx / Math.abs(deltx);
			ydir = delty / Math.abs(delty);
			
			this.body.moveDown(ydir*playerSpeed/2);
			this.body.moveRight(xdir*playerSpeed/2);
		} else {
			//chill, brah
			this.body.velocity = {x:0,y:0};
		}
	}
};

function distance(p1, p2){
	return Math.sqrt(Math.pow(p1.x - p2.x, 2)+Math.pow(p1.y - p2.y,2));
}
