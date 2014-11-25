define(function() {
    return {
        simple: function (enemies) {
            this.enemies = enemies.slice();

            this.enemies.sort(function(a,b) {
                return a.position.X - b.position.X;
            });
            this.lastTarget = undefined;
            this.right = false;

            this.rightmost = function () {
                var result = undefined;
                do {
                   result = this.enemies.splice(-1, 1)[0];
                } while (result && !result.alive());
                return result;
            };
            this.leftmost = function () {
                var result = undefined;
                do {
                   result = this.enemies.splice(0, 1)[0];
                } while (result && !result.alive());
                return result;
            };
            this.onTargetChanges = function(callback) {
                this.callback = callback;
            };
            this.update = function () {
                if (this.callback) {
                    if (this.lastTarget)
                        console.log(this.lastTarget.alive());
                    if (!this.lastTarget || !this.lastTarget.alive()) {
                        var newTarget;
                        if (this.right) {
                            this.right = false;
                            newTarget = this.leftmost();
                        } else {
                            this.right = true;
                            newTarget = this.rightmost();
                        }
                        if (newTarget !== this.lastTarget) {
                            this.lastTarget = newTarget;
                            this.callback(this.lastTarget);
                        }
                    }
                }
            };
        }
    };
});
