import { Camera } from '../camera/Camera';
import { EventManager } from '../events/EventManager';
import { Map } from '../map/Map';
import { Player } from '../player/Player';
import { Screen } from '../screen/Screen';
import { World } from '../world/World';
import { GameOptions } from './game-options.interface';
import { GameState } from './GameState.enum';

export class Game {
    private map: Map;
    private minimap: Screen;
    private gameScreen: Screen;
    private player: Player;
    private playerCamera: Camera;
    private refreshRate: number;
    private eventManager: EventManager;
    private world: World;

    private state: GameState = GameState.RUNNING;

    constructor(options: GameOptions) {
        this.map = this.setupMap(options);
        this.playerCamera = this.setupPlayerCamera(options);
        this.player = this.setupPlayer(options);
        this.world = this.setupWorld();
        this.gameScreen = this.setupGameScreen(options);
        this.minimap = this.setupMinimap(options);
        this.eventManager = this.setupEvents();
        this.refreshRate = options.refreshRate;
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
                this.world.toggleTextures();
                break;
            }

            case 'rays': {
                this.playerCamera.toggleRays();

            }
        }
    }

    private step() {
        switch (this.state) {
            case GameState.RUNNING: {
                this.eventManager.step();
                this.draw();
                break;
            }

            case GameState.PAUSED: {

                break;
            }

            case GameState.STOPPED: {

                break;
            }

            default: {
                throw new Error(`UNKNOWN GAME STATE: ${this.state}`);
            }
        }
    }

    private draw() {
        this.world.injectRays(this.playerCamera.getBuffer());
        this.minimap.draw();
        this.gameScreen.draw();
    }

    private setupMap(options: GameOptions) {
        return new Map(options.initialMap);
    }

    private setupMinimap(options: GameOptions) {
        const minimap = new Screen('minimap', options.mapDimensions);
        minimap.addLayer(this.map);
        minimap.addLayer(this.player);
        return minimap;
    }

    private setupPlayer(options: GameOptions) {
        const { playerStart, initialMap, mapDimensions } = options;
        const { dimensions } = initialMap;
        const height = mapDimensions[1] / dimensions[1];
        const width = mapDimensions[0] / dimensions[0];
        const loc: [number, number] = [playerStart[0] * width, playerStart[1] * height];
        return new Player(loc, width, height, this.map, this.playerCamera);
    }

    private setupEvents() {
        const manager = new EventManager();
        manager.addEventListener('keys', this.player);
        return manager;
    }

    private setupWorld() {
        const world = new World(this.map);
        return world;
    }

    private setupGameScreen(options: GameOptions) {
        const gameScreen = new Screen('gamescreen', options.screenDimensions);
        gameScreen.addLayer(this.world);
        return gameScreen;
    }

    private setupPlayerCamera(options: GameOptions) {
        const { initialMap, mapDimensions } = options;
        const { dimensions } = initialMap;
        const height = mapDimensions[1] / dimensions[1];
        const width = mapDimensions[0] / dimensions[0];
        const playerCamera = new Camera(this.map, width, height);
        return playerCamera;
    }
}