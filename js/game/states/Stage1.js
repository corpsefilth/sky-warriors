SkyWarriors.Stage1 = function() {
	this.player = null;
	this.cursors = null;
	this.speed = 600;
	var shipTrail;
	//this.player.health = 100;
	
	this.weapons = [];
	this.currentWeapon = 0;
	this.weaponName = null;
	
	this.drone1Rate = 1000;
	this.drone1Timer = 0;
	
	this.healthString = "";
	this.healthText;
	
};

SkyWarriors.Stage1.prototype = {
	create: function() {
		//this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
		this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
		this.background.autoScroll(-250, 0);
		
		// start physics engine
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// the hero
		this.player = this.add.sprite(200, this.game.height / 2, 'hero');
		this.player.health = 200;
		this.player.anchor.setTo(0.5);
		this.player.scale.setTo(0.3);
		this.physics.arcade.enable(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.events.onKilled.add(function() {
			shipTrail.kill();
		});
		this.player.events.onRevived.add(function() {
			shipTrail.start(false, 5000, 10);
		});
		
		// ships exhaust
		shipTrail = game.add.emitter(this.player.x - 50, this.player.y + 23, 400);
		shipTrail.width = 10;
		//shipTrail.height = 10;
		shipTrail.makeParticles('shiptrails');
		shipTrail.setXSpeed(-200, -180);
		shipTrail.setYSpeed(30, -30);
		shipTrail.setRotation(50,-50);
		shipTrail.setAlpha(1, 0.01, 800);
		shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
		shipTrail.start(false, 5000, 10);
		
		// ships gun muzzle
		this.gunMuzzle = this.add.sprite(this.player.x + 83, this.player.y + 16, 'muzzleAnim');
		this.gunMuzzle.anchor.setTo(0.5);
		this.gunMuzzle.scale.setTo(0.5);
		this.gunMuzzle.visible = false;
		this.gunMuzzle.animations.add('muzzle', [1, 2, 3, 4, 5], 30, true);
		
		// enemy group
		this.drones1 = this.game.add.group();
		
		// weapons 
		this.weapons.push(new Weapon.SingleBullet(this.game));
		this.weapons.push(new Weapon.FrontAndBack(this.game));
		this.weapons.push(new Weapon.ThreeWay(this.game));
		this.weapons.push(new Weapon.EightWay(this.game));
		this.weapons.push(new Weapon.ScatterShot(this.game));
		this.weapons.push(new Weapon.Beam(this.game));
		this.weapons.push(new Weapon.SplitShot(this.game));
		this.weapons.push(new Weapon.Pattern(this.game));
		this.weapons.push(new Weapon.Rockets(this.game));
		this.weapons.push(new Weapon.ScaleBullet(this.game));
		
		this.currentWeapon = 0;
		
		for (var i = 0; i < this.weapons.length; i++) {
			this.weapons[i].visible = false;
		}
		this.weapons[this.currentWeapon].visible = true;
		this.weaponName = this.add.bitmapText(8, 0, 'shmup', "Current Weapon: " + this.weapons[this.currentWeapon].name, 24);
		
		// Shields stat
		this.healthString = 'Shields: ';
		this.healthText = this.game.add.text(game.world.width - 400, 10, this.healthString + this.player.health + '%', { font: '34px Arial', fill: '#000'});
		
		// some controls to play the game with
		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.wasd = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S)
		}
		this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		changeKey.onDown.add(this.nextWeapon, this);
	},
	
	update: function() {
		
		// reset player, then check for movement keys
		this.player.body.velocity.set(0);
		
		this.movePlayer();
		
		
		shipTrail.emitX = this.player.x - 50;
		shipTrail.emitY = this.player.y + 23;
		
		
		if ((this.fireButton.isDown || this.input.activePointer.isDown) && this.player.alive) {
			this.weapons[this.currentWeapon].fire(this.player);
			this.gunMuzzle.visible = true;
			this.gunMuzzle.x = this.player.x + 83;
			this.gunMuzzle.y = this.player.y + 16;
			this.gunMuzzle.animations.play('muzzle');
		} else {
			this.gunMuzzle.animations.stop()
			this.gunMuzzle.frame = 0;
			this.gunMuzzle.visible = false;
		}
		
		if(this.drone1Timer < this.game.time.now) {
			this.createDrone1();
			this.drone1Timer = this.game.time.now + this.drone1Rate;
		}
		
		// check for collisions
		this.game.physics.arcade.overlap(this.player, this.drones1, this.shipCollide, null, this);
		// check for collisions
		this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], this.drones1, this.bulletHitsEnemy, null, this);
	},
	
	nextWeapon: function() {
		if (this.currentWeapon > 9) {
			this.weapons[this.currentWeapon].reset();
		} else {
			this.weapons[this.currentWeapon].visible = false;
			this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
			this.weapons[this.currentWeapon].setAll('exists', false);
		}
		
		// Activate new weapon
		this.currentWeapon++;
		
		if ( this.currentWeapon === this.weapons.length) {
			this.currentWeapon = 0;
		}
		
		this.weapons[this.currentWeapon].visible = true;
		
		this.weaponName.text = this.weapons[this.currentWeapon].name;
	},
	
	render: function() {
		//this.game.debug.body(this.player);
		//this.game.debug.spriteInfo(this.player, 150, 40);
		//this.game.debug.body(this.weapons[this.currentWeapon]);
		//this.game.debug.spriteInfo(this.weapons[this.currentWeapon], 150, 40);
	},
	
	movePlayer: function() {
		if (this.cursors.left.isDown || this.wasd.left.isDown) {
            this.player.body.velocity.x = -this.speed;
        } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
			this.player.body.velocity.x = this.speed;
        }
		
		if (this.cursors.up.isDown || this.wasd.up.isDown) {
            this.player.body.velocity.y = -this.speed;
        } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
            this.player.body.velocity.y = this.speed;
        } 
		
		if (this.input.activePointer.isDown &&
			this.physics.arcade.distanceToPointer(this.player) > 15) {
				this.physics.arcade.moveToPointer(this.player, this.speed);
		}
	},
	
	createDrone1: function() {
		var x = this.game.width;
		var y = this.game.rnd.integerInRange(50, this.game.world.height);
		
		var drone1 = this.drones1.getFirstExists(false);
		if(!drone1) {
			drone1 = new Drone1(this.game, 0, 0);
			this.drones1.add(drone1);
		}
		
		drone1.reset(x, y);
		drone1.revive();
	},
	
	shipCollide: function(player, enemy) {
		enemy.kill();
		player.damage(enemy.damageAmount);
		this.updateHealth(player.health);
	},
	bulletHitsEnemy: function(bullet, currentEnemy) {
		currentEnemy.kill();
		bullet.kill();
	},
	updateHealth: function(health) {
		if(health <= 100) {
			this.healthString = 'Health: ';
			this.healthText.fill = '#ff0044';
		}
		this.healthText.text = this.healthString + health + '%';
	},
	
};