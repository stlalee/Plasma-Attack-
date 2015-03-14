/**
 * @author Connor
 */


var PlasmaAttack = PlasmaAttack || {};

PlasmaAttack.cutscene = function(){};

PlasmaAttack.cutscene.prototype = {
	init: function(nextLevel){
		this.cut = [];
		this.num = 0;
		this.nextlvl = nextLevel;
	},
	preload: function(){
		
	},
	create: function(){
		this.cut = [];
		if(this.nextlvl == 1){
			//lvl1 cutscenes
			this.cut.push(this.game.add.button(0,0,'l1c1', this.nextFunc, this));
			this.cut[0].visible = true;
			this.cut.push(this.game.add.button(0,0,'l1c2', this.nextFunc, this));
			this.cut[1].visible = false;
			this.cut.push(this.game.add.button(0,0,'l1c3', this.playFunc, this));
			this.cut[2].visible = false;
		} else if(this.nextlvl == 2){
			this.cut.push(this.game.add.button(0,0,'l2c1', this.nextFunc, this));
			this.cut[0].visible = true;
			this.cut.push(this.game.add.button(0,0,'l2c2', this.playFunc, this));
			this.cut[1].visible = false;
		} else if(this.nextlvl == 3){
			this.cut.push(this.game.add.button(0,0,'l3c1', this.nextFunc, this));
			this.cut[0].visible = true;
			this.cut.push(this.game.add.button(0,0,'l3c2', this.playFunc, this));
			this.cut[1].visible = false;
		} else if(this.nextlvl == 4){
			this.cut.push(this.game.add.button(0,0,'l4c1', this.playFunc, this));
			this.cut[0].visible = true;
		} else if(this.nextlvl == 5){
			this.game.add.sprite(0,0,'gameover');
			this.nextlvl = 1;
			this.game.add.button(325-125, 300, 'yes', this.playFunc, this);
			this.game.add.button(325, 300, 'no', this.startMenu, this);
		}
	},
	update: function(){
		
	},
	playFunc: function(){
		this.state.start('Game', true, false, this.nextlvl);
	},
	nextFunc: function(){
		this.cut[this.num].visible = false;
		this.num += 1;
		this.cut[this.num].visible = true;
	},
	startMenu: function(){
		this.state.start('MainMenu');
	}
};
