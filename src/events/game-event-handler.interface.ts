
export interface GameEventHandler {
    handleEvent: (name: string, event: CustomEvent) => void;
}