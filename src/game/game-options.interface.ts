import { MapData } from '../map/map-data.interface';

export interface GameOptions {
    mapDimensions: [number, number];
    screenDimensions: [number, number];
    playerStart: [number, number];
    refreshRate: number;
    initialMapName: string;
}