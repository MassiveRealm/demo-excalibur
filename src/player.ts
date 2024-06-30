import { Actor, CollisionType, Color, Engine, Keys, Vector, vec } from "excalibur";
import { Network } from "./network";
import { TinyDungeonSpriteSheet } from "./resources";


export class Player extends Actor {
    public type = 0;

    constructor(private network: Network) {
        super({
            pos: vec(50, 50),
            width: 16,
            height: 16,
            color: Color.Red,
            collisionType: CollisionType.Active
        });

        this.graphics.use(TinyDungeonSpriteSheet.getSprite(1, 8));
    }

    onPostUpdate(engine: Engine<any>, delta: number): void {
        this.vel = Vector.Zero;

        const dir = vec(0, 0);
        if (engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.ArrowLeft) ) {
            dir.x = -1;
        }
        if (engine.input.keyboard.isHeld(Keys.D) || engine.input.keyboard.isHeld(Keys.ArrowRight) ) {
            dir.x = 1;
        }
        if (engine.input.keyboard.isHeld(Keys.W) || engine.input.keyboard.isHeld(Keys.ArrowUp)) {
            dir.y = -1;
        }
        if (engine.input.keyboard.isHeld(Keys.S) || engine.input.keyboard.isHeld(Keys.ArrowDown) ) {
            dir.y = 1;
        }

        if (dir.x !== 0 || dir.y !== 0) {
            this.move(dir);
        }
    }

    attack() {

    }

    move(dir: Vector) {
        dir.normalize();
        this.vel = dir.scale(16*3);

        this.network.updatePosition(this);
    }
}
