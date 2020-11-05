import { Camera } from '../camera/Camera';
import { EventManager } from '../events/EventManager';
import { Map } from '../map/Map';
import { MapData } from '../map/map-data.interface';
import { Player } from '../player/Player';
import { Screen } from '../screen/Screen';
import { World } from '../world/World';
import { GameOptions } from './game-options.interface';
import { GameState } from './GameState.enum';

export class Game {
    private map: Map | null = null;
    private minimap: Screen | null = null;
    private gameScreen: Screen | null = null;
    private player: Player | null = null;
    private playerCamera: Camera | null = null;
    private eventManager: EventManager | null = null;
    private world: World | null = null;

    private refreshRate: number;
    private state: GameState = GameState.LOADING;

    constructor(options: GameOptions) {
        this.refreshRate = options.refreshRate;
        this.setupGame(options);
    }

    public loop() {
        requestAnimationFrame((() => {
            setTimeout((() => {
                this.step();
                this.loop();
            }).bind(this), this.refreshRate);
        }).bind(this))
    }

    public toggleProperty(property: string) {
        switch (property) {
            case 'textures': {
                this.world?.toggleTextures();
                break;
            }

            case 'rays': {
                this.playerCamera?.toggleRays();

            }
        }
    }

    private step() {
        switch (this.state) {
            case GameState.RUNNING: {
                this.eventManager?.step();
                this.draw();
                break;
            }

            case GameState.PAUSED: {

                break;
            }

            case GameState.STOPPED: {

                break;
            }

            case GameState.LOADING: {
                break;
            }

            default: {
                throw new Error(`UNKNOWN GAME STATE: ${this.state}`);
            }
        }
    }

    private draw() {
        this.world?.injectRays(this.playerCamera?.getBuffer() || []);
        this.minimap?.draw();
        this.gameScreen?.draw();
    }

    private async setupMap(options: GameOptions) {
        const map = await this.loadMap(options.initialMapName);
        return new Map(map);
    }

    private async loadMap(path: string) {
        const res = await fetch(path);
        const data: MapData = await res.json();
        return data;
    }

    private async setupGame(options: GameOptions) {
        // Create Map
        this.map = await this.setupMap(options);

        // Get some constants
        const { mapDimensions, playerStart } = options;
        const { dimensions } = this.map.getData();
        const height = mapDimensions[1] / dimensions[1];
        const width = mapDimensions[0] / dimensions[0];
        const loc: [number, number] = [playerStart[0] * width, playerStart[1] * height];

        // Create Player Camera
        this.playerCamera = new Camera(this.map, width, height);

        // Create Player
        this.player = new Player(loc, width, height, this.map, this.playerCamera);

        // Create Minimap
        this.minimap = new Screen('minimap', options.mapDimensions);
        this.minimap.addLayer(this.map);
        this.minimap.addLayer(this.player);

        // Create Events Manager
        this.eventManager = new EventManager();
        this.eventManager.addEventListener('keys', this.player);

        // Create World
        this.world = new World(this.map);

        // Create Game Screen
        this.gameScreen = new Screen('gamescreen', options.screenDimensions);
        this.gameScreen.addLayer(this.world);

        this.state = GameState.RUNNING;
    }
}