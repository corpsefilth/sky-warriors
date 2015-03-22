SkyWarriors.MainMenu = function() {
	
};

SkyWarriors.MainMenu.prototype = {
	create: function() {
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
		this.background.autoScroll(-250, 0);
		
		this.player = this.add.sprite(200, this.game.height/2, 'hero');
		this.player.anchor.setTo(0.5);
		this.player.scale.setTo(0.3);
		
		this.game.add.tween(this.player).to({y: this.player.y - 5}, 300, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
		
		// logo
		this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
		this.splash.anchor.setTo(0.5);
		
		// start text
		this.startText = this.game.add.bitmapText(0, 0, 'shmup', 'tap to start', 32);
		this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
		this.startText.y = this.game.height / 2 + this.splash.height / 2;
	},
	update: function() {
		if(this.game.input.activePointer.justPressed()) {
			this.game.state.start('Stage1');
		}
	}
};