var player;
var playerHalfWidth;
var ground;
var cursors;
var iceRespawnTimer;
var snowballRespawnTimer;
var ices;
var snowballs;
var score = 0;
var scoreText;
var menuSound, collectSound, gameOverSound, playingSound;
var menuIce;
var score;

var ScoreStorage = {
  getMaximumScore: function() {
    return window.localStorage.getItem("maximumRecord") || 0;
  },
  setMaximumScore: function(candidateScore) {
    if (candidateScore > ScoreStorage.getMaximumScore()) {
      window.localStorage.setItem("maximumRecord", candidateScore);
    }
  }
};

var GameCreator = {
  setup: function() {
    GameCreator.setupPhisics();
    GameCreator.setupWorld();
    GameCreator.setupScenario();
    GameCreator.setupIces();
    GameCreator.setupSnowballs();
    GameCreator.setupPlayer();
    GameCreator.setupInputs();
    GameCreator.setupScore();
    GameCreator.setupSounds();

  },
  setupPhisics: function() {
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
  },
  setupWorld: function() {
    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
    // Here we create the ground.
    //  The platforms group contains the ground and the 2 ledges we can jump on
    ground = game.add.tileSprite(0, game.height - 70, game.width, 70, 'ground');
    game.physics.arcade.enableBody(ground);
    //  We will enable physics for any object that is created in this group
    ground.enableBody = true;

    ground.body.immovable = true;
  },
  setupScenario: function() {
    var currentResource;
    currentResource = game.add.sprite(10, game.height - 0.8*70 - 69, 'tree');
    currentResource.scale.setTo(0.8, 0.8);
    currentResource = game.add.sprite(60, game.height - 0.7* 70 - 69, 'tree');
    currentResource.scale.setTo(0.7, 0.7);
    currentResource = game.add.sprite(25, game.height - 70 - 69, 'tree');
    currentResource = game.add.sprite(130, game.height - 70 - 70, 'rock');
    currentResource = game.add.sprite(140, game.height - 70 - 0.4*70, 'rock');
    currentResource.scale.setTo(0.4, 0.4);
    currentResource = game.add.sprite(game.width - 100, game.height - 70 - 70, 'rock');
    currentResource = game.add.sprite(game.width - 100, game.height - 70 - 0.4*70, 'rock');
    currentResource.scale.setTo(0.4, 0.4);
    currentResource = game.add.sprite(game.width - 70, game.height - 70 - 0.7*70, 'rock');
    currentResource.scale.setTo(0.7, 0.7);
    currentResource = game.add.sprite(game.width - 120, game.height - 70 - 69, 'tree');
    currentResource = game.add.sprite(game.width/2, game.height - 70 - 0.6*70, 'red_candy');
    currentResource.scale.setTo(0.6, 0.6);
    currentResource = game.add.sprite(game.width/2 + 20, game.height - 70 - 59, 'red_candy2');
    currentResource = game.add.sprite(game.width/2 - 90, game.height - 70 - 70, 'green_candy');
  },
  setupIces: function() {
    ices = game.add.group();
    ices.enableBody = true;
    ices.createMultiple(4, 'ice');

    iceRespawnTimer = game.time.events.loop(800, WorldManager.respawnIces, this);
  },
  setupSnowballs: function() {
    snowballs = game.add.group();
    snowballs.enableBody = true;
    snowballs.createMultiple(7, 'snowball');
    WorldManager.respawnSnowballs();
    WorldManager.respawnSnowballs();
    WorldManager.respawnSnowballs();
    snowballRespawnTimer = game.time.events.loop(500, WorldManager.respawnSnowballs, this);
  },
  setupPlayer: function() {

    player = game.add.sprite(32, game.world.height - 150, 'player');
    game.physics.arcade.enable(player);
    game.physics.arcade.enableBody(player);

    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.y = game.height - player.height;
    player.body.width = 100;

    playerHalfWidth = player.width / 2;
  },
  setupInputs: function() {
    cursors = game.input.keyboard.createCursorKeys();
  },
  setupScore: function() {
    scoreText = game.add.text(16, 16, '0', { fontSize: '32px', fill: '#000' });
  },
  setupSounds: function() {
    collectSound = game.add.audio('iceCollected');
    gameOverSound = game.add.audio('gameOverSound');
    playingSound = game.add.audio('background');
    playingSound.play('', 0, 0.5, true);
  }
}


var ColisionManager = {
  handler: function() {

    game.physics.arcade.collide(player, ground);

    game.physics.arcade.overlap(ground, ices, ColisionManager.destroyItem, null, this);
    game.physics.arcade.overlap(ground, snowballs, ColisionManager.destroyItem, null, this);
    //  Checks to see if the player overlaps with any of the ices, if he does call the collectIce function
    game.physics.arcade.overlap(player, ices, ColisionManager.collectIce, null, this);
    game.physics.arcade.overlap(player, snowballs, ColisionManager.gameover, null, this);
  },
  destroyItem: function(ground, ice) {
    ice.kill();
  },
  collectIce: function(player, ice) {
    // Removes the ice from the screen
    ice.kill();
    //  Add and update the score
    score += 1;
    scoreText.text = score;
    collectSound.play();
  },
  gameover: function(player, snowball) {
    // Removes the snowball from the screen
    game.time.events.remove(iceRespawnTimer);
    game.time.events.remove(snowballRespawnTimer);
    playingSound.stop();
    snowball.kill();
    gameOverSound.play();
    ScoreStorage.setMaximumScore(score);
    game.state.start('gameover');
  }
};


var WorldManager = {
  respawnIces: function() {
    WorldManager.addOneIce();
  },
  respawnSnowballs: function() {
    var snowball = snowballs.getFirstDead();
    var x = Math.random() * (game.world.width - 40);
    x = Math.max(x, 40);
    if (snowball) {
      snowball.scale.setTo(0.8, 0.8);
      snowball.body.width = 60;
      snowball.body.height = 60;
      snowball.reset(x, 0);
      snowball.body.gravity.y = 500 + 1000*Math.random();
    }
  },
  addOneIce: function() {
    var ice = ices.getFirstDead();
    var x = Math.random() * (game.world.width - 40);
    x = Math.max(x, 40)
    if (ice) {
      ice.scale.setTo(0.5, 0.5);
      ice.body.width = 35;
      ice.body.height = 20;
      ice.reset(x, 0);
      ice.body.gravity.y = 500 + 1000*Math.random();
    }
  }
};

var GameUpdater = {
  run: function() {
    GameUpdater.checkColisions();
    GameUpdater.doPlayerMovementByMouse();
  },
  checkColisions: ColisionManager.handler,

  doPlayerMovementByMouse: function() {
    if (game.physics.arcade.distanceToPointer(player, game.input.activePointer) > 10) {
      game.physics.arcade.moveToXY(player, game.input.activePointer.x, player.y, 1000, 100);
    } else {
      player.body.velocity.set(0);
    }
  },
  doPlayerMovementByKey: function() {
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
  }
}

// ====== STATES

// ============== MENU STATE
var PLAY_STATE = {
  preload: function preload() {
    score = 0;
    // images

    // scenario

    // audios
    game.load.audio('iceCollected', 'assets/gmae.mp3');
    game.load.audio('gameOverSound', 'assets/perdeu.mp3');
    game.load.audio('background', 'assets/background.mp3');
  },
  create: GameCreator.setup,
  update: GameUpdater.run
}

// ============== PLAY STATE
var MENU_STATE = {
  preload: function preload() {
    // images
    game.load.image('sky', 'assets/sky.jpg');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('ice', 'assets/iceBlockHalfAlt.png', 70, 40);
    game.load.image('player', 'assets/player.png', 32, 48);
    game.load.image('snowball', 'assets/snowBallBig.png');
    game.load.image('startButton', 'assets/play.png');
    game.load.image('logo', 'assets/logo.png');

    // scenario
    game.load.image('plant', 'assets/plant.png');
    game.load.image('plantAlt', 'assets/plantAlt.png');
    game.load.image('red_candy', 'assets/red_candy.png');
    game.load.image('red_candy2', 'assets/red_candy2.png');
    game.load.image('green_candy', 'assets/green_candy.png');
    game.load.image('rock', 'assets/rock.png');
    game.load.image('tree', 'assets/tree.png');

    // audios
    game.load.audio('intro', 'assets/intro.mp3');
  },
  create: function() {
    // world
    GameCreator.setupPhisics();
    GameCreator.setupWorld();
    GameCreator.setupScenario();
    player = game.add.sprite(200, game.world.height - 100, 'player');
    game.physics.arcade.enable(player);
    game.physics.arcade.enableBody(player);

    // player animation
    menuIce = game.add.sprite(210, 0, 'ice');
    menuIce.scale.setTo(0.5, 0.5);
    game.physics.arcade.enable(menuIce);
    game.physics.arcade.enableBody(menuIce);
    menuIce.checkWorldBounds = true;
    menuIce.outOfBoundsKill = true;
    menuIce.body.gravity.y = 500;

    // sounds
    menuSound = game.add.audio('intro');
    menuSound.play('', 0, 0.8, true);

    // play
    var startButton = game.add.button(game.width/2, game.height*2/3, 'startButton', function() {
      menuSound.stop();
      game.state.start('play');
    }, this);
    startButton.anchor.setTo(0.5,0.5);
    game.add.tween(startButton).to({y: (game.height*2/3 + 10)}, 700, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
    // score
    scoreText = game.add.text(game.width/2, game.height*2/3 - 80, 'Your record is: ' + ScoreStorage.getMaximumScore(), { fontSize: '32px', fill: '#fff', shadowBlur: 7, shadowColor: '#5aa4c0' });
    scoreText.anchor.setTo(0.5,0.5);

    // logo

    var logo = game.add.sprite(game.world.width/2, 50, 'logo');
    logo.anchor.setTo(0.5, 0);
    // game.add.tween(logo).to({y: 80}, 700, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {

    game.physics.arcade.overlap(player, menuIce, function() {
      menuIce.reset(210, 0);
      menuIce.body.gravity.y = 500 + Math.random()* 800;
    }, null, this);
  }
}

// ====== GAME OVER STATE

var GAMEOVER_STATE = {
  preload: function preload() {
    game.load.image('gameoverChar', 'assets/gameoverchar.png');
  },
  create: function() {
    // world
    GameCreator.setupPhisics();
    GameCreator.setupWorld();
    GameCreator.setupScenario();
    // char
    var gameOverChar = game.add.sprite(game.width/2, 170, 'gameoverChar');
    gameOverChar.anchor.setTo(0.5,0.5);
    gameOverChar.scale.setTo(0.6, 0.6);
    // play
    var startButton = game.add.button(game.width/2, game.height - 100, 'startButton', function() {
      menuSound.stop();
      gameOverSound.stop();
      game.state.start('play');
    }, this);
    startButton.anchor.setTo(0.5,0.5);
    game.add.tween(startButton).to({y: (startButton.y + 10)}, 700, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    scoreText = game.add.text(game.width/2, 10, 'GAME OVER', { fontSize: '40px', fill: '#fff', shadowBlur: 7, shadowColor: '#5aa4c0' });
    scoreText.anchor.setTo(0.5, 0);

    // score
    scoreText = game.add.text(game.width/2, 370, 'Your record is: ' + ScoreStorage.getMaximumScore(), { fontSize: '28px', fill: '#fff', shadowBlur: 7, shadowColor: '#5aa4c0' });
    scoreText.anchor.setTo(0.5,0.5);

    scoreText = game.add.text(game.width/2, 320, 'You did: ' + score, { fontSize: '30px', fill: '#fff', shadowBlur: 7, shadowColor: '#5aa4c0' });
    scoreText.anchor.setTo(0.5,0.5);
  },
  update: function() {
  }
}


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Ice Bucket Collect Challange');

game.state.add('menu', MENU_STATE);
game.state.add('play', PLAY_STATE);
game.state.add('gameover', GAMEOVER_STATE);

game.state.start('menu');