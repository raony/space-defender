require(['ship', 'tracking', 'alien'], function(ship, tracking, alien) {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', 
            { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.image('bullet', 'assets/bullet.png');
        game.load.image('enemyBullet', 'assets/enemy-bullet.png');
        game.load.spritesheet('invader', 'assets/invader32x32x4.png', 32, 32);
        game.load.image('ship', 'assets/player.png');
        game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
        game.load.image('starfield', 'assets/starfield.png');
        game.load.image('background', 'assets/background2.png');

    }

    var player;
    var aliens;
    var bullets;
    var bulletTime = 0;
    var cursors;
    var fireButton;
    var shieldButton;
    var explosions;
    var starfield;
    var score = 0;
    var energy = 3000;
    var maxEnergy = 3000;
    var fireCost = 50;
    var recoveryRate = 65;
    var originalFireCost = 50;
    var shieldCost = 300;
    var resting = true;
    var originalShieldCost = 300;
    var scoreString = '';
    var scoreText;
    var lives;
    var enemyBullet;
    var firingTimer = 0;
    var stateText;
    var livingEnemies = [];
    var descends = 0;

    var nextKill;
    var minDist;

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

        //  The hero!
        player = new ship(Phaser, game, "ship", 400, 500, 20);

        //  The baddies!
        aliens = game.add.group();
        aliens.enableBody = true;
        aliens.physicsBodyType = Phaser.Physics.ARCADE;

        createAliens();
        

        //  The score
        scoreString = 'Casualties : ';
        scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

        //  Lives
        lives = game.add.group();
        game.add.text(game.world.width - 150, 10, 'Enemies : ', { font: '34px Arial', fill: '#fff' });

        //  Text
        stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
        stateText.anchor.setTo(0.5, 0.5);
        stateText.visible = false;

        // energy
        energyString = 'Energy : ';
        energyText = game.add.text(game.world.centerX, 10, energyString + energy, { font: '34px Arial', fill: '#fff' });
        energyText.anchor.setTo(0.5, 0);

        for (var i = 0; i < 3; i++) 
        {
            var shiplive = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
            shiplive.anchor.setTo(0.5, 0.5);
            shiplive.angle = 90;
            shiplive.alpha = 0.4;
        }

        //  An explosion pool
        explosions = game.add.group();
        explosions.createMultiple(30, 'kaboom');
        explosions.forEach(setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        shieldButton = game.input.keyboard.addKey(Phaser.Keyboard.S);
    }

    function createAliens () {
        descends = 0;

        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var _alien = aliens.create(x * 48, y * 50, 'invader');
                _alien.name = 'alien_' + x + '_' + y;
                _alien.anchor.setTo(0.5, 0.5);
                _alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                _alien.play('fly');
                _alien.body.moves = false;
            }
        }

        aliens.x = 100;
        aliens.y = 50;

        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  When the tween loops it calls descend
        tween.onLoop.add(descend, this);


        var aliensArray = [];
        aliens.forEach(function (currentAlien) {
            aliensArray.splice(0,0,new alien(currentAlien));
        });
        player.setTracking(new tracking.simple(aliensArray));
    }

    function setupInvader (invader) {

        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');

    }

    function descend() {

        if (descends < 15) {
            aliens.y += 10;
            descends += 1;
        }

    }

    function update() {

        //  Scroll the background
        starfield.tilePosition.y += 2;

        player.update(enemyBullets);

        fireBullet();
        
        if (game.time.now > firingTimer)
        {
            if (fireButton.isDown) {
                energy -= fireCost;
                fireCost = Math.floor(fireCost*1.6);
                if (energy > 0) {
                    enemyFires();
                    firingTimer = game.time.now + 500;
                }
                resting = false;
            } else {
                resting = true;
            }
        }


        //  Run collision
        game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
        game.physics.arcade.overlap(enemyBullets, player.sprite, enemyHitsPlayer, null, this);
        if (resting && !shieldButton.isDown) {
            fireCost = originalFireCost;
            shieldCost = originalShieldCost;
            energy += recoveryRate;
        }

        if (energy >= maxEnergy)
            energy = maxEnergy;
        else if (energy < 0) 
            energy = 0;
        energyText.text = energyString + energy;
    }

    function render() {

        // for (var i = 0; i < aliens.length; i++)
        // {
        //     game.debug.body(aliens.children[i]);
        // }

    }

    function collisionHandler (bullet, alien) {

        //  When a bullet hits an alien we kill them both
        bullet.kill();
        //console.log('kill: '+ alien.name);
        if (shieldButton.isDown && energy >= shieldCost)  {
            energy -= shieldCost;
        } else {
            alien.kill();
            score += 20;
            scoreText.text = scoreString + score;
        }

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('kaboom', 30, false, true);

        if (aliens.countLiving() == 0)
        {
            score += 1000;
            scoreText.text = scoreString + score;

            enemyBullets.callAll('kill',this);
            stateText.text = " You Won, \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart,this);
        }

    }

    function enemyHitsPlayer (player,bullet) {
        
        bullet.kill();

        live = lives.getFirstAlive();

        if (live)
        {
            live.kill();
        }

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('kaboom', 30, false, true);

        player.reset(400,500);

        // When the player dies
        if (lives.countLiving() < 1)
        {
            player.kill();
            enemyBullets.callAll('kill');

            stateText.text=" GAME OVER \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart,this);
        }

    }

    function enemyFires () {

        //  Grab the first bullet we can from the pool
        enemyBullet = enemyBullets.getFirstExists(false);

        livingEnemies.length=0;

        aliens.forEachAlive(function(alien){

            // put every living enemy in an array
            livingEnemies.push(alien);
        });


        if (enemyBullet && livingEnemies.length > 0)
        {
            
            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToPointer(enemyBullet,120);
        }

    }

    function fireBullet () {

        //  To avoid them being allowed to fire too fast we set a time limit
        if (game.time.now > bulletTime)
        {
            //  Grab the first bullet we can from the pool
            bullet = bullets.getFirstExists(false);

            if (bullet)
            {
                //  And fire it
                bullet.reset(player.sprite.x, player.sprite.y + 8);
                bullet.body.velocity.y = -400;
                bulletTime = game.time.now + 200;
            }
        }

    }

    function resetBullet (bullet) {

        //  Called if the bullet goes out of the screen
        bullet.kill();

    }

    function restart () {

        //  A new level starts
        
        //resets the life count
        lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        aliens.removeAll();
        createAliens();

        //revives the player
        player.sprite.revive();
        //hides the text
        stateText.visible = false;

    }

    function test(position) {
        var result = true;
        enemyBullets.forEachAlive(function (bullet) {
            if (Phaser.Point.distance(bullet.position, position) < 120) {
                console.log('is going to hit');
                result = false;
            }
        }, this);
        return result;
    }
});
