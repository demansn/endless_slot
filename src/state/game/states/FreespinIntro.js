import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";
import services from "../../../ServiceLocator";
import {IntroPopup} from "../../../popup/IntroPopup";
import {FREE_SPINS_TYPES} from "../../../service/api/OfflineAPI";
import {Features} from "../../../constants";
//

export class FreespinIntro extends SubGameState {
    enter() {
        super.enter();
        this.startFreeSpins();
        this.gameState.playBonusGameMusic();
    }

    async startFreeSpins() {
        if (this.gameLogic.hasFreeSpins()) {
            this.gameLogic.nextFreeSpins();

            services.audio.playSfx('FreeGame_Start');
            this.hud.setFreeSpinState(this.gameLogic.freeSpins.getFreeSpinsLeft(),  this.gameLogic.freeSpins.getFreeSpinsTotalWin(), this.gameLogic.getFreeSpinsType(), this.gameLogic.freeSpins.getFreeSpinsBet());

            if (this.gameLogic.getFreeSpinsType() === FREE_SPINS_TYPES.FULL_PLEASURE) {
                await this.popups.showPopup('IntroPopup', {type: IntroPopup.TYPE.FULL_PLEASURE});
                this.gameState.setFreeSpinsBackground(Features.FULL_PLEASURE);
            } else if (this.gameLogic.getFreeSpinsType() === FREE_SPINS_TYPES.DOUBLE_LECHERY){
                await this.popups.showPopup('IntroPopup', {type: IntroPopup.TYPE.DOUBLE_LECHERY});
                this.gameState.setFreeSpinsBackground(Features.DOUBLE_LECHERY);
            } else {
                await this.popups.showPopup('IntroPopup', {type: IntroPopup.TYPE.FREE_SPINS});
                this.gameState.setFreeSpinsBackground(Features.FREE_SPINS);
            }

            this.gameState.goTo(GameStates.FREE_SPIN_SPINNING);
            this.data.freeSpinAutoSpin = true;
        } else {
            this.gameState.goTo(GameStates.IDLE);
        }
    }

    exit() {}
    spin() {}
}
