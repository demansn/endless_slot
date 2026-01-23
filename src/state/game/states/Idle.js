import {SubGameState} from "./SubGameState";
import {services} from "../../../ServiceLocator";
import GameStates from "../GameStates";

export class Idle extends SubGameState {
    enter() {
        this.hud.updateAdditionalBonuses(this.bonuses.getActive());
        this.hud.enableBonusButtons();

        if (this.gameLogic.hasSuperGame()) {
            this.gameState.goTo(GameStates.BonusGameNaughtyCharacterIntro);
        } else if (this.gameLogic.hasDoubleLecheryFinal()) {
            this.gameState.goTo(GameStates.BonusGameDoubleLecheryFinal, this.gameLogic.nextDoubleLecheryFinal());
        } else if (this.gameLogic.hasFreeSpins()) {
            this.gameState.goTo(GameStates.FREE_SPIN_INTRO);
        } else if (this.gameLogic.hasRewards()){
            this.gameState.goTo(GameStates.LevelReward);
        }
    }

    exit() {
        this.hud.disableBonusButtons();
    }

    spin() {
        if (services.gameLogic.canBet()) {
            this.gameState.goTo(GameStates.SPINNING);
        } else {
            services.get('popups').showPopup('noFunds');

            if (this.gameState.isAutoplayer) {
                this.gameState.stopAutoplay();
            }
        }
    }

    update(dt) {
        super.update(dt);

        if (this.gameState.autoplayer.isSpinning &&  !this.popups.isShownPopup() ) {
            this.spin();
        }
    }
}
