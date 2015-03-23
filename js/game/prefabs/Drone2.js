var Drone2 = function(game, x, y, key) {
	key = 'shootDrone';
	Phaser.Sprite.call(this, game, x, y, key);
	var DRONE_SPEED = 300;
	
	this.scale.setTo(0.3);
	this.anchor.setTo(0.5);
	
	this.game.physics.arcade.enableBody(this);
	//this.createMultiple(5, key);
	this.body.allowGravity = false;
	
	this.checkWorldBounds = true;
	this.onOutOfBoundsKill = true;
	
	this.damageAmount = 20;
	
	this.events.onKilled.add(this.onKilled, this);
	this.events.onRevived.add(this.onRevived, this);
};

Drone2.prototype = Object.create(Phaser.Sprite.prototype);
Drone2.prototype.constructor = Drone2;

Drone2.prototype.onRevived = function() {
	this.body.velocity.y = 300; // this.game.rnd.integerInRange(-300, 300);
	this.body.velocity.x = this.game.rnd.integerInRange(-300, 300); // 300;
	this.body.drag.y = 100;
};


Drone2.prototype.onKilled = function() {
	this.animations.frame = 0;
	this.trail.kill();
};