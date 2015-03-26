SkyWarriors.Stage1 = function() {
	// this.player;
	this.cursors = null;
	this.speed = 600;
	this.droneBullets
	var shipTrail;
	var explosions;
	var playerDeath;
	//this.player.health = 100;
	
	this.weapons = [];
	this.currentWeapon = 0;
	this.weaponName = null;
	
	this.drone1Rate = 1500;
	this.drone1Timer = 0;
	
	this.drone2Rate = 2000;
	this.drone2Timer = 0;
	
	this.healthString = "";
	this.healthText;
	
	this.scoreString = "";
	this.scoreText;
	this.score = 0;
	
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
		shipTrail.width = 15;
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
		
		// enemy groups
		this.drones1 = this.game.add.group();
		this.drones2 = this.game.add.group();
		
		// Drone bullets
		this.droneBullets = this.game.add.group();
		this.droneBullets.enableBody = true;
		this.physics.arcade.enable(this.droneBullets);
		this.droneBullets.createMultiple(10, 'droneBullet');
		this.droneBullets.setAll('alpha', 0.9);
		this.droneBullets.setAll('anchor.x', 0.5);
		this.droneBullets.setAll('anchor.y', 0.5);
		this.droneBullets.setAll('scale.x', 0.3);
		this.droneBullets.setAll('scale.y', 0.3);
		this.droneBullets.setAll('outOfBoundsKill', true);
		this.droneBullets.setAll('checkWorldBounds', true);
		this.droneBullets.forEach(function(enemy) {
			//enemy.body.setSize(20, 20);
			enemy.damageAmount = 20;
		});
		
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
		
		// an explosion pool
		explosions = game.add.group();
		explosions.enableBody = true;
		this.physics.arcade.enable(explosions);
		explosions.createMultiple(30, 'explosion');
		explosions.setAll('anchor.x', 0.5);
		explosions.setAll('anchor.y', 0.5);
		explosions.setAll('scale.x', 0.3);
		explosions.setAll('scale.y', 0.3);
		explosions.forEach(function(explosion) {
			explosion.animations.add('explosion');
		});
		
		// Big Explosion
		playerDeath = game.add.emitter(this.player.x, this.player.y);
		playerDeath.width = 50;
		playerDeath.height = 50;
		playerDeath.makeParticles('explosion', [1,2,3,4,5,6,7], 10);
		playerDeath.setAlpha(0.9, 0, 800);
		playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.out);
		
		// Shields stat
		this.healthString = 'Shields: ';
		this.healthText = this.game.add.text(this.game.world.width - 300, 10, this.healthString + this.player.health + '%', { font: '34px Arial', fill: '#000'});
		
		this.scoreString = 'Score: ';
		this.scoreText = this.game.add.text(this.game.world.width - 300, 50, this.scoreString + this.score, { font: '34px Arial', fill: '#000'});
		
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
		
		if(this.drone2Timer < this.game.time.now) {
			this.launchDrone2();
			this.drone2Timer = this.game.time.now + this.drone2Rate;
		}
		// check for collisions
		this.game.physics.arcade.overlap(this.player, this.drones1, this.shipCollide, null, this);
		this.game.physics.arcade.overlap(this.player, this.drones2, this.shipCollide, null, this);
		// check if bullet hits enemy
		this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], this.drones1, this.bulletHitsEnemy, null, this);
		this.game.physics.arcade.overlap(this.weapons[this.currentWeapon], this.drones2, this.bulletHitsEnemy, null, this);
		
		// enemy bullet hist player
		this.game.physics.arcade.overlap(this.player, this.droneBullets, this.enemyHitsPlayer, null, this);
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
		this.addEnemyEmitterTrail(drone1);
		drone1.trail.start(false, 800, 1);
		drone1.update = function() {
			drone1.trail.x = drone1.x;
			drone1.trail.y = drone1.y - 8;
		}
		
		
		drone1.reset(x, y);
		drone1.revive();
	},
	
	shipCollide: function(player, enemy) {
		enemy.kill();
		player.damage(enemy.damageAmount);
		
		if(player.alive) {
			var explosion = explosions.getFirstExists(false);
			explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
			explosion.alpha = 0.7;
			explosion.play('explosion', 30, false, true);
			this.updateHealth(player.health);
		} else {
			playerDeath.x = player.x;
			playerDeath.y = player.y;
			playerDeath.start(false, 1000, 10, 10);
			this.healthText.text = "KIA"
		}
	},
	bulletHitsEnemy: function(bullet, currentEnemy) {
		var explosion = explosions.getFirstExists(false);
		explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
		explosion.body.velocity.y = currentEnemy.body.velocity.y;
		explosion.alpha = 0.7;
		explosion.play('explosion', 30, false, true);
		currentEnemy.kill();
		bullet.kill();
		
		// console.log(currentEnemy);
		this.score += currentEnemy.damageAmount * 10;
		this.scoreText.text = this.scoreString + this.score;
	},
	enemyHitsPlayer: function(player, bullet) {
		// console.log(player);
		player.damage(bullet.damageAmount);
		bullet.kill();
		
		if(player.alive) {
			var explosion = explosions.getFirstExists(false);
			explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
			explosion.alpha = 0.7;
			explosion.play('explosion', 30, false, true);
			this.updateHealth(player.health);
		} else {
			playerDeath.x = player.x;
			playerDeath.y = player.y;
			playerDeath.start(false, 1000, 10, 10);
			this.healthText.text = "KIA"
		}
		
	},
	updateHealth: function(health) {
		if(health <= 100) {
			this.healthString = 'Health: ';
			this.healthText.fill = '#ff0044';
		}
		this.healthText.text = this.healthString + health + '%';
	},
	launchDrone2: function() {
		
		var drone2 = this.drones2.getFirstExists(false);
		if(!drone2) {
			drone2 = new Drone2(this.game, 0, 0);
			this.drones2.add(drone2);
		}
		this.addEnemyEmitterTrail(drone2);
		drone2.trail.start(false, 800, 1);
		
		// set up firing
		var bulletSpeed = 500;
		var firingDelay = 2000;
		var tmpPlayer = this.player;
		drone2.bullets = 1;
		drone2.lastShot = 0;
		enemyBullet = this.droneBullets.getFirstExists(false);
		
		drone2.update = function() {
			drone2.trail.x = drone2.x + 25;
			drone2.trail.y = drone2.y + 8;
			
			// Fire
			if (enemyBullet &&
				this.alive &&
				this.bullets &&
				this.y > this.game.width / 8 &&
				this.game.time.now > firingDelay + this.lastShot) {
					
					this.lastShot = this.game.time.now;
					this.bullets--;
					enemyBullet.reset(this.x, this.y + this.height / 2);
					var angle = this.game.physics.arcade.moveToObject(enemyBullet, tmpPlayer, bulletSpeed);
					enemyBullet.angle = this.game.math.radToDeg(angle);
				}
		}
		
		drone2.reset(this.game.rnd.integerInRange(0, this.game.width), -20);
		drone2.revive();
		
	},
	addEnemyEmitterTrail: function(enemy) {
		var enemyTrail = game.add.emitter(enemy.x, this.player.y - 10, 100);
		enemyTrail.width = 10;
		enemyTrail.height = 10;
		enemyTrail.makeParticles('enemytrails');
		enemyTrail.setXSpeed(20, -20);
		enemyTrail.setRotation(50, -50);
		enemyTrail.setAlpha(0.4, 0, 800);
		enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
		enemy.trail = enemyTrail;
	},
	
};