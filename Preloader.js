Blobb.Preloader = function(game) {};

Blobb.Preloader.prototype = {

    preload: function() {
        this.parcel = this.load.image('snow', 'images/snow.png');
        this.parcel = this.load.image('bubble', 'images/bubble.png');
    },

    create: function() {
        this.state.start('Game');
    }

};
