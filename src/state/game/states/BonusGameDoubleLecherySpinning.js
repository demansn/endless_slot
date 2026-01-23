import {SubGameState} from "./SubGameState";
import {Timer} from "../../../lib/Timer";
import {FREE_SPINS_TYPES, HIRES_SYMBOLS} from "../../../service/api/OfflineAPI";
import GameStates from "../GameStates";

export class BonusGameDoubleLecherySpinning extends SubGameState {
    enter() {
        const isSlow = services.saved.data.animationSpeed < 100;
        this.stopTimer = new Timer(isSlow ? 2000 : 1000);
        this.stopTimer.start();

        this.sfx = services.audio.playSfx(isSlow ?  'spinning_default' : 'spinning_speed');
        this.startTime = Date.now();
        this.isSkiped = false;
        this.spinResult = null;
        this.executeSpin();
    }

    async executeSpin() {
        try {
            this.game.spin();

            this.hud.setFreeSpinsCount(this.gameLogic.getFreeSpinsLeft() - 1);
            this.spinResult = await this.gameLogic.doubleLecherySpin();
        } catch (e) {
            this.onServerError(e)
        }
    }

    onServerError(error) {
        if (error.custom_message === '-1') {
            this.gameState.rejectSpin()
            this.gameState.goTo(GameStates.BonusGameDoubleLecherySpinning);
            return;
        }

        this.gameState.goTo(GameStates.ERROR, error);
    }

    spin() {
        if (this.stopTimer && !this.stopTimer.isDone()) {
            this.stopTimer.complete();
            this.isSkiped = true;
        }
    }

    update(dt) {
        super.update(dt);

        this.checkSpinEnd();
    }

    checkSpinEnd() {
        const result = this.spinResult;

        if (result && this.stopTimer && this.stopTimer.isDone()) {
            if (this.sfx && this.isSkiped) {
                this.sfx.stop();
            }
            this.gameState.goTo(GameStates.BonusGameDoubleLecheryWinPresentation, result);
        }
    }
}
