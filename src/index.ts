import { Game } from "./game/Game";
import mainMap from './assets/maps/main.json';

const $toggleTexture = document.getElementById('toggle_textures');
const $toggleRays = document.getElementById('toggle_rays');


const game = new Game({
    mapDimensions: [400, 400],
    screenDimensions: [1000, 500],
    playerStart: [2, 1],
    refreshRate: 10,
    initialMap: mainMap,
});

$toggleTexture?.addEventListener('click', (e) => {
    e.preventDefault();
    game.toggleProperty('textures');
});
$toggleRays?.addEventListener('click', (e) => {
    e.preventDefault();
    game.toggleProperty('rays');
});

game.loop();