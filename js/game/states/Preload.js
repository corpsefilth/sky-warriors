SkyWarriors.Preload = function() {
	this.ready = false;
}

SkyWarriors.Preload.prototype = {
	preload: function() {
		// logo for our splash screen
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		
		// load bar
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 187, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);
		
		this.load.setPreloadSprite(this.preloadBar);
		
		// game assets
		this.load.image('background', 'assets/images/BG.png');
		this.load.image('hero', 'assets/images/hero.png');
		this.load.image('shiptrails', 'assets/images/trails.png');
		this.load.image('enemytrails', 'assets/images/enemytrails.png');
		this.load.image('miniDrone', 'assets/images/drone1.png');
		this.load.image('shootDrone', 'assets/images/drone2.png');
		this.load.spritesheet('muzzleAnim', 'assets/images/muzzleanim2.png', 128, 138);
		this.load.spritesheet('explosion', 'assets/images/explosionamin.png', 340, 340);
		
		// load our bullets
		for (var i = 1; i <= 11; i++) {
			this.load.image('bullet' + i, 'assets/images/bullet' + i + '.png');
        }
		
		// some font
		this.load.bitmapFont('shmup', 'assets/fonts/shmupfont.png', 'assets/fonts/shmupfont.xml')
		
		this.load.onLoadComplete.add(this.onLoadComplete, this);
	},
	create: function() {
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		this.state.start('MainMenu');
	},
	onLoadComplete: function() {
		this.ready = true;
	}
};