import StartScene from "./scenes/startScene.js";
import SaveFileScene from "./scenes/saveFileScene.js";
import MainScene from "./scenes/mainScene.js";
import PlayScene from "./scenes/playScene.js";
import FxScene from "./scenes/fxScene.js";
import GameOverScene from "./scenes/gameOverScene.js";
import game from "./game.js";

document.addEventListener('deviceready', function() 
{
    window.config = {
        type: Phaser.AUTO,
        parent: 'game',
        width: 800,
        height: 480,
        pixelArt : true, 
        dom: {
            createContainer: true
        },
        scene: [SaveFileScene, StartScene, MainScene, PlayScene, GameOverScene, FxScene],
        physics: {
            default: "arcade",
            arcade: {
                gravity: { y: 800 }
            }
        },
        backgroundColor: '#36B0C1'
    };
    
    // I should probably make a save file select scene and put this in here.
    game.restore(function()
    {
        window.phaserGame = new Phaser.Game(config);
    });
});

//Prevent right click menu from showing because it is annoying
document.addEventListener('contextmenu', event => event.preventDefault());