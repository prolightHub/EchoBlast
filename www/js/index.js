import MainScene from "./scenes/mainScene.js";
import PlayScene from "./scenes/playScene.js";
import FxScene from "./scenes/fxScene.js";

document.addEventListener('deviceready', function() 
{
    window.config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 480,
        scene: [MainScene, PlayScene, FxScene],
        backgroundColor: '#36B0C1'
    };
    
    window.phaserGame = new Phaser.Game(config);
});

//Prevent right click menu from showing because it is annoying
document.addEventListener('contextmenu', event => event.preventDefault());