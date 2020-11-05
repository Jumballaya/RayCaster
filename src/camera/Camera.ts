import { Map } from '../map/Map';
import { Player } from '../player/Player';
import { RayBuffer } from './ray-buffer.type';


export class Camera {

    private rayCount = 256;
    private raysOn = false;

    private rayBuffer: RayBuffer = [];

    constructor(
        private map: Map,
        private width: number,
        private height: number,
    ) { }

    public toggleRays() {
        this.raysOn = !this.raysOn;
    }

    public getBuffer() {
        return [...this.rayBuffer];
    }

    public drawRays(ctx: CanvasRenderingContext2D, player: Player) {
        ctx.strokeStyle = 'red';

        this.rayBuffer = [];
        for (let i = 0; i < this.rayCount; i++) {
            const playerRotation = player.getRotation();
            const playerPos = player.getPos();
            const rotation = ((playerRotation + (i / 6)) - (this.rayCount / 12)) / (Math.PI * 10);
            const center = {
                x: playerPos[0] + (this.width / 2),
                y: playerPos[1] + (this.height / 2),
            };
            let length = 1;

            while (true) {
                const x = center.x + (Math.sin(rotation) * length);
                const y = center.y + (Math.cos(rotation) * length);
                const coords: [number, number] = [Math.floor(x / this.width), Math.floor(y / this.height)];
                const [inBounds, collided, value] = this.map.collision(coords);
                if (inBounds && collided) {
                    if (!player.canCollide(value)) {
                        this.rayBuffer.push({ value, distance: length });
                        break;
                    }
                }
                length += 1;
            }

            // Draw Rays
            if (this.raysOn) {
                ctx.beginPath();
                ctx.moveTo(center.x, center.y);
                const nx = center.x + (Math.sin(rotation) * length);
                const ny = center.y + (Math.cos(rotation) * length);
                ctx.lineTo(nx, ny);
                ctx.stroke();
            }
        }
    }
}