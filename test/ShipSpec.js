define(["js/ship"], function(ship) {
    describe("Ship", function() {
        var Phaser, game;
        beforeEach(function () {
            Phaser = {Physics: {ARCADE: "ARCADE"}};
            game = {
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
    });
});
