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
    });
});
