var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

game.state.add('Boot', SkyWarriors.Boot);
game.state.add('Preloader', SkyWarriors.Preload);
game.state.add('MainMenu', SkyWarriors.MainMenu);
game.state.add('Stage1', SkyWarriors.Stage1);

game.state.start('Boot');