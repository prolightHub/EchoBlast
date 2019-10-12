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

        createNewSaveFile ()
        {
            
        }

        beforePlaySceneLoad (player)
        {
            if((!player || player.dead) && this.storedSaveData)
            {
                levelHandler.travelType = "saveBlock";
                levelHandler.levelName = this.storedSaveData.levelName;
            }
        }

        restore (func)
        {
            var self = this;
            localforage.getItem("echoblast-saveData", function(err, value)
            {
                self.storedSaveData = JSON.parse(value);
                return func.apply(this, arguments);
            });
        }

        save (scene, player, saveBlock)
        {
            this.storedSaveData = {
                levelName: levelHandler.levelName,
                saveBlock: {
                    name: saveBlock.obj.name
                },
                player: {
                    // Stuff for player goes here
                    hp: player.hp,
                    maxHp: player.maxHp
                }
            };

            localforage.setItem("echoblast-saveData", JSON.stringify(this.storedSaveData));
        }

        putSaveDataIntoScene (scene)
        {
            for(var i in this.storedSaveData.player)
            {
                scene.player[i] = this.storedSaveData.player[i];
            }
        }

        gameOver (scene)
        {
            scene.scene.get("fxScene").fadeOut(500, () =>
            {
                scene.scene.start("gameOverScene");
            });

            levelHandler.levelName = levelHandler.lastSpawnPointLevel || levelHandler.levelName;
            levelHandler.travelType = "spawnPoint";
        }

        onDoor (scene)
        {
            scene.scene.get("fxScene").fadeOut(500, () =>
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