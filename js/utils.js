define({
    timeToHitY: function(body, Y) {
        if (body.velocity.Y == 0) return undefined;
        return (Y - body.position.Y)/body.velocity.Y;
    }

});
