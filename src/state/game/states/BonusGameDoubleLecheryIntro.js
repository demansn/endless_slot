import {SubGameState} from "./SubGameState";
import services from "../../../ServiceLocator";
import {FREE_SPINS_TYPES} from "../../../service/api/OfflineAPI";
import {IntroPopup} from "../../../popup/IntroPopup";
import {Features} from "../../../constants";
import GameStates from "../GameStates";

export class BonusGameDoubleLecheryIntro extends SubGameState {
    enter() {
        super.enter();
        this.gameState.playBonusGameMusic();
        this.start();
    }

    async start() {
        if (this.gameLogic.hasDoubleLechery()) {
            this.gameLogic.nextDoubleLechery();
            services.audio.playSfx('FreeGame_Start');

            await this.popups.showPopup('IntroPopup', {type: IntroPopup.TYPE.DOUBLE_LECHERY});
            this.gameState.setFreeSpinsBackground(Features.DOUBLE_LECHERY);
            this.hud.setFreeSpinState(this.gameLogic.getFreeSpinsLeft(), this.gameLogic.getFreeSpinsTotalWin());
            this.gameState.goTo(GameStates.BonusGameDoubleLecherySpinning);
        } else {
            this.gameState.goTo(GameStates.IDLE);
        }
    }
}
