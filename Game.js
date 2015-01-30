RunSanta.Game = function(game) {

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

		this.createBubblesPool(64);
		this.spawnBubbles(25, 50, 4);

		this.timer = this.game.time.create(false);
		this.timer.add(1000, this.spawnBubble, this);
		this.timer.start();

		this.passedSeconds = 0;

		this.diameterMin = 25;
		this.diameterMax = 50;

		this.input.onDown.add(this.burstCircle, this);
	},

	createBubblesPool: function(num) {
		for (var i = 0; i < num; i++) {
			var b = this.bubbles.create(32 + Math.random() * 420, -10, 'bubble');
			b.kill();
		}
	},

	spawnBubble: function() {
		var numBubbles = 1,
			minSpeed = 25,
			maxSpeed = 50,
			timeToSpawn = 1000;

		this.passedSeconds++;
		if (this.passedSeconds > 5 && this.passedSeconds < 10) {
			numBubbles = 3;
			minSpeed = 50;
			maxSpeed = 100;
			timeToSpawn = 800;

		} else if (this.passedSeconds > 10 && this.passedSeconds < 20) {
			numBubbles = 5;
			minSpeed = 50;
			maxSpeed = 150;
			timeToSpawn = 600;
		} else if (this.passedSeconds > 20 && this.passedSeconds < 30) {
			numBubbles = 5;
			minSpeed = 100;
			maxSpeed = 200;
			timeToSpawn = 800;
			this.diameterMin = 20;
			this.diameterMax = 35;
		} else if (this.passedSeconds > 30) {
			numBubbles = 5;
			minSpeed = 150;
			maxSpeed = 250;
			timeToSpawn = 1000;
			this.diameterMin = 20;
			this.diameterMax = 25;
		}

		this.spawnBubbles(minSpeed, maxSpeed, numBubbles);
		this.timer.add(1000, this.spawnBubble, this);
		this.timer.start();
	},

	spawnBubbles: function(minSpeed, maxSpeed, num) {
		num = num || 1;

		for (var i = 0; i < num; i++) {
			var bubble = this.bubbles.getFirstDead();
			if (bubble === null || bubble === undefined) return;

			bubble.revive();
			bubble.checkWorldBounds = true;
			bubble.outOfBoundsKill = true;
			bubble.reset(20 + Math.random() * 300, -10);
			bubble.scale.set(0.12);
			bubble.anchor.set(0.5);
			bubble.body.velocity.y = this.rnd.integerInRange(minSpeed, maxSpeed);
		}
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
		bubble.kill();
	},

	burstCircle: function(bubble, pointer) {
		var particles = this.add.group(),
			startX = bubble.x,
			startY = bubble.y,
			EXPLODE_DIAMETER = this.rnd.integerInRange(this.diameterMin, this.diameterMax);

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

	},
	render: function() {
		/* this.game.debug.body(this.planes[0].getSprite());
		this.game.debug.body(this.planes[1].getSprite());
		this.tubey.getGroup().forEachAlive(this.renderGroup, this);
		*/
		//this.bubbles.forEachAlive(this.renderGroup, this);

	},

	renderGroup: function(member) {
		this.game.debug.body(member);
	},
};
