import { MapData } from './map-data.interface';
import { Texture } from './texture.interface';

const loadImage = (path: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
            resolve(image);
        }
        image.onerror = () => {
            resolve(document.createElement('img'));
        }
        image.src = path;
    })


export class Map {

    private dimensions: [number, number] = [0, 0];
    private data: number[] = [];
    private name: string;
    private textures: Texture[] = [];

    private texturesLoaded = false;

    constructor(data: MapData) {
        this.data = data.data;
        this.dimensions = data.dimensions;
        this.name = data.name;
        this.textures = [ { name: 'floor', location: '', color: 'white' }, ...data.textures];
        this.loadTextures();
    }

    public drawTo(ctx: CanvasRenderingContext2D, screen: [number, number]): void {
        const width = screen[0] / this.dimensions[0];
        const height = screen[1] / this.dimensions[1];

        this.data.forEach((p, i) => {
            const x = i % this.dimensions[0];
            const y = Math.floor(i / this.dimensions[1]);
            const texture = this.selectTexture(p);
            ctx.fillStyle = texture.color;
            ctx.fillRect(x * width, y * height, width, height);
        });
    }

    public collision(coords: [number, number]): [inBounds: boolean, collision: boolean, object: number] {
        const inBounds = this.coordInBounds(coords);
        const collision = this.coordCollision(coords);
        const object = inBounds ? this.data[coords[0] + (coords[1] * this.dimensions[0])] : 0;
        return [inBounds, collision, object];
    }

    public selectTexture(num: number): Texture {
        return this.textures[num];
    }

    public texturesAreLoaded() {
        return this.texturesLoaded;
    }

    private coordInBounds([x, y]: [number, number]): boolean {
        const isXInBounds = x >= 0 || x < this.dimensions[1];
        const isYInBounds = y >= 0 || y < this.dimensions[0];
        const isNotTooLong = (x + (y * this.dimensions[0])) < this.data.length;
        return isXInBounds || isYInBounds || isNotTooLong;
    }

    private coordCollision([x, y]: [number, number]): boolean {
        return this.data[x + (y * this.dimensions[0])] !== 0;
    }

    private async loadTextures() {
        this.textures = await Promise.all(this.textures.map(async (texture) => {
            const path = texture.location;
            texture.image = await loadImage(path);
            return texture;
        }));
        this.texturesLoaded = true;
    }
}