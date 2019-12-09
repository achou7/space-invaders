class Gameboard {

    constructor() {

        this.el = $('#gameboard');

        this.width = this.el.width();

        this.height = this.el.height();

    }

}



class Player {

    constructor() {

        this.setEl(false);

        this._setProperties();

    }



    setEl(playAgain){

        if(playAgain){

            this.el = $('<img />').attr({'src': './assets/images/ship-red.png', 'alt': 'Red player spaceship.'}).addClass('player');

            this.el.appendTo(game.gameboard.el);

            this.isExploding = false;

            this.isInvincible = false;

            this.isGameOver = false;

        }else {

            this.el = $('.player');

        }

    }



    _setProperties() {

        this.width = this.el.width();

        this.height = this.el.height();

        this.x = this.el.offset().left;

        this.y = this.el.offset().top;

        this.speed = 200;

        this.lasers = [null, null, null, null];

        this.maxlasersOnScreen = 3;

        this.lasersOnScreen = 0;

        this.pressed = false;

        this.color = "red";

        this.lives = 3;

        this.isInvincible = false;

        

    }



    move(e) {

        

        let distance;

        if(this.isExploding) {

            this.stopMove(e);

            return;



        }

        if(this.pressed) {

            return;

        }

        switch(e.which) {

            case 37:

                this.pressed = true;

                this.el.animate({left: 0 + (this.width/2)}, (this.el.position().left/this.speed)*1000);     

                break;

            case 39: 

                this.pressed = true;

                this.el.animate({left: (game.gameboard.width - (this.width/2))}, (((Math.abs(this.el.position().left - (game.gameboard.width - this.width))/this.speed))*1000));

            default:

                break;   

        }

    }



    shift(e) {

        if(e.which !== 90) {

            return;

        }



        else if(this.color == 'blue') {

            this.color = 'red';

            this.el.attr('src', './assets/images/ship-red.png');

        }



        else {

            this.color = 'blue';

            this.el.attr('src', './assets/images/ship-blue.png');

        }

    }



    stopMove(e) {

        if(e.which == 37 || e.which == 39) {

            this.el.stop(false, false);

            this.pressed = false;

        }



        else {

            return;

        }

    }



 

    fire(e){



        if(e.which !== 32){

            return;

        }

        if(game.plasersOnScreen <= game.maxplasersOnScreen){

            $('#laser_sound')[0].play();

            game.plasersOnScreen++;

            game.playerLasers.some((item, i) => {

                if(item === null){

                    game.playerLasers[i] = new Laser(this.color, false);

                    game.playerLasers[i].index = i;

                   

                    game.playerLasers[i].el.appendTo(game.gameboard.el)

                                    .css({'left': (this.el.position().left + (this.width/2)), 'top': this.el.position().top - (this.height), 'background-color': this.color});

                    

                    const time = this._duration(Math.abs(game.playerLasers[i].el.position().top - game.gameboard.height), game.playerLasers[i].speed, true);

                    game.playerLasers[i].el.animate({'top': 0}, time, 'linear', () => { this.reload(i); });

                    

                    return true;

                    

                }

            });

        }

    }



    _duration(distance, speed, isLaser){    

        const dur = (distance / speed) * 1000;

        if(isLaser){

            return dur;

        }else if(dur < 350){

            return 350;

        }else{

            return dur;

        }            

    }



    reload(i){

        game.plasersOnScreen--;

        game.playerLasers[i].el.stop();

        game.playerLasers[i].el.remove();

        game.playerLasers[i] = null;       

    }

    

    explode(lives){

        this.isExploding = true;

        this.el.attr({'src': './assets/images/explosion.gif', 'alt': 'Space Invader Explosion.'});

        if(lives < 1){

            setTimeout(() => {

                game.gameEnd = true;

                this.el.remove();

            }, 1000);

        }else{

            setTimeout(() => {

                this._regen();

            }, 1000);

        }        

    }



    _regen(){

        this.isExploding = false;

        this.isInvincible = true;

        this.el.addClass('invincible-flash');

        var regenSrc = "./assets/images/ship-" + this.color + ".png";

        this.el.attr({'src': regenSrc, 'alt': 'Player spaceship.'});

        setTimeout(() => {

            this.isInvincible = false;

            this.el.removeClass('invincible-flash');

        }, 2000);

    }

    

    

}



class Invader {

    constructor(type, color, pos) {

        

        this._setProperties(type, color , pos);

        this._setEl();

    }



    _setProperties(type, color, pos) {

        this.width = 50;

        this.height = 50;

        this.type = type;

        this.color = color;

        this.src = './assets/images/alien-' + type + '-' + color + '.gif';

        this.pos = pos;

        this.speedX = 7;

        this.speedY = 37.5;

        

    }



    _setEl() {

        this.el = $('<img />')

            .attr({'src': this.src, 'alt': 'Enemy space invader'})

            .addClass('invader')

            .css({'left': this.pos.x, 'top': this.pos.y});

        

        this.render();

    }



    render() {

        this.el.appendTo($('#gameboard'));

    }



    destroy() {

        this.el.remove();

    }



    move() {

        switch(this.pos.dir) {

            

            case 'left':

                var newPos = this.pos.x - this.speedX;

                

                if(newPos <= (game.gameboard.width*0.05)) {

                    this.el.stop(false, false);

                    this.pos.y += this.speedY;

                    this.pos.dir = 'right';

                    this.el.css('top', this.pos.y);

                }

                else {

                    this.pos.x -= this.speedX;

                    this.el.css('left', this.pos.x);

                }

                break;

            case 'right':

                var newPos = this.pos.x + this.speedX;

                

                if(newPos >= ($('#gameboard').width()*0.95)) {

                    this.pos.y += this.speedY;

                    this.pos.dir = 'left';

                    this.el.css('top', this.pos.y);

                }

                else {

                    this.pos.x += this.speedX;

                    this.el.css('left', this.pos.x);

                }

                break;

            default:

                console.log("default");

                break;

                

        }

    }



    fire() {

       

        if(game.elasersOnScreen <= game.maxelasersOnScreen){

            

            game.elasersOnScreen++;

            game.enemyLasers.some((item, i) => {

                if(item === null){

                    game.enemyLasers[i] = new Laser(this.color, false);

                    game.enemyLasers[i].index = i;

                    game.enemyLasers[i].el.appendTo(game.gameboard.el)

                                    .css({'left': (this.el.position().left + (this.width/2)), 'top': this.el.position().top + (this.height), 'background-color': 'green'});

                    

                    const time = this._duration(Math.abs(game.enemyLasers[i].el.position().top - game.gameboard.height), game.enemyLasers[i].speed, true);

                    game.enemyLasers[i].el.animate({'top': game.gameboard.height - game.player.height}, time, 'linear', () => { this.reload(i); });

                    

                    return true;

                }

            });

        }



    }



    explode() {

        this.el.attr({'src': './assets/images/explosion.gif', 'alt': 'Explosion.'});

        game.score += 1000;

        this.explodeTimeout = setTimeout(() => {

            this.destroy();

        }, 1000);

    }

    

    _duration(distance, speed, isLaser){    

        const dur = (distance / speed) * 1000;

        if(isLaser){

            return dur;

        }else if(dur < 350){

            return 350;

        }else{

            return dur;

        }            

    }



    reload(i){

        game.elasersOnScreen--;

        game.enemyLasers[i].el.stop();

        game.enemyLasers[i].el.remove();

        game.enemyLasers[i] = null;       

    }





}



class Boss {

    constructor(pos) {  

        this._setProperties(pos);

        this._setEl();

    }



    _setProperties(pos) {

        this.width = 250;

        this.height = 250;

        this.color = "red";

        this.src = './assets/images/metroid_red.gif';

        this.pos = pos;

        this.speedX = 20;

        this.health = 250;

        this.changeCounter = 0;

        this.bigLaserCounter = 0;

        this.half = false;

        

    }



    _setEl() {

        this.el = $('<img />')

            .attr({'src': this.src, 'alt': 'Enemy space invader boss'})

            .addClass('invader boss')

            .css({'left': this.pos.x, 'top': this.pos.y});

        

        this.render();

    }



    render() {

        this.el.appendTo($('#gameboard'));

    }



    destroy() {

        this.el.remove();

    }



    move() {

        this.changeCounter++;

        this.bigLaserCounter++;

        if(this.changeCounter >= 75) {

            var random = Math.floor(Math.random()*6);

            if(random <= 2) {

                this.changeCounter = 0;

                if(this.color == 'red') {

                    this.color = 'blue';

                    this.el.attr('src', './assets/images/metroid_blue.gif');

                }

                else {

                    this.color = 'red';

                    this.el.attr('src', './assets/images/metroid_red.gif');

                }

            }

            

        }

        if(this.bigLaserCounter >= 100) {

            var random = Math.floor(Math.random()*6);

            if(random >= 5 && this.bigLaserCounter >= 125) {

                $('#warning-message').html("Shift to " + this.color + "!!");

                this.bigLaserCounter = 0;

                setTimeout(function() {

                    game.boss.shoopDaWoop();

                },800);

                

            }

        }



        switch(this.pos.dir) {

            

            case 'left':

                var newPos = this.pos.x - this.speedX;

                

                if(newPos <= (game.gameboard.width*0.05)) {

                    this.el.stop(false, false);

                    this.pos.y += this.speedY;

                    this.pos.dir = 'right';

                }

                else {

                    this.pos.x -= this.speedX;

                    this.el.css('left', this.pos.x);

                }

                break;

            case 'right':

                var newPos = this.pos.x + this.speedX;

                

                if(newPos >= ($('#gameboard').width()*0.95) - this.width) {

                    this.pos.y += this.speedY;

                    this.pos.dir = 'left';

                }

                else {

                    this.pos.x += this.speedX;

                    this.el.css('left', this.pos.x);

                }

                break;

            default:

                console.log("default");

                break;

                

        }

    }



    shoopDaWoop() {

        

            

           

            game.bigLaser.some((item, i) => {

                if(item === null){

                    let bigColor = 'red';

                    if(this.color == 'red') {

                        bigColor = 'blue';

                    }

                    game.bigLaser[i] = new Laser(bigColor, true);

                    game.bigLaser[i].index = i;

                    

                    

                        game.bigLaser[i].el.appendTo(game.gameboard.el)

                                        .css({'left': 0, 'top': this.el.position().top + (this.height), 'background-color': bigColor});

                        

                        const time = this._duration(Math.abs(game.bigLaser[i].el.position().top - game.gameboard.height), game.bigLaser[i].speed, true);

                        game.bigLaser[i].el.animate({'top': game.gameboard.height - game.player.height}, time, 'linear', () => { this.bigReload(i); });

                        $('#warning-message').html("");

                        return true;

                    

                }

            });

        

    }



    fire() {

        if(game.elasersOnScreen <= game.maxelasersOnScreen){

            

            game.elasersOnScreen++;

            game.enemyLasers.some((item, i) => {

                if(item === null){

                    game.enemyLasers[i] = new Laser(this.color, false);

                    game.enemyLasers[i].index = i;

                    game.enemyLasers[i].el.appendTo(game.gameboard.el)

                                    .css({'left': (this.el.position().left + (this.width/2)), 'top': this.el.position().top + (this.height), 'background-color': 'green'});

                    

                    const time = this._duration(Math.abs(game.enemyLasers[i].el.position().top - game.gameboard.height), game.enemyLasers[i].speed, true);

                    game.enemyLasers[i].el.animate({'top': game.gameboard.height - game.player.height}, time, 'linear', () => { this.reload(i); });

                    

                    return true;

                }

            });

        }

    }



    explode() {

        this.el.attr({'src': './assets/images/explosion.gif', 'alt': 'Explosion.'});

        game.score += 1000;

        this.explodeTimeout = setTimeout(() => {

            this.destroy();

        }, 1000);

    }

    

    _duration(distance, speed, isLaser){    

        const dur = (distance / speed) * 1000;

        if(isLaser){

            return dur;

        }else if(dur < 350){

            return 350;

        }else{

            return dur;

        }            

    }



    reload(i){

        game.elasersOnScreen--;

        game.enemyLasers[i].el.stop();

        game.enemyLasers[i].el.remove();

        game.enemyLasers[i] = null;       

    }



    bigReload(i) {

        game.bigLaser[i].el.stop();

        game.bigLaser[i].el.remove();

        game.bigLaser[i] = null;  

    }





}





class Laser {

    constructor(color, big){

        if(!big) {

            this.width = 5;

            this.height = 35;

            this.speed = 100; // 600 px per second

        }

        else {

            this.width = game.gameboard.width;

            this.height = 25;

            this.speed = 700; // 600 px per second

        }

            this.color = color;

            this.el = $('<div></div>')

                            .addClass('laser')

                            .css({'width': this.width, 'height': this.height});

           

        

        

    }

}





class Game {

    constructor() {

        this.boss = null;

        this.gameboard = new Gameboard();

        this.player = new Player();

        this.invaders = [];

        this.clock = null;

        this.requestFrame = null;

        this.gameSpeed = 110;

        this.playerLasers = [null,null, null];

        this.maxplasersOnScreen = 3;

        this.plasersOnScreen = 0;

        this.enemyLasers = [null,null,null,null,null,null, null, null];

        this.maxelasersOnScreen = 8;

        this.elasersOnScreen = 0;

        this.bigLaser = [null];

        this.gameEnd = false;

        this.level = 1;

        this.score = 0;
	
	this.extraLife = 50000;


    }



    init() {

        this.gameboard = new Gameboard();

        this.player = new Player();

        $('#score').html(this.score);

        this._spawnInvaders(this.level);

        this._animLoop();

        this._gameLoop();


    }



    _spawnBoss(posY) {

        let x= this.gameboard.width*0.5;

        let pos = {'x': x, 'y': posY, 'dir': 'right'};

        this.boss = new Boss(pos);

        $('.warning-messages').fadeIn();



    }



    _spawnInvadersRow(posY, type, color, alternate) {

        let x = this.gameboard.width*0.10;

        

        for(let i=0;i<12;i++) {

            let pos = {'x': x, 'y': posY, 'dir': 'left'};

            if(alternate && (i%2 == 0)) {

                if(color == 'blue') {

                    color = 'red'

                }

                else {

                    color = 'blue';

                }

            }

            let inv = new Invader(type, color, pos, i);

            this.invaders.push(inv);

            x += 75;

        }

    }  



    _spawnInvaders(level) {

        let startHeight = game.gameboard.height/20

        switch(level) {

            case 1:

                this._spawnInvadersRow(startHeight, 'one', 'red', false);

                this._spawnInvadersRow(startHeight + 75, 'two', 'blue', false);

                this._spawnInvadersRow(startHeight + 150, 'one', 'red', false);

                this._spawnInvadersRow(startHeight + 225, 'two', 'blue', false);

                this.enemyLasers = [null,null,null,null,null,null, null];

                this.maxelasersOnScreen = 7;

                this.gameSpeed = 110;

                break;

            case 2:

                this._spawnInvadersRow(startHeight, 'one', 'red', false);

                this._spawnInvadersRow(startHeight + 75, 'two', 'blue', true);

                this._spawnInvadersRow(startHeight + 150, 'one', 'red' , false);

                this._spawnInvadersRow(startHeight + 225, 'two', 'blue' , true);

                this.enemyLasers = [null,null,null,null,null,null, null, null];

                this.maxelasersOnScreen = 8;

                this.gameSpeed = 85;

                break;

            case 3:

                this._spawnInvadersRow(startHeight, 'two', 'red', false);

                this._spawnInvadersRow(startHeight + 75, 'two', 'blue', true);

                this._spawnInvadersRow(startHeight + 150, 'one', 'blue', true);

                this._spawnInvadersRow(startHeight + 225, 'two', 'blue', true);

                this._spawnInvadersRow(startHeight + 300, 'two', 'red', false);

                this.enemyLasers = [null,null,null,null,null,null, null, null, null];

                this.maxelasersOnScreen = 9;

                this.gameSpeed = 65;

                break;

            case 4:

                this._spawnInvadersRow(startHeight, 'two', 'red', false);

                this._spawnInvadersRow(startHeight + 75, 'two', 'blue', true);

                this._spawnInvadersRow(startHeight + 150, 'one', 'blue', true);

                this._spawnInvadersRow(startHeight + 225, 'two', 'blue', true);

                this._spawnInvadersRow(startHeight + 300, 'two', 'red', false);

                this._spawnInvadersRow(startHeight + 375, 'two', 'blue', true);

                this.enemyLasers = [null,null,null,null,null,null, null, null, null, null, null, null];

                this.maxelasersOnScreen = 12;

                this.gameSpeed = 65;

                break;

            case 5:

                this._spawnBoss(startHeight + 150);

                this.gameSpeed = 75;

                break;

            

            default:

                break;

        }

         

    }



    _enemyCollision() {

        

            this.playerLasers.forEach(function(laser, i) {

                if(laser == null) {

                    return;

                }

                if(game.boss != null) {

                    const laserHit = game._hitBoss(laser);

                    

                    if(laserHit) {

                        if(game.boss.color != laser.color) {

                            

                            game.boss.health -= 10;

                            

                            if(game.boss.health <= 10) {

                                game.boss.explode();

                                

                                game.boss = null;

                                    

                                return;

                            }

                            else if(game.boss.health < 100 && !game.boss.half) {

                                game._stopAudio();

                                game.boss.half = true;

                            }

                        }

                        game.player.reload(i);

                    }

                }

                else {

                

                    const laserHit = game._hitInvader(laser);



                    if(laserHit.hit) {

                        

                        if(game.invaders[laserHit.index].color == laser.color) {

                            game.invaders[laserHit.index].explode();

                            game.invaders.splice(laserHit.index, 1);

                        }

                        

                        game.player.reload(i);

                    }

                }

            });

    }    



    _playerCollision() {

            this.enemyLasers.forEach(function(laser, i) {

                if(laser == null || game.player.isInvincible || game.player.isExploding) {

                    return;

                }

                const laserHit = game._hitPlayer(laser, false);

                if(laserHit) {

                    

                    game.player.lives--;

                    game.player.explode(game.player.lives);

                    if(game.invaders[0] !== null && game.invaders.length !== 0) {

                        game.invaders[0].reload(i);

                    }

                    if(game.boss !== null && game.boss.health > 0) {

                        game.boss.reload(i);

                    }

                }

            });

            this.bigLaser.forEach(function(laser, i) {

                if(laser == null || game.player.isInvincible || game.player.isExploding) {

                    return;

                }

                const laserHit = game._hitPlayer(laser, true);

                if(laserHit) {

                    if(laser.color == game.player.color) {

                        game.player.lives--;

                        game.player.explode(game.player.lives);

                        game.boss.bigReload(i);

                    }

                }

            })

        }

    



    _hitPlayer(laser, big) {

        laser.x = laser.el.offset().left;

        laser.y = laser.el.offset().top;

        let playerX = game.player.el.offset().left;

        let playerY = game.player.el.offset().top;

        if(!big) {

            return (laser.x >= playerX && laser.x <= (playerX + game.player.width)) && (laser.y >= playerY && laser.y <= (playerY + game.player.height));

        }



        else {

            return laser.y >= playerY && laser.y <= (playerY + game.player.height);

        }

    }



    _hitInvader(laser) {

        laser.x = laser.el.offset().left;

        laser.y = laser.el.offset().top;

        let index = null;

        let points = 0;

        let hit = game.invaders.some( (invader, i) => {

            invader.x = invader.el.offset().left;

            invader.y = invader.el.offset().top;

            index = i;

            points += 100;

            return (laser.x >= invader.x && laser.x <= invader.x + invader.width) && (laser.y >= invader.y && laser.y <= invader.y + invader.height);

                

                

            

        });

        

        return {hit, index, points};

    }



    _hitBoss(laser) {

        laser.x = laser.el.offset().left;

        laser.y = laser.el.offset().top;

        let bossX = this.boss.el.offset().left;

        let bossY = this.boss.el.offset().top;



        return (laser.x >= bossX && laser.x <= bossX + game.boss.width) && (laser.y >= bossY && laser.y <= bossY + game.boss.height);

        

    }



    _newLevel() {

        

        clearInterval(this.clock);

        clearInterval(this.requestFrame);

        $('audio').each(function() {

            this.pause();

            this.currentTime = 0;

        });

        


        this.enemyLasers.forEach(function(laser, i) {

            if(laser !== null) {

                game.enemyLasers[i] = null;

                game.elasersOnScreen--;

                laser.el.stop();

                laser.el.remove();

            }

                

        });

        

        this.playerLasers.forEach(function(laser, i) {

            if(laser !== null) {

                game.player.reload(i);

            }        

        });

        

        this._spawnInvaders(this.level);

        

        let level = this.level;

        setTimeout(function() {

            $('#level-clear').fadeOut();

            game._animLoop();

            game._gameLoop();

        }, 5000)

    }



    _updateStats() {

        $('#score').html(this.score);

        $('#lives').html(this.player.lives);

        $('#lasercolor').css('background-color', this.player.color);

        $('#level').html(this.level);

        $('#remaining').html(this.invaders.length);

        $('#gameboard').css("border-color", this.player.color);

    }


    _stopAudio() {

        $('audio').each(function() {

            this.pause();

            this.currentTime = 0;

        });

        

    }



    _endGame() {

        if(this.invaders.length !== 0) {

            this.invaders.forEach(function(inv) {

                inv.explode();

            });

        }

        this.enemyLasers.forEach(function(laser, i) {

            if(laser !== null) {

                game.enemyLasers[i] = null;

                game.elasersOnScreen--;

                laser.el.stop();

                laser.el.remove();

            }

                

        });

        

        this.playerLasers.forEach(function(laser, i) {

            if(laser !== null) {

                game.player.reload(i);

            }        

        });

        this.invaders = [];

        clearInterval(this.requestFrame);

        clearInterval(this.clock);

    }



    _animLoop() {

        if(this.invaders.length == 0 && this.boss == null) {

            this.level++;

            if(this.level == 6) {

                this._stopAudio();


                $('#win-game').fadeIn({

                    done: function() {

                            game._endGame();    

                        }

                });

                return;

            }

            $('#level-clear').fadeIn({

                done: function() {game._newLevel()}

            });

        

            return;

        }

        if(this.invaders.length !== 0) {

            var lastIndex = this.invaders.length - 1;

            var lastInvPos = this.invaders[lastIndex].el.position().top;

            if(lastInvPos >= this.player.y - 100) {

                this.gameEnd = true;

                return;

            }

            if(this.invaders[lastIndex].el.position().top >= (this.gameboard.height*0.3)) {   

                this.gameSpeed = 50;

            }

            this.invaders.forEach(function(inv) {

                inv.move();

            });

        }

        if(this.boss !== null) {

            this.boss.move();

        }

        

        this.requestFrame = setTimeout(() => { this._animLoop() }, this.gameSpeed); 

    }



    



    _gameLoop() {

        if(this.gameEnd) {

            this._stopAudio();

            $('#game-end').fadeIn({

                done: function() {

                    game._endGame();

                }

            });

            return;

        }

        if(this.invaders.length != 0) {

            var random = Math.floor(Math.random()*(this.invaders.length - 1));

            this.invaders[random].fire();

        }



        if(this.boss !== null) {

            this.boss.fire();

            $('#hp').html(this.boss.health);

        }

        if(this.score>= this.extraLife) {
	    this.player.life++;
            this.extraLife += this.extraLife;
        }
        this._playerCollision();

        this._enemyCollision();

        this._updateStats();

        this.clock = setTimeout(() => { this._gameLoop() }, 1000/30); 

    }

}



const game = new Game();

const $window = $(window);



$window.on('keydown', function(e) {game.player.move(e);game.player.fire(e); game.player.shift(e)});

$window.on('keyup', function(e) { game.player.stopMove(e)});



$("#game-start").click(function() {

    $("#splash-screen").fadeOut();

    $('#instructions').fadeIn();

    

});



$("#ready-start").click(function() {

    $('#instructions').fadeOut();

    game.init();

});



$('.quit-game').click(function() {

    location.reload();

});



$(".play-again").click(function() {

    $('.warning-messages').fadeOut();

    game._stopAudio();

    game.gameEnd = false;

    game._spawnInvaders(1);

    if(game.boss !== null) {

        game.boss.el.remove();

        game.boss = null;

    }

    game.player.el.remove();

    game.player.setEl(true);

    game.player._setProperties();

    game.level = 1;

    game.score = 0;
    
    game.extraLife = 50000;
    if($('#game-end').css('display') != 'none') {

        $('#game-end').fadeOut();

    }

    else {

        $('#win-game').fadeOut();

    }


    game._animLoop();

    game._gameLoop();



});