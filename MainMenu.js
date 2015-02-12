Blobb.MainMenu = function (game) {
};

Blobb.MainMenu.prototype = {

	create: function () {
		this.game.stage.backgroundColor = '#ffffff';
		this.bubbles = this.add.group();
		this.blobbs = this.add.group();

		this.diameterMin = 25;
		this.diameterMax = 50;

		for (var i = 0; i < 10; i++) {
			var b = this.bubbles.create(32 + Math.random() * this.game.width - 32, -10, 'bubble');
			b.kill();
		}

		this.game.time.events.add(Phaser.Timer.SECOND * 0.25, function() {
			this.spawnBubble();
		}, this);

		this.playButton = this.game.add.bitmapText(this.world.width/2, this.world.height/2,
			'kenneyfont', 'Play');

		var btnX = this.playButton.position.x = this.world.width/2 - this.playButton.width/2 -5;
		this.playButton.position.y = this.world.height/2 - this.playButton.height/2;
		this.playButton.inputEnabled = true;
		this.playButton.events.onInputDown.add(function(pointer) {
			this.play();
		}, this);

		this.add.tween(this.playButton.position)
			.to(
				{ x: btnX + 10 },
				500,
				Phaser.Easing.Quadratic.InOut,
				true,
				0,
				1000,
				true
			);

		this.logo = this.add.sprite(this.world.width/2, 64, 'logo');
		this.logo.anchor.set(0.5, 0.5);

		if (this.game.device.cocoonJS) {
			this.banner();
		}
	},

	play: function() {
		this.state.start('Game');
	},

	spawnBubble: function() {
		var bubble = this.bubbles.getFirstDead();
		if (bubble === null || bubble === undefined) return;

		var bubbleX = this.rnd.integerInRange(32, this.game.width - 32),
			bubbleY = this.rnd.integerInRange(32, this.game.height - 32);

		bubble.revive();
		bubble.reset(bubbleX, bubbleY);
		bubble.scale.set(0.25);
		bubble.anchor.set(0.5);

		this.game.time.events.add(Phaser.Timer.SECOND * 1.25, function() {
			this.destroyBubble(bubble);
		}, this);

		this.game.time.events.add(Phaser.Timer.SECOND * 0.25, function() {
			this.spawnBubble();
		}, this);

	},

	destroyBubble: function(bubble) {
		this.burstCircle(bubble);
		bubble.kill();
	},

	update: function () {

	},

	burstCircle: function(bubble, origin) {
		origin = origin || null;
		var particles = this.add.group(),
			startX = bubble.position.x,
			startY = bubble.position.y,
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

	banner: function() {
		Cocoon.Ad.banner.on("ready", function(w, h) {
			console.log("banner ready");
			Cocoon.Ad.setBannerLayout(Cocoon.Ad.BannerLayout.BOTTOM_CENTER);
			Cocoon.Ad.showBanner();
		});

		Cocoon.Ad.loadBanner();
	}

};
