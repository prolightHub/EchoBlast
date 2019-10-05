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
    
    fadeIn (duration)
    {
        this.cameras.main.fadeIn(duration);
    }

    fadeOut (duration)
    {
        this.cameras.main.fadeOut(duration);
    }

    fadeIO (duration, func)
    {
        var halfTime = duration / 2;
        var cam = this.cameras.main;

        cam.once("camerafadeoutcomplete", () =>
        {
            func(cam);

            cam.fadeIn(halfTime);
        });

        cam.fadeOut(halfTime);
    }
}


