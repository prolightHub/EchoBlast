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

        beforePlaySceneLoad (player)
        {
            if((!player || player.dead) && this.storedSaveData[this.saveFileId].saveBlock)
            {
                levelHandler.travelType = "saveBlock";
                levelHandler.levelName = this.storedSaveData[this.saveFileId].levelName || levelHandler.levelName;
            }
        }

        createSaveFile (id, username)
        {
            this.storedSaveData[id] = {
                id: id,
                username: username
            };
        }

        startSaveFile (id)
        {
            this.saveFileId = id;
        }
        
        removeSaveFile (id)
        {
            delete this.storedSaveData[id];

            localforage.setItem("adventure-saveData", JSON.stringify(this.storedSaveData));
        }

        getSaveFiles (amt)
        {
            amt = amt || 4;

            var saveFiles = [];

            for(var i = 0; i < amt; i++)
            {
                if(typeof this.storedSaveData[i] === "object")
                {
                    saveFiles.push(this.storedSaveData[i]);
                }
            }

            return saveFiles;
        }

        restore (func)
        {
            var self = this;
            localforage.getItem("adventure-saveData", function(err, value)
            {
                self.storedSaveData = JSON.parse(value);

                if(!self.storedSaveData)
                {
                    self.storedSaveData = {};
                    localforage.setItem("adventure-saveData", JSON.stringify(self.storedSaveData));
                }
                return func.apply(this, arguments);
            });
        }

        save (scene, player, saveBlock)
        {
            var lastSaveFile = this.storedSaveData[this.saveFileId];

            this.storedSaveData[this.saveFileId] = {
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

            this.storedSaveData[this.saveFileId].id = lastSaveFile.id;
            this.storedSaveData[this.saveFileId].username = lastSaveFile.username;

            localforage.setItem("adventure-saveData", JSON.stringify(this.storedSaveData));
        }

        putSaveDataIntoScene (scene)
        {
            for(var i in this.storedSaveData[this.saveFileId].player)
            {
                scene.player[i] = this.storedSaveData[this.saveFileId].player[i];
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