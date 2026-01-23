import {SubGameState} from "./SubGameState";

export class BonusGameDoubleLecheryOutro extends SubGameState {
    enter() {
        super.enter();
    }

    exit() {
        this.gameState.setMainGameBackground();
        this.gameState.playMainTheme();
    }
}
