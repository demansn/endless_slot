import {services} from "../../../ServiceLocator";
import GameStates from "../GameStates";
import {SubGameState} from "./SubGameState";
import {spin_mode} from "../../GameState";
import Utils from "../../../Utils";

export class WinPresentation extends SubGameState {
    enter(result) {
        this.hud.setWin(0);
        this.resultScenarion = this.gameState.makeResultPresentation(result)
        this.resultScenarion.onComplete.addOnce(() => {
            this.exitFromThis();
        });
        this.resultScenarion.start();
    }

    exit() {
        super.exit();

        const totalWin = this.gameLogic.getTotalWin();
        const autoplayer = this.gameState.autoplayer;

        if (this.gameState.isAutoplayer) {
            let loss = 0;
            if (totalWin === 0) {
                loss = Utils.tryParse(this.gameLogic.bet);
            }

            autoplayer.next(totalWin, loss, 1)
            this.hud.updateAutoPlayProgress(autoplayer.progress());

            if (!this.gameState.isAutoplayer) {
                this.gameState.stopAutoplay();
            }
        }

        this.hud.setBalance(this.gameLogic.balance);
    }

    spin() {
        if (this.gameState.isAutoplayer) {
            this.gameState.stopAutoplay();
        }

        if (this.isDisabledSkip) {
            return;
        }

        if (this.resultScenarion) {
            this.resultScenarion.skipAllIfPossible();
        }

        if (this.resultScenarion ? this.resultScenarion.completed : true) {
            this.resultScenarion = null;

            if(!this.gameState.isAutoplayer && !services.popupManager.isShownPopup()) {
                this.exitFromThis();
            }
        }
    }

    exitFromThis() {
        if (this.gameLogic.hasSuperGame()) {
            this.gameState.goTo(GameStates.BonusGameNaughtyCharacterIntro);
        } else if (this.gameLogic.hasFreeSpins()) {
            this.gameState.goTo(GameStates.FREE_SPIN_INTRO)
        } else {
            this.gameState.goTo(GameStates.IDLE);
        }
    }

    makeResultPresentation(result) {
        return [];
    }


    disableSkip() {
        this.isDisabledSkip = true;
    }

    enableSkip() {
        this.isDisabledSkip = false;
    }
}
