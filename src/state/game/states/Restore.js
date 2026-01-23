import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";
import {services} from "../../../ServiceLocator";

export class Restore extends SubGameState {
    enter() {
        this.restore();
    }

    async restore() {

        this.gameState.goTo(GameStates.IDLE);
    }
}
