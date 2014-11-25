define(function() {
    var ship_constructor = function(Phaser, game, sprite, X, Y) {
        this.Phaser = Phaser;
        this.game = game;
        this.sprite = game.add.sprite(X, Y, sprite);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    };

    ship_constructor.prototype.stop = function() {
        this.sprite.body.velocity.setTo(0,0);
    };

    ship_constructor.prototype.update = function(enemies) {
        this.tracking.update(enemies);
    }

    ship_constructor.prototype.setTracking = function(tracking) {
        this.tracking = tracking;
        tracking.onTargetChanges(this.targetChanged.bind(this));
    }

    ship_constructor.prototype.targetChanged = function(enemy) {
        this.game.physics.arcade.moveToObject(this.sprite, {x: enemy.position.X, y: this.sprite.y}, 200);
    }

    return ship_constructor;
});
