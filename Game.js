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
		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.blobbs = this.add.group();
		this.blobbs.enableBody = true;
		this.blobbs.physicsBodyType = Phaser.Physics.ARCADE;

		this.bubbles = this.add.group();
		this.bubbles.enableBody = true;
		this.bubbles.physicsBodyType = Phaser.Physics.ARCADE;

		for (var i = 0; i < 20; i++) {
			var b = this.bubbles.create(32 + Math.random() * 420, 32 + Math.random() * 300, 'bubble');
			b.scale.set(0.12);
			b.anchor.set(0.5);
		}

		this.input.onDown.add(this.burstCircle, this);
	},

	update: function() {
		this.blobbs.forEachAlive(function(particleGroup) {
			this.game.physics.arcade.overlap(particleGroup, this.bubbles, this.collisionHandler, null, this);
		}, this);
	},

	collisionHandler: function(snow, bubble) {
		this.destroyBubble(bubble);
	},

	quitGame: function(pointer) {
		this.state.start('MainMenu');
	},

	destroyBubble: function(bubble) {
		this.burstCircle(bubble);
		bubble.destroy();
	},

	burstCircle: function(bubble, pointer) {
		var particles = this.add.group(),
			startX = bubble.x,
			startY = bubble.y,
			EXPLODE_DIAMETER = 50.0;

		// emit a circle of snow flakes!, 360 / 18 = 20 particles
		for (var i = 0; i < 360; i = i + 18) {
			var xsp = Math.cos(2 * Math.PI * i / 360.0) * EXPLODE_DIAMETER,
				ysp = Math.sin(2 * Math.PI * i / 360.0) * EXPLODE_DIAMETER;
				particle = particles.create(startX, startY, 'snow');

			this.physics.enable(particle, Phaser.Physics.ARCADE);

			particle.body.velocity = {
				x: xsp,
				y: ysp
			};
		}

		this.blobbs.add(particles);

		// And remove it!
		this.game.time.events.add(Phaser.Timer.SECOND * 1, function() {
			particles.destroy();
		}, this);

	}
};
