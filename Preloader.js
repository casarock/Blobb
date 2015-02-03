Blobb.Preloader = function(game) {};

Blobb.Preloader.prototype = {

    preload: function() {
        this.parcel = this.load.image('snow', 'images/snow-new.png');
        this.parcel = this.load.image('bubble', 'images/bubble-new.png');
        this.load.bitmapFont('kenneyfont', 'fonts/kenneyspace_72/kenneyspace_72.png', 'fonts/kenneyspace_72/kenneyspace_72.fnt');
    },

    create: function() {
        this.state.start('Game');
    }

};
