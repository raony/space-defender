define(["js/ship", "js/tracking"], function(ship, tracking) {
    describe("Ship", function() {
        var Phaser, game;
        beforeEach(function () {
            Phaser = {Physics: {ARCADE: "ARCADE"}};
            game = {
                time: {
                    now: 0
                },
                add: {
                    sprite: function(X, Y, sprite) {
                        return {
                            anchor: {
                                setTo: function(w,h) {
                                }
                            }
                        };
                    }
                },
                physics: {
                    enable: function(sprite, physics) {
                        sprite.body = {
                            velocity: {
                                setTo: function(x, y) {}
                            }
                        }
                    },
                    arcade: {
                        moveToObject: function() {}
                    }
                }
            }

        });
        it("should create arcade sprite when built", function() {
            spyOn(game.add, "sprite").and.callThrough();
            var target = new ship(Phaser, game, "ship", 100, 200);
            expect(game.add.sprite).toHaveBeenCalledWith(100, 200, "ship");
        });
        it("should stop sprite when called stop()", function() {
            var target = new ship(Phaser, game, "ship", 100, 200);
            spyOn(target.sprite.body.velocity, "setTo");
            target.stop();
            expect(target.sprite.body.velocity.setTo).toHaveBeenCalledWith(0,0);
        });
        it("should subscribe to onTargetChanges when setTracking", function() {
            var target = new ship(Phaser, game, "ship", 100, 200);
            var simple = new tracking.simple([]);
            spyOn(target, 'targetChanged');
            target.setTracking(simple);
            simple.callback();
            expect(target.targetChanged).toHaveBeenCalled();
        });
        it("should move sprite to target when update", function() {
            var target = new ship(Phaser, game, "ship", 100, 200);
            var simple = new tracking.simple([]);
            spyOn(simple, "rightmost").and.returnValue({ position: {X: 200, Y: 50} });
            target.setTracking(simple);
            spyOn(game.physics.arcade, "moveToObject");
            target.sprite.y = 200;
            target.update();
            expect(game.physics.arcade.moveToObject).toHaveBeenCalledWith(target.sprite, { x: 200, y: 200 }, 200);
        });
        it("should stop when right below the target", function() {
            var aship = new ship(Phaser, game, "ship", 100, 200);
            var simple = new tracking.simple([]);
            var alien = { position: {X: 200, Y: 50}, alive: function() { return this._alive; }, _alive: true };
            spyOn(simple, "rightmost").and.returnValue(alien);
            aship.setTracking(simple);
            spyOn(game.physics.arcade, "moveToObject");
            spyOn(aship, "stop");
            aship.sprite.y = 200;
            aship.update();
            expect(aship.stop).not.toHaveBeenCalled();
            alien._alive = false;
            aship.update();
            expect(aship.stop).toHaveBeenCalled();
        });
    });
});
