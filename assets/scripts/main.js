var PlasmaAttack = PlasmaAttack || {};

PlasmaAttack.game = new Phaser.Game(500,500, Phaser.AUTO, '');
//PlasmaAttack.game.add.plugin(Phaser.Plugin.Tiled);
PlasmaAttack.game.state.add('Boot', PlasmaAttack.Boot);
PlasmaAttack.game.state.add('Preload', PlasmaAttack.Preload);
PlasmaAttack.game.state.add('Game', PlasmaAttack.Game);

PlasmaAttack.game.state.start('Boot');
