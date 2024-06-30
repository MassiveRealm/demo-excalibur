import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { Level } from "./level";

const game = new Engine({
    width: 160 * 4,
    height: 100 * 4,
    pixelArt: true,
    pixelRatio: 4,
    displayMode: DisplayMode.FitScreen,

    scenes: {
        'level': Level
    }
});

game.start('level', {
    loader,
    inTransition: new FadeInOut({
        direction: 'in',
        color: Color.Black,
        duration: 1000
    })
});
