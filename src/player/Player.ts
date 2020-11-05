import { Camera } from '../camera/Camera';
import { GameEventHandler } from '../events/game-event-handler.interface';
import { Map } from '../map/Map';
import { Drawer } from '../screen/drawer.interface';


export class Player implements Drawer, GameEventHandler {

    private rotation = 0;

    constructor(
        private pos: [number, number],
        private width: number,
        private height: number,
        private map: Map,
        private camera: Camera,
    ) { }

    public changePos([x, y]: [number, number]) {
        const center: [number, number] = [
            Math.floor((x + (this.width / 2)) / this.width),
            Math.floor((y + (this.height / 2)) / this.height)
        ];

        // 1. Check for boundries collision
        const check = this.map.collision(center)
        const [inBounds, collision, value] = check;

        // 1a. Check for boundries
        if (!inBounds) {
            return this.pos;
        }

        // 1b. Check if player can collide with value
        if (collision && !this.canCollide(value)) {
            return this.pos;
        }

        this.pos = [x, y];
        return this.pos;
    }

    public drawTo(ctx: CanvasRenderingContext2D, dimensions: [number, number]) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.pos[0], this.pos[1], this.width * 2, this.height * 2);

        this.camera.drawRays(ctx, this);
    }

    public handleEvent(name: string, event: CustomEvent) {
        if (name === 'keys') {
            const keys: string[] = event.detail;
            for (const key of keys) {
                this.handleKeysEvent(key);
            }
        }
    }

    private handleKeysEvent(key: string) {
        switch (key) {
            case 'a': {
                this.rotation += 1;
                break;
            }

            case 'd': {
                this.rotation -= 1;
                break;
            }

            case 'w': {
                const x = (this.pos[0]) + Math.sin(this.rotation / (Math.PI * 10));
                const y = (this.pos[1]) + Math.cos(this.rotation / (Math.PI * 10));
                this.changePos([x, y]);
                break;
            }

            case 's': {
                const x = (this.pos[0]) - Math.sin(this.rotation / (Math.PI * 10));
                const y = (this.pos[1]) - Math.cos(this.rotation / (Math.PI * 10));
                this.changePos([x, y]);
                break;
            }
        }
    }

    public getPos(): [number, number] {
        return [...this.pos];
    }

    public getRotation(): number {
        return this.rotation;
    }

    public canCollide(value: number): boolean {
        return ![1, 2].includes(value);
    }

}