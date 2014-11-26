define(function() {
    var ship_constructor = function(Phaser, game, sprite, X, Y, responseTime) {
        if (responseTime === undefined)
            this.responseTime = 0
        else
            this.responseTime = responseTime
        this.Phaser = Phaser;
        this.game = game;
        this.sprite = game.add.sprite(X, Y, sprite);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        this.sprite.body.collideWorldBounds = true;
        this.target = undefined;
        this.timer = this.game.time.now;
    };

    ship_constructor.prototype.stop = function() {
        this.sprite.body.velocity.setTo(0,0);
    };

    ship_constructor.prototype.update = function(bullets) {
        var safe = 0;
        if (this.responseTime > 0 && this.game.time.now <= this.timer)
            return;
        if (bullets) {
            bullets.forEachAlive(function (bullet) {
                if (Phaser.Point.distance(bullet.position, this.sprite.position) < 60) {
                    if (bullet.position.x < this.sprite.position.x)
                        safe = 1;
                    else
                        safe = -1;
                }
            }, this);
        }
        this.timer = this.game.time.now + this.responseTime;
        this.tracking.update();
        //console.log(this.sprite.x + " , " + this.target.position.X);
        if (safe != 0) {
            this.game.physics.arcade.moveToObject(this.sprite, {x: this.sprite.x+200*safe, y: this.sprite.y}, 200);
        } else if (this.target) {
            this.game.physics.arcade.moveToObject(this.sprite, {x: this.target.position.X, y: this.sprite.y}, 200);
        } else {
            this.stop();
        }
    }

    ship_constructor.prototype.setTracking = function(tracking) {
        this.tracking = tracking;
        tracking.onTargetChanges(this.targetChanged.bind(this));
    }

    ship_constructor.prototype.targetChanged = function(enemy) {
        this.target = enemy;
    }

    return ship_constructor;
});
