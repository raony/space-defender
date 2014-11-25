define(["js/tracking"], function(tracking) {
    describe("Tracking package", function() {
        describe("Simple strategy", function() {
            var rightmost, leftmost, center, enemies;
            var isAlive = function () {
                return this._alive;
            }
            beforeEach(function () {
                rightmost = { position: { X: 150, Y: 50}, _alive: true };
                rightmost.alive = isAlive;
                center = { position: { X: 100, Y: 20 }, _alive: true };
                center.alive = isAlive;
                leftmost = { position: { X: 50, Y: 60}, _alive: true };
                leftmost.alive = isAlive;
                enemies = [leftmost, rightmost, center];
            });
            it("is able to recognize rightmost alive enemy", function() {
                rightmost._alive = false;
                expect((new tracking.simple(enemies)).rightmost()).toBe(center);
            });
            it("is able to recognize leftmost enemy", function() {
                leftmost._alive = false;
                expect((new tracking.simple(enemies)).leftmost()).toBe(center);
            });
            it("starts with rightmost alive target and just trigger when target changes", function() {
                var target = new tracking.simple(enemies);
                var callback = jasmine.createSpy('callback');
                target.onTargetChanges(callback);
                target.update()
                expect(callback).toHaveBeenCalledWith(rightmost);
                callback.calls.reset();
                target.update()
                expect(callback).not.toHaveBeenCalled();
            });
            it("changes from one side to the other when target dies", function() {
                var target = new tracking.simple(enemies);
                var callback = jasmine.createSpy('callback');
                target.onTargetChanges(callback);
                target.update()
                expect(callback).toHaveBeenCalledWith(rightmost);
                rightmost._alive = false;
                callback.calls.reset();
                target.update()
                expect(callback).toHaveBeenCalledWith(leftmost);
                leftmost._alive = false;
                callback.calls.reset();
                target.update()
                expect(callback).toHaveBeenCalledWith(center);
            });
        });
    });
});
