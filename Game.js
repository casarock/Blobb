RunSanta.Game = function(game) {

	this.game; //	a reference to the currently running game
	this.add; //	used to add sprites, text, groups, etc
	this.camera; //	a reference to the game camera
	this.cache; //	the game cache
	this.input; //	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
	this.load; //	for preloading assets
	this.math; //	lots of useful common math operations
	this.sound; //	the sound manager - add a sound, play one, set-up markers, etc
	this.stage; //	the game stage
	this.time; //	the clock
	this.tweens; //  the tween manager
	this.state; //	the state manager
	this.world; //	the game world
	this.particles; //	the particle manager
	this.physics; //	the physics manager
	this.rnd; //	the repeatable random number generator

};

RunSanta.Game.prototype = {

	create: function() {

		this.game.stage.backgroundColor = '#000000';
		this.blobbs = [];

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.bubble = this.add.sprite(100, 100, 'bubble');
		this.bubble.inputEnabled = true;
		this.bubble.scale.set(0.12);
		this.bubble.anchor.set(0.5);

		this.bubble.events.onInputDown.add(this.particleBurst_circle, this);
	},

	update: function() {

	},

	quitGame: function(pointer) {
		this.state.start('MainMenu');
	},

	particleBurst_circle: function(bubble, pointer) {

		var emitter = this.add.emitter(bubble.position.x, bubble.position.y, 20);
		

		console.log(emitter);

		emitter.makeParticles('snow');
		emitter.gravity = 0;

		emitter.x = bubble.x;
		emitter.y = bubble.y;
		bubble.destroy();


		var EXPLODE_DIAMETER = 50.0;

		// emit a circle of particles, 360 / 18 = 20 particles
		for (var i = 0; i < 360; i = i + 18) {
			// set fixed x speed
			var xsp = Math.cos(2 * Math.PI * i / 360.0) * EXPLODE_DIAMETER;
			emitter.setXSpeed(xsp, xsp);

			// set fixed y speed
			var ysp = Math.sin(2 * Math.PI * i / 360.0) * EXPLODE_DIAMETER;
			emitter.setYSpeed(ysp, ysp);

			// next line doesn't work, only emits one(?) moving particle
			emitter.start(true, 1000, null, 1);
			emitter.update();
			// next line add particles, but not moving
			//var star = emitter.create(pointer.x + xsp, pointer.y + ysp, 'snow', null, true);
		}
	}

};
