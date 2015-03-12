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
	    this.load.tiledmap(cacheKey('level1', 'tiledmap'), 'assets/retirement.json', null, Phaser.Tilemap.TILED_JSON);
	    //this.load.tilemap('level1', 'assets/retirement.tmx', null, Phaser.Tilemap.TILED_JSON);
	    
	    this.load.image('gameTiles', 'assets/level 1.png');
	    
  	},
  	create: function() {
    	this.state.start('Game');
  	}
};
