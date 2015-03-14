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
		
		this.instButton = this.game.add.button(this.game.world.centerX-125, this.game.world.centerY+100, 'help', tutFunc, this);
		this.instButton.input.useHandCursor = true;
		this.instButton.visible = true;
		
		this.instructions = this.game.add.image(0,0,'tutorial');
		this.instructions.visible = false;
		
		this.back = this.game.add.button(this.game.world.centerX-81, this.game.world.centerY+100, 'backbutton', tutFunc, this);
		this.back.input.useHandCursor = true;
		this.back.visible = false;
		
	},
	update: function(){
		
	},

};

function playFunc(){
	this.state.start('Game');
}

function tutFunc(){
	this.back.visible = this.instructions.visible = !this.instructions.visible;
	this.instButton.visible = !this.instButton.visible;
}
