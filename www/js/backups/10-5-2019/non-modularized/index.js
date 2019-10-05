
document.addEventListener('deviceready', function() 
{
    window.config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 480,
        scene: [MainScene, PlayScene, GameOverScene, FxScene],
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 800 }
            }
        },
        backgroundColor: '#36B0C1'
    };
    
    window.phaserGame = new Phaser.Game(config);
});

//Prevent right click menu from showing because it is annoying
document.addEventListener('contextmenu', event => event.preventDefault());