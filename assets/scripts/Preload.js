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
	    this.load.image('tutorial', 'assets/menu/button instructions');	
	    
	    //load game assets
	    this.load.tilemap('level1', 'assets/retirement/retirement.json', null, Phaser.Tilemap.TILED_JSON);
	    this.load.image('level1Tiles', 'assets/retirement/level 1.png');
	    
	    this.load.image('enemy', 'assets/images/oldMan.png');
	    this.load.image('player', 'assets/images/kenta.png');
	    this.load.image('bag', 'assets/images/health pack.png');
	    this.load.image('plasma', 'assets/images/plasma.png');
	    this.load.image('ally', 'assets/images/circle.png');
	    this.load.audio('playerOw', 'assets/sounds/playerOw.wav');
	    this.load.audio('deathSound', 'assets/sounds/deathSound.wav');
	    this.load.audio('healthPack', 'assets/sounds/healthPack.wav');
	    this.load.audio('plasmaSplat', 'assets/sounds/plasmaSplat.wav');
	    
  	},
  	
  	create: function() {
    	this.state.start('MainMenu');
  	}
};
