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
		
		this.playButton = this.game.add.button(325-125, 225, 'play', playFunc, this);
		this.playButton.input.useHandCursor = true;
		this.playButton.visible = true;
		
		this.instButton = this.game.add.button(325-125, 225+100, 'help', tutFunc, this);
		this.instButton.input.useHandCursor = true;
		this.instButton.visible = true;
		
		this.instructions = this.game.add.image(0,0,'tutorial');
		this.instructions.visible = false;
		
		this.back = this.game.add.button(30, this.game.world.height-75, 'backbutton', tutFunc, this);
		this.back.input.useHandCursor = true;
		this.back.visible = false;
		
	},
	update: function(){
		
	},

};

function playFunc(){
	this.state.start('cutscene', true, false, 1);
}

function tutFunc(){
	this.back.visible = this.instructions.visible = !this.instructions.visible;
	this.playButton.visible = this.instButton.visible = !this.instButton.visible;
}
