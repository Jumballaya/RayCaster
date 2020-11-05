import { GameEventHandler } from './game-event-handler.interface';

/**
 * Handles Game Events like key presses and mouse movement
 */
export class EventManager {

    private handlers: { [key: string]: GameEventHandler[] } = {};
    private keys: string[] = [];

    constructor() {
        document.body.addEventListener('keydown', (e: KeyboardEvent) => {
            const key = e.key;
            if (this.keys.includes(key)) {
                return;
            }
            this.keys.push(key);
        });

        document.body.addEventListener('keyup', (e) => {
            const key = e.key;
            if (this.keys.includes(key)) {
                this.keys = this.keys.filter(k => k !== key);
            }
        });
    }

    public addEventListener(name: string, handler: GameEventHandler) {
        if (!this.handlers[name]) {
            this.handlers[name] = [handler];
        } else {
            this.handlers[name].push(handler);
        }

        // Return method to remove listener
        return () => {
            this.handlers[name] = this.handlers[name].filter((h) => h !== handler);
        }
    }


    public step() {
        this.handlers.keys.forEach(h => {
            h.handleEvent('keys', new CustomEvent('keys', { detail: this.keys }));
        });
    }
}