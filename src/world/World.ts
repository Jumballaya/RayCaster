import { Drawer } from '../screen/drawer.interface';
import { RayBuffer } from '../camera/ray-buffer.type';
import { Map } from '../map/Map';

export class World implements Drawer {

    private rays: RayBuffer = [];
    private texturesOn = true;

    constructor(private map: Map) {}

    public drawTo(ctx: CanvasRenderingContext2D, dimensions: [number, number]) {
        ctx.clearRect(0, 0, dimensions[0], dimensions[1]);
        const offset = dimensions[0] / this.rays.length;

        let last: [number, number] = [0, 0];
        let slice = 0;
        this.rays.reverse().forEach((ray, i) => {
            const x = (i * offset);
            const width = offset + 1;
            const height = (dimensions[1] / ray.distance) * (dimensions[1] / 32);
            const y = (dimensions[1] / 2) - (height / 2);
            const texture = this.map.selectTexture(ray.value);
            if (this.texturesOn && this.map.texturesAreLoaded() && texture.image) {
                if (last[0] === ray.coords[0] && last[1] === ray.coords[1]) {
                    slice++;
                    slice = slice % 256;
                } else {
                    last = ray.coords;
                    slice = 0;
                }
                ctx.drawImage(texture.image, slice, 0, width, 256, x + width, y, width, height);
            } else {
                ctx.fillStyle = texture.color;
                ctx.fillRect(x, y, width, height);
            }
        });
    }

    public injectRays(rays: RayBuffer) {
        this.rays = rays;
    }

    public toggleTextures() {
        this.texturesOn = !this.texturesOn;
    }

    public setMap(map: Map) {
        this.map = map;
    }

}