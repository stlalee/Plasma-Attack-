/**
 * @author Connor
 */

var PlasmaAttack = PlasmaAttack || {};

PlasmaAttack.Preload = function(){};

PlasmaAttack.Preload.prototype = {
	
	preload: function() {
	    //show loading screen
	    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
	    this.preloadBar.anchor.setTo(0.5);
	
	    this.load.setPreloadSprite(this.preloadBar);
	    
	    //load menu
	    this.load.image('menuback', 'assets/menu/main menu.png');
	    this.load.image('play', 'assets/menu/button play.png');
	    this.load.image('help', 'assets/menu/button instructions.png');	
	    this.load.image('tutorial', 'assets/menu/instructions page.png');
	    this.load.image('backbutton', 'assets/menu/instructions back .png');
	    
	    //load map assets
	    this.load.tilemap('level1', 'assets/retirement/retirement.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('level1Tiles', 'assets/retirement/level 1.png');
	    this.load.tilemap('level2', 'assets/beach/beach.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('level2Tiles', 'assets/beach/level 2.png');
	    this.load.tilemap('level3', 'assets/lab/lab.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('level3Tiles', 'assets/lab/level 3.png');
	    this.load.tilemap('level4', 'assets/white house/white house.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('level4Tiles', 'assets/white house/level 4.png');
	    
	    //load various images
	    this.load.image('enemy', 'assets/images/oldMan.png');
	    this.load.image('player', 'assets/images/kenta.png');
	    this.load.image('bag', 'assets/images/health pack.png');
	    this.load.image('plasma', 'assets/images/plasma.png');
	    this.load.image('ally', 'assets/images/circle.png');
	    
	    //load music/sounds
	    this.load.audio('playerOw', 'assets/sounds/playerOw.wav');
	    this.load.audio('deathSound', 'assets/sounds/deathSound.wav');
	    this.load.audio('healthPack', 'assets/sounds/healthPack.wav');
	    this.load.audio('plasmaSplat', 'assets/sounds/plasmaSplat.wav');
	    
	    //cutscenes
	    this.load.image('l1c1', 'assets/cutscenes/level 1 cut 1.png');
	    this.load.image('l1c2', 'assets/cutscenes/level 1 cut 2.png');
	    this.load.image('l1c3', 'assets/cutscenes/level 1 cut 3.png');
	    this.load.image('l2c1', 'assets/cutscenes/level 2 cut 1.png');
	    this.load.image('l2c2', 'assets/cutscenes/level 2 cut 2.png');
	    this.load.image('l3c1', 'assets/cutscenes/level 3 cut 1.png');
	    this.load.image('l3c2', 'assets/cutscenes/level 3 cut 2.png');
	    this.load.image('l4c1', 'assets/cutscenes/level 4 cut 1.png');
	    
  	},
  	
  	create: function() {
    	this.state.start('MainMenu');
  	}
};
