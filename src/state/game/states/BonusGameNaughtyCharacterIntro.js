import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";

export class BonusGameNaughtyCharacterIntro extends SubGameState {
    enter() {
        super.enter();
        this.gameState.playBonusGameMusic();

        this.gameState.startSuperGame().then(() => {
            this.gameState.goTo(GameStates.BonusGameNaughtyCharacterGame);
        });
    }

    exit() {

    }
}
