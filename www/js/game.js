
var Game = (function() 
{
    /*
        @Class

        This class handles the startup of all game scenes; Maybe?
        It is not a god object, it is stateless (with a few exceptions), it only defines methods
        that call other methods and sometimes stores a variable in the method scope, until that method is done 
    */

    class Game {
        
        init (scene)
        {
            scene.scene.launch('fxScene');
        }

        start (scene)
        {
            scene.scene.start('playScene');
        }

        save ()
        {
            
        }

        gameOver (scene)
        {
            scene.scene.get("fxScene").fadeIO(1000, () =>
            {
                scene.scene.start("gameOverScene");
            });

            levelHandler.travelType = "spawnPoint";
        }

        onDoor (scene)
        {
            scene.scene.get("fxScene").fadeIO(1000, () =>
            {
                var player = scene.player;
                var touchedObject = player.touchedObject;

                const [ doorLevel, doorSymbol ] = touchedObject.obj.properties;

                levelHandler.levelName = doorLevel.value;
                levelHandler.doorSymbol = doorSymbol.value;

                levelHandler.travelType = "door";

                scene.scene.restart();
            });
        }
    }

    var instance;

    return {
        GetInstance: function() 
        {
            if(!instance) 
            {
                instance = new Game();
            }
            return instance;
        }
    };
})();

export default Game.GetInstance();