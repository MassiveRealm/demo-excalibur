import { Actor, BoundingBox, Engine, EventEmitter, Scene, SceneEvents, Vector, Label, Color, Font, FontUnit, TextAlign, BaseAlign } from "excalibur";
import { Player } from "./player";
import { Network } from "./network";
import { OtherPlayer } from "./other-player";
import { Resources } from "./resources";

export class Level extends Scene {
    network = new Network(this);

    currentPlayer!: Player;
    players = new Map<number, Actor>();
    events = new EventEmitter<SceneEvents & {
        onJoinRoom: void,
        playerMove: { id: number, x: number, y: number },
        playerDelete: number,
    }>();

    constructor() {
        super();
        this.events.on('onJoinRoom', this.onJoinRoom);
        this.events.on('playerMove', this.playerMove);
        this.events.on('playerDelete', this.playerDelete);
        this.events.on('onDisconnect', this.onDisconnect);
        this.camera.zoom = 4;
    }

    onInitialize(engine: Engine<any>): void {
        this.network.connect();
        Resources.TiledResource.addToScene(this);
    }

    onDisconnect = () => {
        this.players.forEach(player => player.kill());
        this.players.clear();

        // Display a message on the screen
        const message = new Label({
            text: 'Disconnected by Timeout',
            pos: new Vector(this.camera.pos.x, this.camera.pos.y - 15),
            color: Color.Red,
            font: new Font({
                family: 'Arial',
                size: 8,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            }),
            z: 1000,
        });

        const reconnectButton = new Actor({
            pos: new Vector(this.camera.pos.x, this.camera.pos.y + 15),
            width: 60,
            height: 20,
            color: Color.Blue,
            z: 1000,
        });

        const buttonText = new Label({
            text: 'Reconnect',
            pos: reconnectButton.pos,
            color: Color.White,
            font: new Font({
                family: 'Arial',
                size: 8,
                unit: FontUnit.Px,
                textAlign: TextAlign.Center,
                baseAlign: BaseAlign.Middle
            }),
            z: 1000,
        });

        reconnectButton.on('pointerup', () => {
            // Reconnect to the server
            this.network.connect();

            reconnectButton.kill();
            message.kill();
            buttonText.kill();
        });

        this.add(message);
        this.add(reconnectButton);
        this.add(buttonText);
    }

    onJoinRoom = () => {
        const tileLayer = Resources.TiledResource.getTileLayers('Ground')[0];
        const tilemap = tileLayer.tilemap;
        const tileBounds = BoundingBox.fromDimension(
            tilemap.tileWidth * tilemap.columns,
            tilemap.tileHeight * tilemap.rows,
            Vector.Zero,
            tilemap.pos
        );

        this.currentPlayer = new Player(this.network);
        this.camera.strategy.lockToActor(this.currentPlayer);
        this.camera.strategy.limitCameraBounds(tileBounds);

        this.add(this.currentPlayer);

        this.players.set(-1, this.currentPlayer);
        this.network.updatePosition(this.currentPlayer);

        this.camera.pos = this.currentPlayer.pos;
    }

    playerMove = ({ id, x, y }: { id: number, x: number, y: number }) =>{
        if (!this.players.has(id)) {
            const otherPlayer = new OtherPlayer(x, y);
            this.add(otherPlayer);
            this.players.set(id, otherPlayer);
        }

        const somePlayer = this.players.get(id);
        if (somePlayer) {
            somePlayer.pos.x = x;
            somePlayer.pos.y = y;
        }
    }

    playerDelete = (id: number) => {
        const somePlayer = this.players.get(id);
        if (somePlayer) {
            somePlayer.kill();
            this.players.delete(id);
        }
    }
}
