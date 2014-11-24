define(['js/utils'], function(utils) {

    describe("Utils package", function() {
        describe("timeToHitY function", function() {
            it("calculate how much time it would take to constant moving body hit height Y", function() {
                var body = {
                    position: {
                        Y: 200
                    },
                    velocity: {
                        Y: 15
                    }
                };
                expect(utils.timeToHitY(body, 350)).toBe(10);
                body.velocity.Y = 30;
                expect(utils.timeToHitY(body, 350)).toBe(5);
            });
            it("returns negative time for body moving away of Y", function() {
                var body = {
                    position: {
                        Y: 400
                    },
                    velocity: {
                        Y: 15
                    }
                };
                expect(utils.timeToHitY(body, 350)).toBeLessThan(0);
            });
            it("return 'undefined' for a body that is not moving", function() {
                var body = {
                    position: {
                        Y: 200
                    },
                    velocity: {
                        Y: 0
                    }
                };
                expect(utils.timeToHitY(body, 350)).toBeUndefined();
            });
        });

        describe("positionWhenHitY", function() {
            it("returns the (X,Y,T) position of a moving body when it hits Y", function() {
                var body = {};
                body.position = {X: 10, Y: 50};
                body.velocity = {X: 5, Y: 20};
                expect(utils.positionWhenHitY(body, 110)).toEqual({X: 25, Y: 110, T: 3});
            });
            it("returns (undefined, Y, undefined) position when the body is still relative to Y", function() {
                var body = {};
                body.position = {X: 10, Y: 50};
                body.velocity = {X: 15, Y: 0};
                expect(utils.positionWhenHitY(body, 110)).toEqual({X: undefined, Y: 110, T: undefined});
            });
        });

        describe("threatArea function", function() {
            it("returns a rectangular of threat to hit of a moving body when it comes through an Y range", function() {
                var body = {};
                body.position = {X: 10, Y: 50};
                body.velocity = {X: 5, Y: 20};
                expect(utils.threatArea(body, 110, 130)).toEqual({
                    Top: {X: 25, Y: 110, T: 3},
                    Bottom: {X: 30, Y: 130, T: 4}
                });
            });
        });
    });
});
