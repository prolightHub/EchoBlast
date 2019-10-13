import game from "../game.js";
import TextBox from "../utils/textbox.js";

var buttons = createButtons();

export default class SaveFileScene extends Phaser.Scene {

    constructor ()
    {
        super("saveFileScene");
    }

    preload ()
    {
        
    }

    create ()
    {
        this.inputtingUsername = false;
        
        this.graphics = this.add.graphics({});

        var rectColor = new Phaser.Display.Color(0, 0, 0, 100);
        this.graphics.fillStyle(rectColor, rectColor.alphaGL);
        this.graphics.fillRect(0, 0, 800, 480);
        var rectColor2 = new Phaser.Display.Color(0, 0, 0, 100);
        this.graphics.fillStyle(rectColor2, rectColor2.alphaGL);
        this.graphics.fillRect(0, 0, 800, 60);

        this.add.text(140, 20, "Select a file (then click it to play)", 
        {
            fill: '#FFFFFF',
            align: 'left',
            fontSize: '20px',
        });

        this.newSaveFiles = [];

        this.buttonGraphics = this.add.graphics({});

        var scene = this;

        this.newSaveFiles.add = function(text, x, y, width, height, color, onClick, onDraw)
        {
            this.push(new Button(scene, x + width / 2, y + height / 2, width, height, color, text, 
            {
                fontSize: '20px',
                fill: '#FFFFFFDD',
                align: 'center',
            }, 
            onClick, 
            {
                offsetX: 0.1,
                offsetY: 0.2
            }));

            this[this.length - 1].extraText = scene.add.text(x + width / 2, y + height / 2, "New!!", {
                fontSize: '20px',
                fill: '#FFFFFFDD',
                align: 'center'
            }).setOrigin(0.5, 0.5);

            this[this.length - 1].id = this.length - 1;
            this[this.length - 1].onDraw = onDraw || function() {};
            this[this.length - 1].state = "new";
            this[this.length - 1].selected = false;
        };
        this.newSaveFiles.draw = function()
        {
            for(var i = 0; i < this.length; i++)
            {
                this[i].draw(scene.buttonGraphics);
                this[i].onDraw(scene.buttonGraphics);
            }
        };

        var onClick = function()
        {
            if(!this.selected)
            {
                for(var i in scene.newSaveFiles)
                {
                    scene.newSaveFiles[i].selected = false;
                }

                this.selected = true;
            }else{
                switch(this.state)
                {
                    case "new" :
                        this.state = "used";
                        this.extraText.setText("");

                        scene.startInputUsername(this);
                        break;

                    case "used" :
                        game.startSaveFile(this.id);
                        scene.scene.start('mainScene');
                        break;
                }
            }
        };

        this.newSaveFiles.add("1", 140, 130, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);
        this.newSaveFiles.add("2", 415, 130, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);
        this.newSaveFiles.add("3", 140, 260, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);
        this.newSaveFiles.add("4", 415, 260, 245, 100, new Phaser.Display.Color(0, 0, 0, 100), onClick);

        var saveFiles = game.getSaveFiles();

        for(var i = 0; i < saveFiles.length; i++)
        {
            this.newSaveFiles[i].state = "used";
            this.newSaveFiles[i].extraText.setText(saveFiles[i].username);
        }

        this.input.on('pointerdown', function (pointer) 
        {
            if(this.inputtingUsername)
            {
                if(pointer.x < 150 || pointer.x > 650)
                {
                    this.endInputUsername();
                }

                return;
            }

            for(var i = 0; i < this.newSaveFiles.length; i++)
            {
                if(this.newSaveFiles[i].isClicked(pointer.x, pointer.y))
                {
                    this.newSaveFiles[i].onClick(pointer.x, pointer.y);
                }
            }
        }, 
        this);

        this.UIGraphics = this.add.graphics({});

        this.UIText = this.add.text(400, 100, "", 
        {
            fontSize: '20px',
            fill: '#FFFFFFDD',
            align: 'center',
        })
        .setOrigin(0.5, 0.5);

        this.graphics = this.add.graphics({});

        this.input.keyboard.on("keydown", function(event)
        {
            if(this.textBox)
            {
                this.textBox.updateText(event);
            }
        }, this);

        this.input.on('pointerdown', function (pointer) 
        {
            buttons.onpointerdown.apply(this, arguments); 
        }, 
        this);

        this.scene.get("fxScene").fadeIn(500);   

        this.createOptionButtons();
    }

    update (time, delta)
    {
        this.graphics.clear();
        this.buttonGraphics.clear();
        this.newSaveFiles.draw();

        if(this.inputtingUsername)
        {
            this.textBox.update(this, time, delta);

            buttons.create.color = (this.textBox.text.text.replace("|", "").length > 0) ? 
                                    new Phaser.Display.Color(0, 140, 40) : 
                                    new Phaser.Display.Color(0, 90, 100)
        }

        if(buttons.delete)
        {
            var selectedAndFull = false;
            for(var i in this.newSaveFiles)
            {
                if(selectedAndFull = (this.newSaveFiles[i].selected && this.newSaveFiles[i].state === "used"))
                {
                    break;
                }
            }

            buttons.delete.color = selectedAndFull ? 
                                    new Phaser.Display.Color(0, 140, 40) : 
                                    new Phaser.Display.Color(0, 90, 100);
        }

        buttons.draw(this.graphics);
    }

    render ()
    {
        
    }

    createOptionButtons ()
    {
        buttons.delete = new Button(this, 400, 410, 120, 40, new Phaser.Display.Color(0, 90, 100), "Delete", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            fontFamily: '"Press Start 2P"'
        }, 
        function()
        {
            for(var i in this.newSaveFiles)
            {
                if(this.newSaveFiles[i].selected)
                {
                    game.removeSaveFile(this.newSaveFiles[i].id);

                    this.newSaveFiles[i].state = "new";
                    this.newSaveFiles[i].extraText.setText("New!!");

                    break;
                }
            }
        },
        {
            offsetX: 0.6
        });
    }

    destroyOptionButtons ()
    {
        buttons.delete.text.destroy();
        delete buttons.delete;
    }

    endInputUsername ()
    {
        // Undo actions
        this.UIText.text = "";
        this.UIGraphics.clear();

        this.UINewSaveFile.state = "new";
        this.UINewSaveFile.extraText.setText("New!!");
        delete this.UINewSaveFile;

        this.inputtingUsername = false;

        this.textBox.destroy();
        delete this.textBox;

        buttons.create.text.destroy();        
        delete buttons.create;

        this.createOptionButtons();
    }

    finishInputUsername ()
    {
        var username = this.textBox.text.text.replace("|", "");

        if(username.length <= 0)
        {
            return;
        }

        var saveFileBtn = this.UINewSaveFile;

        this.endInputUsername();

        saveFileBtn.extraText.setText(username);
        saveFileBtn.state = "used";

        game.createSaveFile(saveFileBtn.id, username);
    }

    startInputUsername (newSaveFile)
    {
        var color = new Phaser.Display.Color(0, 80, 100, 100);

        this.UIGraphics.fillStyle(color, color.alphaGL);
        this.UIGraphics.fillRect(150, 0, 500, 480);
        this.UIText.setText("Type your name:");

        this.textBox = new TextBox(this, 325, 230, 150, 30);
        this.textBox.draw(this, this.UIGraphics);

        this.UINewSaveFile = newSaveFile;
        this.inputtingUsername = true;

        var scene = this;
        buttons.create = new Button(this, 400, 400, 120, 40, new Phaser.Display.Color(0, 90, 100), "Create", 
        {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            fontFamily: '"Press Start 2P"'
        }, 
        function()
        {
            scene.finishInputUsername();
        },
        {
            offsetX: 0.6
        });

        this.destroyOptionButtons();
    }
}