import {SubGameState} from "./SubGameState";
import {services} from "../../../ServiceLocator";
import GameStates from "../GameStates";
import {Timer} from "../../../lib/Timer";
import {SOUNDS} from "../../../constants/sounds";

export class Spinning extends SubGameState {
    enter() {
        const isSpeed = this.data.isSpeedAnimation;
        this.stopTimer = new Timer(isSpeed ? 1000 : 2000);
        this.stopTimer.start();
        this.startTime = Date.now();
        this.isSkiped = false;
        this.spinResult = null;
        this.executeSpin();
    }

    async executeSpin() {
        try {
            this.game.goToIdle();
            this.game.spin();
            this.hud.setWin(0);

            const resultPromise = this.gameLogic.spin(this.data.bet);

            this.hud.setBalance(this.gameLogic.balance);
            this.gameState.updateBonusIcon();

            this.spinResult = await resultPromise;
        } catch (e) {
            this.onServerError(e)
        }
    }

    onServerError(error) {
        if (error.custom_message === '-1') {
            this.gameState.rejectSpin();
            this.gameState.goTo(GameStates.IDLE);
            return;
        }

        this.gameState.goTo(GameStates.ERROR, error);
    }

    spin() {
        if (this.gameState.isAutoplayer) {
            this.gameState.stopAutoplay();
        }

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
            this.gameState.goTo(GameStates.WINNING, result);
            services.audio.playSfx(SOUNDS.spin.end);
        }
    }
}
