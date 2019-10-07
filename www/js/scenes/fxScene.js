export default class FxScene extends Phaser.Scene {

    constructor ()
    {
        super('fxScene');
    }

    preload ()
    {
        
    }

    create ()
    {
        
    }

    update ()
    {

    }

    render ()
    {
        
    }

    fadeIn (duration, func)
    {
        this.cameras.main.fadeIn(duration);
    
        if(func)
        {
            this.cameras.main.once("camerafadeincomplete", () =>
            {
                func(this.cameras.main, this);
            });
        }
    }

    fadeOut (duration, func)
    {
        this.cameras.main.fadeOut(duration);

        if(func)
        {
            this.cameras.main.once("camerafadeoutcomplete", () => 
            {
                func(this.cameras.main, this);
            });
        }
    }

    fadeIO (duration, func)
    {
        var halfTime = duration / 2;
        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () =>
        {
            if(func)
            {
                func(cam);
            }

            cam.fadeIn(halfTime, this);
        });

        cam.fadeOut(halfTime);
    }
}


