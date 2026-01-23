import {SubGameState} from "./SubGameState";
import {services} from "../../../ServiceLocator";
import GameStates from "../GameStates";
import {Timer} from "../../../lib/Timer";
import {FREE_SPINS_TYPES, HIRES_SYMBOLS} from "../../../service/api/OfflineAPI";
import {SOUNDS} from "../../../constants/sounds";

export class FreespinSpinning extends SubGameState {
    enter() {
        const isSpeedAnimation = this.data.isSpeedAnimation;
        this.stopTimer = new Timer(isSpeedAnimation ? 1000 : 2000);
        this.stopTimer.start();
        const isSpeed = this.data.isSpeedAnimation;
        this.startTime = Date.now();
        this.isSkiped = false;
        this.spinResult = null;
        this.executeSpin();
    }

    async executeSpin() {
        try {
            const symbols = this.gameLogic.getFreeSpinsType() === FREE_SPINS_TYPES.FULL_PLEASURE ? HIRES_SYMBOLS : undefined;

            this.game.spin(undefined, symbols);

            this.hud.setFreeSpinsCount(this.gameLogic.getFreeSpinsLeft() - 1);
            this.spinResult = await this.gameLogic.freeSpin();
        } catch (e) {
            this.onServerError(e)
        }
    }

    onServerError(error) {
        if (error.custom_message === '-1') {
            this.gameState.rejectSpin()
            this.gameState.goTo(GameStates.FREE_SPIN_SPINNING);
            return;
        }

        this.gameState.goTo(GameStates.ERROR, error);
    }

    spin() {
        this.data.freeSpinAutoSpin = false;
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
            this.gameState.goTo(GameStates.FREE_SPIN_WINNING, result);
            services.audio.playSfx(SOUNDS.spin.end);
        }
    }
}
