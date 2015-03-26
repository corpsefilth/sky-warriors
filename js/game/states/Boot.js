var SkyWarriors = function() {};

SkyWarriors.Boot = function() {};

SkyWarriors.Boot.prototype = {
	preload: function() {
		// this.game
		this.load.image('logo', 'assets/images/logo.png');
		this.load.image('preloadbar', 'assets/images/preloader-bar.png');
	},
	
	create: function() {
		this.game.stage.backgroundColor = 'cb2607';
		
		// no multitouch
		this.input.maxPointers = 1;
		
		if(this.game.device.desktop) {
			// desktop view
			this.scale.pageAlignHorizontally = true;
			//this.scale.setScreenSize(true);
		} else {
			// game sacle: min: 480X260, max: 1026X768
			this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			this.scale.minWidth = 320;
			this.scale.minHeight = 540;
			this.scale.maxWidth = 2048;
			this.scale.maxHeight = 1536;
			this.scale.forceLandscape = true;
			this.scale.pageAlignHorizontally = true;
			this.scale.setScreenSize(true);
		}
		
		// presets are ready lets preload
		this.state.start('Preloader');
	}
};
