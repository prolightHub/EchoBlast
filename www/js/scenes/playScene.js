import Player from "../gameObjects/player.js";

var levelHandler = {};

export default class PlayScene extends Phaser.Scene {

    constructor ()
    {
        super('playScene');
    }

    preload ()
    {
        this.load.tilemapTiledJSON("level1", "assets/tilemaps/level1.json");

        this.load.spritesheet("otherTiles-extruded", "assets/tilesets/otherTiles-extruded.png", 
        { 
            frameWidth: 32, 
            frameHeight: 32 
        });

        this.load.image("player", 'assets/spritesheets/player.png');
    }

    create ()
    {
        console.log(this.cache.tilemap.get('level1').data);

        // Setup up the tilemap level, get the tile image, create a dynamic layer and set collsion
        levelHandler.level = this.make.tilemap({ key: "level1" });
        levelHandler.otherTiles = levelHandler.level.addTilesetImage("otherTiles-extruded", "otherTiles-extruded");
        levelHandler.blockLayer = levelHandler.level.createDynamicLayer("World", [levelHandler.otherTiles], 0, 0);
        levelHandler.blockLayer.setCollisionByExclusion([-1]);

        // Find player spawn point and place him there
        let spawnPoint = levelHandler.level.findObject("Objects", obj => obj.name === "Player Spawn Point");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y);

        // Set up collision with the player for the walls and tiles
        this.player.sprite.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels, true, true, true, false);
        this.physics.add.collider(this.player.sprite, levelHandler.blockLayer);

        // Have the camera start following the player and set the camera's bounds
        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, levelHandler.level.widthInPixels, levelHandler.level.heightInPixels);
    }

    update ()
    {
        this.player.update();
    }

    render ()
    {
        
    }
}