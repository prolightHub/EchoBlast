import game from "../game.js";

export default class StartScene extends Phaser.Scene {

    constructor ()
    {
        super('startScene');
    }

    preload ()
    {

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
            if(this.cutScening)
            {
                return;
            }

            this.cutScening = true;

            this.scene.get("fxScene").fadeOut(500, () =>
            {
                this.scene.start("saveFileScene");

                this.cutScening = false;
            });
        }, this);
    }

    update ()
    {

    }

    render ()
    {
        
    }
}