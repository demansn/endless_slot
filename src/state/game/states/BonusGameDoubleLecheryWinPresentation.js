
import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";

export class BonusGameDoubleLecheryWinPresentation extends SubGameState {
    enter(result) {
        this.resultScenarion = this.gameState.makeResultPresentation(result)
        this.resultScenarion.onComplete.addOnce(this.toNextState.bind(this));
        this.resultScenarion.start();
    }

    exit() {
        super.exit();
        this.game.goToIdle();
    }

    toNextState() {
        if (this.gameLogic.freeSpinsDone()) {
            this.gameState.goTo(GameStates.BonusGameDoubleLecheryOutro);
        } else {
            this.gameState.goTo(GameStates.BonusGameDoubleLecherySpinning);
        }
    }

    spin() {
        if (this.resultScenarion) {
            this.resultScenarion.skipAllIfPossible();
        }

        if (this.resultScenarion ? this.resultScenarion.completed : true) {
            this.resultScenarion = null;
        }
    }

    makeResultPresentation(result) {
        return this.gameState.makeResultPresentation(result);
    }
}
