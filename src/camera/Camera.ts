import { Map } from '../map/Map';
import { Player } from '../player/Player';
import { RayBuffer } from './ray-buffer.type';


export class Camera {

    private rayCount = 512;
    private raysOn = false;
    private rayDegrees = 60;

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
        const rayStep = this.rayDegrees / this.rayCount;
        const playerRotation = player.getRotation() - (this.rayDegrees / 2);
        const playerPos = player.getPos();
        for (let i = playerRotation; i < playerRotation + this.rayDegrees; i += rayStep) {
            const rotation = (Math.PI / 180) * i;
            const center = {
                x: playerPos[0] + (this.width),
                y: playerPos[1] + (this.height),
            };
            let length = 1;

            while (true) {
                const x = center.x + (Math.sin(rotation) * length);
                const y = center.y + (Math.cos(rotation) * length);
                const coords: [number, number] = [Math.floor(x / this.width), Math.floor(y / this.height)];
                const [inBounds, collided, value] = this.map.collision(coords);
                if (inBounds && collided) {
                    if (!player.canCollide(value)) {
                        this.rayBuffer.push({ value, distance: length, coords });
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