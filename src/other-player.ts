import { Actor, Color, vec } from "excalibur"
import { TinyDungeonSpriteSheet } from "./resources";

export class OtherPlayer extends Actor {

    constructor(x: number, y: number) {
        super({
            pos: vec(x, y),
            width: 16,
            height: 16,
            color: Color.Red,
        })

        const sprite = TinyDungeonSpriteSheet.getSprite(1, 8).clone();
        sprite.tint = Color.Gray;
        this.graphics.use(sprite);
    }
}