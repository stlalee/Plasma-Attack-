/**
 * @author Connor
 */

var PlasmaAttack = PlasmaAttack || {};

PlasmaAttack.MainMenu = function(){};

PlasmaAttack.MainMenu.prototype = {
	preload: function(){
		
	},
	create: function(){
		var background = this.game.add.image(0, 0, 'menuback');
		
		var playButton = this.game.add.button(this.game.world.centerX-125, this.game.world.centerY, 'play', playFunc, this);
		playButton.input.useHandCursor = true;
		
		var instButton = this.game.add.button(this.game.world.centerX-125, this.game.world.centerY+100, 'tutorial', tutFunc, this);
		instButton.input.useHandCursor = true;
		
	},
	update: function(){
		
	},

};

function playFunc(){
	this.state.start('Game');
}

function tutFunc(){
	
}
