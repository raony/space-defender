define(function() {
    var alien_constructor = function(sprite) {
        var self = this;
        self.sprite = sprite;
        self.position = {};
        Object.defineProperty(this.position, 'X', {
            get: function() { 
                return self.sprite.world.x; 
            },
            enumerable: true
        });
    };
    alien_constructor.prototype.alive = function() {
        return this.sprite.alive;
    };
    return alien_constructor;
});
