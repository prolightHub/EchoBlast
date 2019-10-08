import game from "../game.js";

export default class StartScene extends Phaser.Scene {

    constructor ()
    {
        super('startScene');
    }

    preload ()
    {
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexbbcodetextplugin.min.js';
        this.load.plugin('rexbbcodetextplugin', url, true);
      
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rextexteditplugin.min.js';
        this.load.plugin('rextexteditplugin', url, true);
    }

    create ()
    {
        game.init(this);

        this.graphics = this.add.graphics({});

        var rectColor = new Phaser.Display.Color(0, 0, 0, 100);

        this.graphics.fillStyle(rectColor, rectColor.alphaGL);
        this.graphics.fillRect(200, 0, 400, 480);

        this.add.text(400, 134, 'EchoBlast', 
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '40px',
        })
        .setOrigin(0.5, 0.5);

        this.add.text(400, 300, 'Press any key to start',
        {
            fill: '#FFFFFF',
            align: 'center',
            fontSize: '17px',
        })
        .setOrigin(0.5, 0.5);

        this.input.keyboard.on("keydown", function(event)
        {
            // if(this.cutScening)
            // {
            //     return;
            // }

            // this.cutScening = true;

            // this.scene.get("fxScene").fadeOut(500, () =>
            // {
            //     this.scene.start("saveFileScene");

            //     this.cutScening = false;
            // });
        }, this);

        var printText = this.add.rexBBCodeText(400, 300, 'abc', {
            color: 'yellow',
            fontSize: '24px',
            fixedWidth: 200,
            // fixedHeight: 30,
            backgroundColor: '#333333',
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', function () {
                this.plugins.get('rextexteditplugin').edit(printText);
            }, this);
    }

    update ()
    {

    }

    render ()
    {
        
    }
}