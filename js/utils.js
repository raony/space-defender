define(function() {
    return new function() {
        this.timeToHitY = function(body, Y) {
            if (body.velocity.Y == 0) return undefined;
            return (Y - body.position.Y)/body.velocity.Y;
        };
        this.positionWhenHitY = function(body, Y) {
            var result = {Y:Y, T: this.timeToHitY(body, Y)};
            if (result.T) {
                result.X = body.position.X + body.velocity.X*result.T;
            } else { 
                result.X = undefined;
            }
            return result;
        };
        this.threatArea = function(body, topY, bottomY) {
            var result = {};
            result.Top = this.positionWhenHitY(body, topY);
            result.Bottom = this.positionWhenHitY(body, bottomY);
            return result;
        };
    };

});
