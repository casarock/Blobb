Blobb.Preloader = function(game) {
    this.ready = false;
};

Blobb.Preloader.prototype = {

    preload: function() {
        this.snow = this.load.image('snow', 'images/snow-new.png');
        this.bubble = this.load.image('bubble', 'images/bubble-new.png');
        this.logo = this.load.image('logo', 'images/logo.png');
        this.load.bitmapFont('kenneyfont', 'fonts/kenneyspace_72/kenneyspace_72.png', 'fonts/kenneyspace_72/kenneyspace_72.fnt');
    },

    create: function() {
        this.game.stage.backgroundColor = '#ffffff';
        var logo = this.add.sprite(this.world.width/2, this.world.height/2, 'appsbude');
        logo.anchor.set(0.5, 0.5);

        this.game.time.events.add(Phaser.Timer.SECOND * 2.0, function() {

            var tween = this.add.tween(logo)
                .to({alpha: 0}, 750, Phaser.Easing.Linear.none);

            tween.onComplete.add(function() {
                logo.destroy();
                this.startGame();
            }, this);

            tween.start();
        }, this);
    },

    startGame: function() {
        this.state.start('MainMenu');
    }

};
