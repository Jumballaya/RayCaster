import { Drawer } from './drawer.interface';

export class Screen {
    private ctx: CanvasRenderingContext2D;
    private cvs: HTMLCanvasElement;

    private layers: Drawer[] = [];

    constructor(id: string, private dimensions: [number, number]) {
        this.cvs = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.cvs.getContext('2d') as CanvasRenderingContext2D;

        this.cvs.setAttribute('width', this.dimensions[0].toString());
        this.cvs.setAttribute('height', this.dimensions[1].toString());
    }

    public addLayer(d: Drawer) {
        this.layers.push(d);
    }

    public draw() {
        for (const layer of this.layers) {
            layer.drawTo(this.ctx, this.dimensions);
        }
    }

    public getContext() {
        return this.ctx;
    }
}
