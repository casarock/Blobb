Blobb.Game = function(game) {

};

Blobb.Game.prototype = {
	create: function() {
		this.score = 0;
		this.gameIsOver = false;
		this.game.stage.backgroundColor = '#ffffff';
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

		this.scoreText = this.game.add.bitmapText(16, 16,
			'kenneyfont', 'Score: '  + this.score);

		this.scoreText.scale.setTo(0.75, 0.75);

		this.input.onDown.add(function(pointer) {
			this.burstCircle(pointer, this.passedSeconds);
		}.bind(this));
	},

	createBubblesPool: function(num) {
		for (var i = 0; i < num; i++) {
			var b = this.bubbles.create(32 + Math.random() * 420, -10, 'bubble');
			b.kill();
		}
	},

	spawnBubble: function() {
		if (this.gameIsOver) return;
		var numBubbles = 1,
			minSpeed = 25,
			maxSpeed = 50,
			timeToSpawn = 1000;

		this.passedSeconds++;
		var levels = {
			"one": this.passedSeconds > 30 && this.passedSeconds < 60,
			"two": this.passedSeconds >= 60 && this.passedSeconds < 75,
			"three": this.passedSeconds >= 75 && this.passedSeconds < 90,
			"four": this.passedSeconds >= 90
		};

		if (levels.one) {
			numBubbles = 3;
			minSpeed = 50;
			maxSpeed = 100;
			timeToSpawn = 800;
		} else if (levels.two) {
			numBubbles = 5;
			minSpeed = 50;
			maxSpeed = 150;
			timeToSpawn = 600;
		} else if (levels.three) {
			numBubbles = 5;
			minSpeed = 100;
			maxSpeed = 150;
			timeToSpawn = 800;
			this.diameterMin = 20;
			this.diameterMax = 35;
		} else if (levels.four) {
			numBubbles = 5;
			minSpeed = 100;
			maxSpeed = 200;
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

			var bubbleX = this.rnd.integerInRange(32, this.game.width - 32),
				tweenX = this.rnd.integerInRange(8, 16),
				tweenSpeed = this.rnd.integerInRange(350, 500);

			bubble.revive();
			bubble.reset(bubbleX, -32);
			bubble.scale.set(0.25);
			bubble.anchor.set(0.5);
			bubble.body.velocity.y = this.rnd.integerInRange(minSpeed, maxSpeed);

			this.add.tween(bubble.position)
				.to(
					{ x: bubbleX + tweenX },
					tweenSpeed,
					Phaser.Easing.Quadratic.InOut,
					true,
					0,
					1000,
					true
				);
		}
	},

	update: function() {

		if (!this.gameIsOver) {
			this.blobbs.forEachAlive(function(particleGroup) {
				this.game.physics.arcade.overlap(particleGroup, this.bubbles, this.collisionHandler, null, this);
			}, this);

			this.bubbles.forEachAlive(function(bubble) {
				if (bubble.position.y > this.world.height + 16) {
					this.gameIsOver = true;
					this.gameOver();
				}
			}, this);
		}
		else {
			this.quitGame();
		}

	},

	collisionHandler: function(snow, bubble) {
		this.destroyBubble(bubble, snow.name);
	},

	gameOver: function() {
		this.bubbles.callAll('kill');
	},

	quitGame: function(pointer) {
		this.state.start('MainMenu');
	},

	destroyBubble: function(bubble, origin) {
		this.burstCircle(bubble, origin);
		bubble.kill();
		this.score++;
		this.scoreText.setText('Score: '  + this.score);
	},

	burstCircle: function(bubble, origin) {
		origin = origin || null;
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
			particle.name = origin + "";
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
