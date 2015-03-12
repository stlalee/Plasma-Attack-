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
	    
	    var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
	
	    //load game assets
	    this.load.tiledmap(cacheKey('level1', 'tiledmap'), 'assets/levels/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
	    //this.load.tilemap('level1', 'assets/retirement.tmx', null, Phaser.Tilemap.TILED_JSON);
	    
	    this.load.image('gameTiles', 'assets/images/tiles.png');
	    this.load.image('greencup', 'assets/images/greencup.png');
	    this.load.image('bluecup', 'assets/images/bluecup.png');
	    this.load.image('player', 'assets/images/player.png');
	    this.load.image('browndoor', 'assets/images/browndoor.png');
	    
  	},
  	create: function() {
    	this.state.start('Game');
  	}
};
