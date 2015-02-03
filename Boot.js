var Blobb = {};

Blobb.Boot = function (game) {

};

Blobb.Boot.prototype = {

    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        this.game.orientated = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.minWidth = this.game.width / 2;
        this.scale.minHeight = this.game.height / 2;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        if (this.game.device.desktop) {
            this.scale.maxWidth = this.game.width;
            this.scale.maxHeight = this.game.height;
        } else {
            this.scale.maxWidth = this.game.width * 2.5;
            this.scale.maxHeight = this.game.height * 2.5;
            this.scale.forceOrientation(false, true);
        }
    },

    preload: function () {

    },

    create: function () {
        this.state.start('Preloader');
    }

};
