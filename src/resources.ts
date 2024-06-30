import { Color, ImageSource, Loader, SpriteSheet, TileMap } from "excalibur";
import { TiledResource } from "@excaliburjs/plugin-tiled";

import tileMapPng from '../img/kenney_tiny-dungeon/Tilemap/tilemap_packed.png';
import tiledResourceTmx from './map.tmx';


export const Resources = {
    TileMap: new ImageSource(tileMapPng),
    TiledResource: new TiledResource(tiledResourceTmx, {
        pathMap: [
            { path: 'map.tmx', output: tiledResourceTmx },
            { path: 'tilemap_packed.png', output: tileMapPng },
        ]
    })
} as const;

export const TinyDungeonSpriteSheet = SpriteSheet.fromImageSource({
    image: Resources.TileMap,
    grid: {
        spriteHeight: 16,
        spriteWidth: 16,
        rows: 11,
        columns: 12
    }
});

export const loader = new Loader();
loader.backgroundColor = Color.Black.toString();
for (let res of Object.values(Resources)) {
    loader.addResource(res);
}