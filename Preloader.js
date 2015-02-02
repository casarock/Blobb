Blobb.Preloader = function(game) {};

Blobb.Preloader.prototype = {

    preload: function() {
        this.parcel = this.load.image('snow', 'images/snow-new.png');
        this.parcel = this.load.image('bubble', 'images/bubble-new.png');
    },

    create: function() {
        this.state.start('Game');
    }

};
