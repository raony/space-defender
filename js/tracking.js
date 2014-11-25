define(function() {
    return {
        simple: function (enemies) {

            this.lastTarget = undefined;
            this.right = false;

            this.rightmost = function () {
                var result = undefined;
                enemies.forEachAlive(function (enemy) {
                    if (enemy.alive() && (result === undefined || enemy.position.X > result.position.X))
                        result = enemy;
                });
                return result;
            };
            this.leftmost = function () {
                var result = undefined;
                enemies.forEachAlive(function (enemy) {
                    if (enemy.alive() && (result === undefined || enemy.position.X < result.position.X))
                        result = enemy;
                });
                return result;
            };
            this.onTargetChanges = function(callback) {
                this.callback = callback;
            };
            this.update = function () {
                if (this.callback) {
                    var newTarget;
                    if (!this.lastTarget || !this.lastTarget.alive()) {
                        if (this.right) {
                            this.right = false;
                            newTarget = this.leftmost();
                        } else {
                            this.right = true;
                            newTarget = this.rightmost();
                        }
                    }

                    if (newTarget && newTarget !== this.lastTarget) {
                        this.lastTarget = newTarget;
                        this.callback(this.lastTarget);
                    }
                }
            };
        }
    };
});
