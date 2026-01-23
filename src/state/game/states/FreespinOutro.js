import {gsap} from "gsap";
import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";
import {FREE_SPINS_TYPES} from "../../../service/api/OfflineAPI";

export class FreespinOutro extends SubGameState {
    enter() {
        super.enter();

        if (this.gameLogic.getFreeSpinsType() === FREE_SPINS_TYPES.DOUBLE_LECHERY) {
            this.gameState.goTo(GameStates.BonusGameDoubleLecheryFinal, this.gameLogic.freeSpins.current.final);
            this.gameLogic.freeSpins.clearCurrent();
        } else {
            this.finish();
        }
    }

    async finish() {
        if (this.gameLogic.getFreeSpinsTotalWin() > 0) {
            await this.popups.showPopup('TotalWinPopup', {win: this.gameLogic.getFreeSpinsTotalWin(), id: 1});
        }

        this.hud.setMainGameState();
        this.gameState.setMainGameBackground();
        this.hud.animateWin(0);
        this.hud.setBalance(this.gameLogic.balance);
        this.gameState.playMainTheme();
        this.gameLogic.freeSpins.clearCurrent();

        if (this.gameLogic.hasFreeSpins()) {
            this.gameState.goTo(GameStates.FREE_SPIN_INTRO);
        } else {
            this.gameState.goTo(GameStates.IDLE);
        }
    }

    spin() {}
}
