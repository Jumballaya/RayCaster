import { Texture } from './texture.interface';

export interface MapData {
    dimensions: [number, number];
    name: string;
    textures: Texture[];
    data: number[];
}