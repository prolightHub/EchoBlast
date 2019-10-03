import MainScene from "./scenes/mainScene.js";

document.addEventListener('deviceready', function() 
{
    var config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 480,
        scene: MainScene
    };
    
    var game = new Phaser.Game(config);
});

//Prevent right click menu from showing because it is annoying
document.addEventListener('contextmenu', event => event.preventDefault());