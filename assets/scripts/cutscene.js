/**
 * @author Connor
 */


var PlasmaAttack = PlasmaAttack || {};

PlasmaAttack.cutscene = function(){};

PlasmaAttack.cutscene.prototype = {
	init: function(nextLevel){
		this.nextlvl = nextLevel;
	},
	preload: function(){
		
	},
	create: function(){
		this.cut = [];
		if(nextlvl == 1){
			//lvl1 cutscenes
			this.cut.push(this.game.add.button(0,0,'l1c1', nextFunc, this));
			this.cut[0].visible = true;
			this.cut.push(this.game.add.button(0,0,'l1c2', nextFunc, this));
			this.cut[1].visible = false;
			this.cut.push(this.game.add.button(0,0,'l1c3', playFunc, this));
			this.cut[2].visible = false;
			
		} else if(nextlvl == 2){
			
		} else if(nextlvl == 3){
			
		} else if(nextlvl == 4){
			
		}
	},
	update: function(){
		
	},

};

function playFunc(){
	this.state.start('Game', true, false, this.nextlvl);
}

function nextFunc(){
	this.cut
}
