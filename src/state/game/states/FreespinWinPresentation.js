import GameStates from "../GameStates";
import {SubGameState} from "./SubGameState";

export class FreespinWinPresentation extends SubGameState {
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
            this.gameState.goTo(GameStates.FREE_SPIN_OUTRO);
        } else {
            if (this.data.freeSpinAutoSpin) {
                this.gameState.goTo(GameStates.FREE_SPIN_SPINNING);
            } else {
                this.gameState.goTo(GameStates.FREE_SPIN_IDLE);
            }
        }
    }

    spin() {
        this.data.freeSpinAutoSpin = false;
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
