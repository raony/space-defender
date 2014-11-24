define(function() {
    var ship_constructor = function(Phaser, game, sprite, X, Y) {
        this.Phaser = Phaser;
        this.game = game;
        this.sprite = game.add.sprite(X, Y, sprite);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    };

    return ship_constructor;
});
