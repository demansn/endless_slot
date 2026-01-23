import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";

export class FreespinIdle extends SubGameState {
    enter() {
        this.hud.updateAdditionalBonuses(this.bonuses.getActive());
    }

    spin() {
        this.gameState.goTo(GameStates.FREE_SPIN_SPINNING);
    }
}
