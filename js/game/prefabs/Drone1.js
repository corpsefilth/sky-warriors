var Drone1 = function(game, x, y, key) {
	key = 'miniDrone';
	Phaser.Sprite.call(this, game, x, y, key);
	
	this.scale.setTo(0.3);
	this.anchor.setTo(0.5);
	
	this.game.physics.arcade.enableBody(this);
	this.body.allowGravity = false;
	
	this.checkWorldBounds = true;
	this.onOutOfBoundsKill = true;
	
	this.damageAmount = 10;
	
	// this.events.onKilled.add(this.onKilled, this);
	this.events.onRevived.add(this.onRevived, this);
};

Drone1.prototype = Object.create(Phaser.Sprite.prototype);
Drone1.prototype.constructor = Drone1;

Drone1.prototype.onRevived = function() {
	// add tween to make drone look like hove effect
	this.game.add.tween(this).to({y: this.y - 16}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
	this.body.velocity.x = -400;
};

/*
Drone1.prototype.onKilled = function() {
	this.animations.frame = 0;
};
*/